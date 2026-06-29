/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type { ModelStruct, FrameStruct } from "@hdml/schemas";
import type { HDOM, Model, Frame } from "@hdml/types";
import type {
  CompilerInput,
  CompilerResult,
  CompilerError,
  CompilerDeps,
} from "./compileConnections";
import { message } from "./compileConnections";
import { applyAdaptation } from "./applyAdaptation";
import { reconstructDocument } from "./compileSource";
import {
  injectObjectVars,
  UndefinedEnvError,
  UndefinedScopeError,
} from "./injectVars";

/** Serializes a `Model` object back to a `ModelStruct`. */
function modelToStruct(
  deps: CompilerDeps,
  model: Model,
): ModelStruct {
  const bytes = deps.serialize(model, deps.StructType.ModelStruct);
  return deps.structurize(
    bytes,
    deps.StructType.ModelStruct,
  ) as ModelStruct;
}

/** Serializes a `Frame` object back to a `FrameStruct`. */
function frameToStruct(
  deps: CompilerDeps,
  frame: Frame,
): FrameStruct {
  const bytes = deps.serialize(frame, deps.StructType.FrameStruct);
  return deps.structurize(
    bytes,
    deps.StructType.FrameStruct,
  ) as FrameStruct;
}

/**
 * Wraps the composed query in the projection layer (RFC 002 §5.3).
 * Always emitted as a top-level
 * `with _projection as (…) select <cols> from _projection` — never a
 * `SELECT … FROM (subquery)`, since a subquery containing a `WITH`
 * can fail on Trino. Requested `columns` become the quoted select
 * list; empty / nil `columns` projects `*` (all columns of the leaf
 * frame). The wrapper is unconditional so the chain's nesting depth
 * is uniform (`frames.length + 1`); the frame's internal grouping /
 * sorting / filtering is untouched, only the result columns narrow.
 */
function projectColumns(
  composed: string,
  columns: string[] | undefined,
): string {
  const projection =
    columns && columns.length
      ? columns.map((c) => `"${c}"`).join(", ")
      : "*";
  return (
    `with _projection as (\n${composed})\n` +
    `select ${projection}\nfrom _projection\n`
  );
}

/**
 * Runs the `sql` output mode (RFC 002 §5.1) as a single pipeline:
 * reconstruct the whole document (shared with `source`) → parse to a
 * DOM → **adaptation** (the single-role `applyAdaptation` body, run
 * before injection) → re-parse the adapted HTML → strict `${env.*}` /
 * `${scope.*}` injection → compose the
 * chain via `getFrameSQL` → apply the `columns` projection (§5.3).
 *
 * Adaptation's CSS-like selectors are document-scoped, so there is no
 * per-element fast path: every query goes through the DOM round-trip
 * (cheap relative to query execution). The round-trip's frames come
 * back in `sortFrames` order — model-adjacent first — so composition
 * is a **forward** fold: each frame wraps the previous, leaving the
 * requested (leaf) frame as the outermost frame of the chain — itself
 * wrapped by the always-emitted projection layer (`*` when no
 * `columns`). Returns `{ result: ["WITH … SELECT …"] }`, or a
 * structured error.
 */
export function compileSql(
  deps: CompilerDeps,
  input: CompilerInput,
): CompilerResult | CompilerError {
  if (!input.model) {
    return {
      error: "missing_model",
      detail: "sql mode requires a model",
    };
  }
  const env = input.env ?? {};
  const scope = input.scope ?? {};

  // 1. Reconstruct the whole document as HTML (shared with `source`).
  let html: string;
  try {
    html = reconstructDocument(deps, input);
  } catch (e) {
    return { error: "structurize_failed", detail: message(e) };
  }

  // 2. DOM round-trip: parse → adaptation (single role, before
  //    injection) → re-parse. A throw (bad selector / unknown
  //    action, D3) maps to adaptation_failed. Selectors run over the
  //    assembled document, never fragments.
  let hdom: HDOM;
  try {
    const dom = deps.parseHTML(html);
    applyAdaptation(dom, input.adaptation_policy, input.role ?? "");
    hdom = deps.parseHDML(dom.toString());
  } catch (e) {
    return { error: "adaptation_failed", detail: message(e) };
  }
  const model = hdom.models[0];
  const frames = hdom.frames;
  if (!model) {
    return {
      error: "missing_model",
      detail: "no model in the adapted document",
    };
  }

  // 3. Strict ${env.*} / ${scope.*} injection (after adaptation).
  try {
    injectObjectVars(model, env, scope);
    for (const frame of frames) {
      injectObjectVars(frame, env, scope);
    }
  } catch (e) {
    if (e instanceof UndefinedEnvError) {
      return { error: "undefined_env", variable: e.variable };
    }
    if (e instanceof UndefinedScopeError) {
      return { error: "undefined_scope", variable: e.variable };
    }
    return { error: "injection_failed", detail: message(e) };
  }

  // 4. Compose via getFrameSQL (forward fold), project columns. The
  //    `level` arg indents each wrapping `with … as (…)` under its
  //    parent. The projection wrapper (always emitted) is level 0, so
  //    the chain starts one level in: depth is `frames.length + 1`,
  //    the leaf (outermost) frame sits at level 1, every frame deeper
  //    one level further, and the model (innermost base) at `depth`.
  //    `frames` is model-adjacent first, so frame i sits at
  //    `depth - 1 - i`.
  try {
    const depth = frames.length + 1;
    let from = {
      name: model.name,
      sql: deps.getModelSQL(modelToStruct(deps, model), depth),
    };
    for (let i = 0; i < frames.length; i++) {
      from = {
        name: frames[i].name,
        sql: deps.getFrameSQL(
          frameToStruct(deps, frames[i]),
          from,
          depth - 1 - i,
        ),
      };
    }
    return { result: [projectColumns(from.sql, input.columns)] };
  } catch (e) {
    return { error: "generation_failed", detail: message(e) };
  }
}

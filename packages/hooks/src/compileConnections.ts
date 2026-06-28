/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type { serialize, structurize } from "@hdml/buffer";
import type { StructType } from "@hdml/buffer";
import type { deserialize } from "@hdml/buffer";
import type { base64ToBytes } from "@hdml/hash";
import type {
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
  getModelSQL,
  getFrameSQL,
} from "@hdml/stringifier";
import type { parseHTML, parseHDML } from "@hdml/parser";
import type { Connection } from "@hdml/types";
import type { ConnectionStruct } from "@hdml/schemas";
import type { AdaptationPolicy } from "./adaptation";

/**
 * One connection artifact in the compiler envelope: the bare element
 * `name` plus the base64 of its serialized `ConnectionStruct`.
 */
export interface ConnectionEntry {
  name: string;
  content: string;
}

/**
 * The `hdml_compiler.wasm` input envelope (RFC 002 §3). The
 * `connection` (Slice B), `source`, and `sql` (both Slice C) output
 * modes are implemented; `effective` (Slice D) is not. `frames` /
 * `model` carry the closure (leaf→root) the `source` / `sql` branches
 * consume. `env` / `scope` drive `sql` injection; `columns` is the
 * `sql` SELECT projection; `adaptation_policy` / `role` are carried
 * for D's adaptation step but unused in C (D4). `role` is the
 * caller's single active role (single-role contract, Slice D D1).
 */
export interface CompilerInput {
  connections?: ConnectionEntry[];
  env?: Record<string, string>;
  output?: string;
  frames?: string[];
  model?: string;
  adaptation_policy?: AdaptationPolicy;
  role?: string;
  scope?: Record<string, unknown>;
  columns?: string[];
}

/** A flat `result` array — the uniform compiler output shape. */
export interface CompilerResult {
  result: string[];
}

/** A structured compiler failure. */
export interface CompilerError {
  error: string;
  detail?: string;
  variable?: string;
}

/**
 * The `@hdml/*` functions the compiler branches need, injected so the
 * WASM bin entry resolves them from `globalThis` (provided by the
 * plugin) while tests pass the real implementations in directly.
 * `getConnectionSQLs` serves `connection`; `getModelHTML` /
 * `getFrameHTML` serve `source`. The `sql` branch reconstructs the
 * document (`getModelHTML` / `getFrameHTML`), round-trips it through
 * the DOM (`parseHTML` for adaptation selectors, `parseHDML` to
 * re-extract the adapted HDOM), then emits SQL (`getModelSQL` /
 * `getFrameSQL`).
 */
export interface CompilerDeps {
  deserialize: typeof deserialize;
  serialize: typeof serialize;
  structurize: typeof structurize;
  base64ToBytes: typeof base64ToBytes;
  getConnectionSQLs: typeof getConnectionSQLs;
  getModelHTML: typeof getModelHTML;
  getFrameHTML: typeof getFrameHTML;
  getModelSQL: typeof getModelSQL;
  getFrameSQL: typeof getFrameSQL;
  parseHTML: typeof parseHTML;
  parseHDML: typeof parseHDML;
  StructType: typeof StructType;
}

/** Signals a `${env.VAR}` reference with no value in the env map. */
class UndefinedEnvError extends Error {
  public readonly variable: string;
  public constructor(variable: string) {
    super(`undefined env variable: ${variable}`);
    this.variable = variable;
  }
}

const TEMPLATE = /\$?\$\{([^}]*)\}/g;
const ENV_PREFIX = "env.";

/**
 * Resolves `${env.VAR}` references in a single attribute value
 * against the env map, and un-escapes `$${...}` → literal `${...}`.
 * Leaves
 * `${scope.*}` (and any non-`env` reference) verbatim — connections
 * are tenant-global, so scope is never injected (RFC 002 §4.2.2).
 *
 * @throws {UndefinedEnvError} when a `${env.VAR}` has no env value.
 */
export function injectEnv(
  value: string,
  env: Record<string, string>,
): string {
  return value.replace(TEMPLATE, (match: string, expr: string) => {
    if (match.startsWith("$$")) {
      // Escaped: $${...} -> literal ${...}, no substitution.
      return match.slice(1);
    }
    if (expr.startsWith(ENV_PREFIX)) {
      const name = expr.slice(ENV_PREFIX.length);
      if (!(name in env)) {
        throw new UndefinedEnvError(name);
      }
      return env[name];
    }
    // ${scope.*} or any other reference: pass through verbatim.
    return match;
  });
}

/**
 * Mutates a deserialized connection in place, injecting `${env.*}`
 * into every string-valued connector parameter. Works uniformly
 * across connector types — it walks `options.parameters` rather than
 * enumerating a per-field allowlist.
 */
function injectConnectionEnv(
  conn: Connection,
  env: Record<string, string>,
): void {
  const params = conn.options?.parameters as
    | Record<string, unknown>
    | undefined;
  if (!params) {
    return;
  }
  for (const key of Object.keys(params)) {
    const v = params[key];
    if (typeof v === "string") {
      params[key] = injectEnv(v, env);
    }
  }
}

/**
 * Runs the `connection` output mode: per connection, deserialize the
 * `ConnectionStruct`, inject `${env.*}`, re-serialize, and emit the
 * flat find-drop-create triple via `getConnectionSQLs`. The envelope
 * passes one connection per call, so a valid connection yields
 * exactly `[SHOW, DROP, CREATE]` and a nameless one yields `[]`.
 */
export function compileConnections(
  deps: CompilerDeps,
  input: CompilerInput,
): CompilerResult | CompilerError {
  const env = input.env ?? {};
  const result: string[] = [];
  for (const entry of input.connections ?? []) {
    let conn: Connection;
    try {
      conn = deps.deserialize(
        deps.base64ToBytes(entry.content),
        deps.StructType.ConnectionStruct,
      ) as Connection;
    } catch (e) {
      return { error: "deserialize_failed", detail: message(e) };
    }
    try {
      injectConnectionEnv(conn, env);
    } catch (e) {
      if (e instanceof UndefinedEnvError) {
        return { error: "undefined_env", variable: e.variable };
      }
      return { error: "injection_failed", detail: message(e) };
    }
    try {
      const bytes = deps.serialize(
        conn,
        deps.StructType.ConnectionStruct,
      );
      const struct = deps.structurize(
        bytes,
        deps.StructType.ConnectionStruct,
      ) as ConnectionStruct;
      result.push(...deps.getConnectionSQLs(struct));
    } catch (e) {
      return { error: "generation_failed", detail: message(e) };
    }
  }
  return { result };
}

/** Extracts a human-readable message from an unknown thrown value. */
export function message(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

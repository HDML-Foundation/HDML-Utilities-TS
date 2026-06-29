/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type {
  CompilerInput,
  CompilerResult,
  CompilerError,
  CompilerDeps,
} from "./compileConnections";
import { message } from "./compileConnections";
import { reconstructDocument } from "./compileSource";
import { applyAdaptation } from "./applyAdaptation";

/**
 * Runs the `effective` output mode (RFC 002 §5, Slice D): the
 * render/inspection view of a query closure. It reconstructs the
 * whole HDML document (shared with `source` / `sql`), parses it to a
 * DOM, applies the single active role's adaptation rules, and
 * serializes the adapted DOM straight back to HDML — then **stops**.
 *
 * Unlike `sql`, it never parses HDML, never injects `${env.*}` /
 * `${scope.*}`, and never composes SQL via `getFrameSQL` (D2): the
 * templates are left **literal** so a renderer can show the document
 * exactly as the active role sees it. With no policy / role (or a
 * matchless selector) adaptation is identity, so the output is
 * byte-identical to `source` (D5). It is lenient like `source` — no
 * `missing_model` gate.
 *
 * Returns `{ result: ["<adaptedHDML>"] }` (exactly one string —
 * `dom.toString()` in a single pass, no canonicalizing re-parse), or
 * `{ error: "structurize_failed" }` (reconstruct) /
 * `{ error: "adaptation_failed" }` (parse / adapt / serialize).
 */
export function compileEffective(
  deps: CompilerDeps,
  input: CompilerInput,
): CompilerResult | CompilerError {
  let html: string;
  try {
    html = reconstructDocument(deps, input);
  } catch (e) {
    return { error: "structurize_failed", detail: message(e) };
  }
  try {
    const dom = deps.parseHTML(html);
    applyAdaptation(dom, input.adaptation_policy, input.role ?? "");
    return { result: [dom.toString()] };
  } catch (e) {
    return { error: "adaptation_failed", detail: message(e) };
  }
}

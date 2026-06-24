/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type { ModelStruct, FrameStruct } from "@hdml/schemas";
import type {
  CompilerInput,
  CompilerResult,
  CompilerError,
  CompilerDeps,
} from "./compileConnections";
import { message } from "./compileConnections";

/**
 * Reconstructs the whole HDML document for one query closure as a
 * single HTML string: the base64 `ModelStruct` first, then each
 * base64 `FrameStruct` in the given order, structurized and
 * re-stringified via `getModelHTML` / `getFrameHTML`. This is the
 * unit both `source` mode and the `sql` branch's adaptation/injection
 * round-trip build on — adaptation's CSS-like selectors must see the
 * whole document, so it has to be assembled, not handled per element.
 * Throws (via `structurize` or the stringifiers) on a malformed
 * entry; callers map that to `structurize_failed`.
 */
export function reconstructDocument(
  deps: CompilerDeps,
  input: CompilerInput,
): string {
  const parts: string[] = [];
  if (input.model) {
    const model = deps.structurize(
      deps.base64ToBytes(input.model),
      deps.StructType.ModelStruct,
    ) as ModelStruct;
    parts.push(deps.getModelHTML(model));
  }
  for (const b64 of input.frames ?? []) {
    const frame = deps.structurize(
      deps.base64ToBytes(b64),
      deps.StructType.FrameStruct,
    ) as FrameStruct;
    parts.push(deps.getFrameHTML(frame));
  }
  return parts.join("");
}

/**
 * Runs the `source` output mode (RFC 002 §5.1): reconstructs the HDML
 * document for the closure carried in the envelope. Unlike `sql`,
 * this branch ignores `env`, `scope`, `roles`, `columns`, and
 * adaptation: it is a pure struct→HTML round-trip. Returns
 * `{ result: ["<HDML>"] }` (exactly one string), or
 * `{ error: "structurize_failed" }` when any decode fails.
 */
export function compileSource(
  deps: CompilerDeps,
  input: CompilerInput,
): CompilerResult | CompilerError {
  try {
    return { result: [reconstructDocument(deps, input)] };
  } catch (e) {
    return { error: "structurize_failed", detail: message(e) };
  }
}

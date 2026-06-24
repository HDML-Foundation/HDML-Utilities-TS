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
 * Runs the `source` output mode (RFC 002 §5.1): reconstructs the HDML
 * document for the closure carried in the envelope. Each base64
 * `FrameStruct` (ordered leaf→root) and the base64 `ModelStruct` are
 * structurized, then re-stringified via `getModelHTML` /
 * `getFrameHTML` and joined into one document — model first, then
 * frames in order. Unlike `sql`, this branch ignores `env`, `scope`,
 * `roles`, `columns`, and adaptation: it is a pure struct→HTML
 * round-trip. Returns `{ result: ["<HDML>"] }` (exactly one string),
 * or `{ error: "structurize_failed" }` when any decode fails.
 */
export function compileSource(
  deps: CompilerDeps,
  input: CompilerInput,
): CompilerResult | CompilerError {
  const parts: string[] = [];
  try {
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
  } catch (e) {
    return { error: "structurize_failed", detail: message(e) };
  }
  return { result: [parts.join("")] };
}

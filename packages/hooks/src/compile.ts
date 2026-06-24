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
import { compileConnections } from "./compileConnections";
import { compileSource } from "./compileSource";
import { compileSql } from "./compileSql";

/**
 * Dispatches the compiler envelope on `output`. `connection`
 * (Slice B), `source`, and `sql` (Slice C) are wired; `effective`
 * (D) falls through to `invalid_output` so the dispatch stays
 * extensible without pre-empting that slice. Lives apart from the
 * per-mode branches so the generic dispatcher does not sit inside —
 * and import back — any single branch.
 */
export function compile(
  deps: CompilerDeps,
  input: CompilerInput,
): CompilerResult | CompilerError {
  switch (input.output) {
    case "connection":
      return compileConnections(deps, input);
    case "source":
      return compileSource(deps, input);
    case "sql":
      return compileSql(deps, input);
    default:
      return {
        error: "invalid_output",
        detail: `unsupported output mode: ${String(input.output)}`,
      };
  }
}

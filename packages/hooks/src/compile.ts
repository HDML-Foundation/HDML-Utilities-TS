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
import { compileEffective } from "./compileEffective";

/**
 * Dispatches the compiler envelope on `output`. `connection`
 * (Slice B), `source`, `sql` (Slice C), and `effective` (Slice D) are
 * wired; any unknown mode falls through to `invalid_output`. Lives
 * apart from the per-mode branches so the generic dispatcher does not
 * sit inside — and import back — any single branch.
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
    case "effective":
      return compileEffective(deps, input);
    default:
      return {
        error: "invalid_output",
        detail: `unsupported output mode: ${String(input.output)}`,
      };
  }
}

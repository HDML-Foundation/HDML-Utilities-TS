/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type { HdqlDiagnostic } from "@hdml/parser";
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
 *
 * ## `diagnostics`
 *
 * ★ Forwarded to {@link compileSql} and **to nothing else**, because
 * `parseHDML` is the only emitter of HDQL diagnostics and `sql` is
 * the only mode that calls it. `connection` deserializes
 * `ConnectionStruct`s, `source` re-stringifies structs, and
 * `effective` parses only the **HTML** DOM — none of the three has a
 * `parseHDML` call, so none can contribute an entry and all three
 * report `[]`. ⚠ **That `[]` is a structural fact, not an unwired
 * leg**: there is nothing for a later step to connect, and a reader
 * must not treat an empty set from those modes as evidence the
 * document is clean. Only `sql`'s set carries information, and even
 * then only about **adaptation** — see {@link compileSql}.
 *
 * ★ The field itself is guaranteed on every response by the bin
 * entry, not here: `compile` has five return shapes and four of the
 * branches have error returns of their own, so one spread at the
 * entry covers all of them uniformly — the same argument the `plugin`
 * echo is placed by (RFC 019/002 §4.6, and §2.3's A3 for why the
 * floor must be total).
 *
 * @param diagnostics Appended to by the `sql` branch only. Optional:
 * the ~40 existing direct callers of these branches collect nothing.
 */
export function compile(
  deps: CompilerDeps,
  input: CompilerInput,
  diagnostics?: HdqlDiagnostic[],
): CompilerResult | CompilerError {
  switch (input.output) {
    case "connection":
      return compileConnections(deps, input);
    case "source":
      return compileSource(deps, input);
    case "sql":
      return compileSql(deps, input, diagnostics);
    case "effective":
      return compileEffective(deps, input);
    default:
      return {
        error: "invalid_output",
        detail: `unsupported output mode: ${String(input.output)}`,
      };
  }
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDQL_DIAGNOSTIC_CODES } from "@hdml/types";
import { Element } from "./types/HDMLTreeAdapterMap";

/**
 * One HDQL parse diagnostic, as `parseHDML` hands it out
 * (RFC 019/002 §10). Every field is a scalar or `null`: the shape
 * must survive `JSON.stringify` and cross a WASM boundary, and
 * ★ it deliberately holds **no** reference to the element it
 * describes — a live tree node in a failing assertion kills the
 * jest worker with "Converting circular structure to JSON" and
 * names no test.
 */
export interface HdqlDiagnostic {
  /** The code. Messages and codes are both contract (§2.4). */
  code: HDQL_DIAGNOSTIC_CODES;
  /**
   * Always `"error"` today: the author wrote a construct that is
   * not in the output. Step 11 widens this to `"warning"` when
   * `misplaced-key` lands.
   */
  severity: "error";
  /** Human-readable, and contract — a test asserts the string. */
  message: string;
  /** `hdml-model[0]/hdml-dataset[0]/hdml-field[1]`, or `null`. */
  path: null | string;
  /** One-based line of the element's own start tag. */
  line: null | number;
  /** One-based column of the element's own start tag. */
  column: null | number;
  /** Zero-based offset of the element's own start tag. */
  offset: null | number;
}

/**
 * A sink entry: what a `get*Data` helper knows at the moment it
 * decides to drop an element, plus the element itself once the
 * adapter can attach it.
 *
 * ★ **Why the anchor is LAZY.** The helper is called from
 * `createElement`, which runs *before* the element exists as far as
 * the tree is concerned: `loc` is stamped later, by `parse5`'s
 * `_attachElementToTree` (`parse5/dist/parser/index.js:281`), and
 * `path` later still, by `appendChild` once the child↔parent link
 * exists in both directions. `_adoptNodes` then **re-stamps** the
 * top-level elements after that. So an anchor read at push time is
 * `null`, and an anchor read at *drain* time is final. The entry
 * therefore keeps the `Element` and the scalars are read once, in
 * {@link drainDiagnostics}.
 *
 * A reader who makes this eager gets `path: null` and a `null`
 * line triple on every diagnostic.
 */
interface DiagnosticEntry {
  code: HDQL_DIAGNOSTIC_CODES;
  severity: "error";
  message: string;
  element: null | Element;
}

/**
 * The per-parse collector. ★ It belongs to **one** `parseHDML`
 * call, never to the module: a `sql` compile parses twice — once on
 * the reconstructed document, once on the adapted one — and a
 * module-level sink would merge two documents' diagnostics with no
 * way to tell them apart (RFC 019/002 §3.5).
 */
export type DiagnosticSink = DiagnosticEntry[];

/**
 * Records a dropped element. `sink` is optional because the seven
 * `get*Data` helpers are called directly by ~60 existing tests and
 * by the module-singleton adapter, neither of which collects
 * anything; an absent sink and an empty sink must both work.
 *
 * @param sink The parse's sink, or `undefined` to discard.
 * @param code The diagnostic code.
 * @param message The author-facing message (contract, §2.4).
 */
export function pushDiagnostic(
  sink: undefined | DiagnosticSink,
  code: HDQL_DIAGNOSTIC_CODES,
  message: string,
): void {
  if (!sink) {
    return;
  }
  sink.push({ code, severity: "error", message, element: null });
}

/**
 * Attaches `element` to every entry pushed at or after `from`.
 * The helper that pushed could not do this: it is handed only
 * `attrs`, and the element literal does not exist until the
 * `switch` around the helper call has returned.
 *
 * @param sink The parse's sink, or `undefined`.
 * @param from `sink.length` as it was before the helper ran.
 * @param element The element the helper rejected.
 */
export function anchorDiagnostics(
  sink: undefined | DiagnosticSink,
  from: number,
  element: Element,
): void {
  if (!sink) {
    return;
  }
  for (let i = from; i < sink.length; i++) {
    sink[i].element = element;
  }
}

/**
 * Reads every entry's anchor and returns the public shape. Called
 * once, by `parseHDML`, after the parse has finished — which is the
 * only moment `loc` and `path` are final (see
 * {@link DiagnosticEntry}).
 *
 * ★ A pure read: it does not clear the sink. A sink that cleared
 * itself here would let a module-level collector pass the
 * two-parses-do-not-merge gate.
 *
 * `line`/`column`/`offset` come from `loc.startTag ?? loc` — the
 * element's **own** start tag, which is what the author needs to
 * look at — and are `null` when `loc` is, which is the case for a
 * node `parse5` synthesised. Such a node never carries `hddmData`
 * and so can never be the subject of a diagnostic.
 *
 * @param sink The parse's sink.
 *
 * @returns One {@link HdqlDiagnostic} per entry, in push order.
 */
export function drainDiagnostics(
  sink: DiagnosticSink,
): HdqlDiagnostic[] {
  return sink.map((entry) => {
    const loc = entry.element ? entry.element.loc : null;
    const at = loc ? loc.startTag ?? loc : null;
    return {
      code: entry.code,
      severity: entry.severity,
      message: entry.message,
      path: entry.element ? entry.element.path : null,
      line: at ? at.startLine : null,
      column: at ? at.startCol : null,
      offset: at ? at.startOffset : null,
    };
  });
}

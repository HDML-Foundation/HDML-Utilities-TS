/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * HDQL parse diagnostics — the data half's code space (019).
 * Disjoint from HDVL's `DiagnosticCode` / `WarningCode`
 * (RFC 019/002 §2.2), which live in `@hdml/components`. Nothing
 * keeps the two apart but this disjointness, so a new member here
 * must not reuse an HDVL code string.
 *
 * It lives in `@hdml/types` rather than in `@hdml/parser` because
 * HDML-Components needs the codes to render a diagnostic, so the
 * enum crosses a package boundary (RFC 019/002 §10.1).
 *
 * All ten members here are `error` severity: the author wrote a
 * construct that is NOT in the output. ★ A dropped element does
 * **not** fail the compile in 019 (RFC 019/002 §10.2, D11) — the
 * document still compiles and the envelope still carries a
 * `result`; the diagnostic says *what you wrote is not what you
 * got*. Making them fatal is a named successor.
 *
 * ★ `MISPLACED_KEY`, the one `warning`, is **step 11's** and lands
 * with item 3's V-rule (RFC 019/002 §10.3 lists eleven codes; ten
 * of them are here). The slot is reserved, not forgotten — do not
 * "complete" this enum.
 *
 * ★ It must NOT be added to `HDML_TAG_NAMES.test.ts`'s
 * `ATTRS_LISTS` record, whose `:165` asserts the size is exactly
 * 20.
 */
export enum HDQL_DIAGNOSTIC_CODES {
  MISSING_FIELD_NAME = "missing-field-name",
  MISSING_FRAME_NAME_OR_SOURCE = "missing-frame-name-or-source",
  MISSING_MODEL_NAME = "missing-model-name",
  MISSING_DATASET_ATTRS = "missing-dataset-attrs",
  MISSING_JOIN_SIDES = "missing-join-sides",
  MISSING_FILTER_TYPE = "missing-filter-type",
  MISSING_FILTER_OPERANDS = "missing-filter-operands",
  MISSING_CONNECTION_ATTRS = "missing-connection-attrs",
  UNKNOWN_CONNECTOR = "unknown-connector",
  MISSING_CONNECTOR_CREDENTIALS = "missing-connector-credentials",
}

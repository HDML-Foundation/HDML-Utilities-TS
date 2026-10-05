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
 * Ten of the eleven members are `error` severity: the author
 * wrote a construct that is NOT in the output. ★ A dropped element
 * does **not** fail the compile in 019 (RFC 019/002 §10.2, D11) —
 * the document still compiles and the envelope still carries a
 * `result`; the diagnostic says *what you wrote is not what you
 * got*. Making them fatal is a named successor.
 *
 * ★ `MISPLACED_KEY` is the one `warning`, and the severity is the
 * whole point of the distinction: unlike the ten errors it does
 * **not** accompany a drop. The field survives, with every other
 * attribute honoured — only its `key` declaration has no effect
 * there. A `warning` because **nothing reads `key` yet**: the
 * fan-out detector it exists for is a later project, so failing
 * or blanking a document over a misplaced declaration would be
 * disproportionate to what the author actually lost today
 * (RFC 019/001 §4.7, RFC 019/002 §10.2 D11).
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
  MISPLACED_KEY = "misplaced-key",
}

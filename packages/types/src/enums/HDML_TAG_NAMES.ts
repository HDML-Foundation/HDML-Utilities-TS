/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Every tag of the HDML language: the data elements (HDQL) stating
 * where data lives, followed by the display elements (HDVL) that
 * state how it is drawn. One enum for the whole language.
 */
export enum HDML_TAG_NAMES {
  // Data elements (HDQL).
  CONNECTION = "hdml-connection",
  FRAME = "hdml-frame",
  MODEL = "hdml-model",
  DATASET = "hdml-dataset",
  JOIN = "hdml-join",
  CONNECTIVE = "hdml-connective",
  FILTER_BY = "hdml-filter-by",
  FILTER = "hdml-filter",
  GROUP_BY = "hdml-group-by",
  SPLIT_BY = "hdml-split-by",
  SORT_BY = "hdml-sort-by",
  FIELD = "hdml-field",

  // Display elements (HDVL).
  VIEW = "hdml-view",
  CARTESIAN_PLANE = "hdml-cartesian-plane",
  POLAR_PLANE = "hdml-polar-plane",
  CONTINUOUS_SCALE = "hdml-continuous-scale",
  DATETIME_SCALE = "hdml-datetime-scale",
  ORDINAL_SCALE = "hdml-ordinal-scale",
  LINE = "hdml-line",
  AREA = "hdml-area",
  BAR = "hdml-bar",
  POINT = "hdml-point",
  ARC = "hdml-arc",
  RULE = "hdml-rule",
  // `hdml-text` is the seventh mark (Note 003), so it sits in
  // SPEC §2's "Mark widget" layer: after `hdml-rule`, before
  // `hdml-pie`, which is its own "Layout widget" layer. This
  // block transcribes §2's inventory table layer by layer and
  // `DISPLAY_TAGS`' docblock asserts that it does, so appending
  // after `hdml-fallback` would have made that claim false the
  // day SPEC gains the element. Note 003 §7.1's "the 34th
  // member, the 22nd HDVL tag" is amended accordingly: it is
  // the 25th member and the 13th display tag. The counts are
  // unchanged at 34 and 22, and the counts are what every gate
  // reads. Founder decision S15; the alternative was append.
  //
  // ⚠ Nothing implements it yet. The element, its family, its
  // module, its registration, its manifest entry and V19's
  // `text`-is-required check are step 41's, in
  // `@hdml/components`, so one `@hdml/types` release carries a
  // tag no element answers to. Named residue, not an oversight.
  TEXT = "hdml-text",
  PIE = "hdml-pie",
  CLUSTER = "hdml-cluster",
  STACK = "hdml-stack",
  AXIS = "hdml-axis",
  TICK = "hdml-tick",
  LABEL = "hdml-label",
  GRID = "hdml-grid",
  LEGEND = "hdml-legend",
  FALLBACK = "hdml-fallback",
}

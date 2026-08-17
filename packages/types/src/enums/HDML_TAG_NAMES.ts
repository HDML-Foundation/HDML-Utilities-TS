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
  TABLE = "hdml-table",
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

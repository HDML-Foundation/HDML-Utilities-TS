/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

// `count` left this enum at 019 step 16 (item 18, RFC 019/001 §2.3).
// How many ticks a guide draws is appearance, not data, so it is now
// authored as the registered CSS property `--hdml-tick-count` in a
// stylesheet rather than as an attribute on the element. The
// registration itself is step 28's, in `@hdml/components`.
//
// ★ `AGGREGATION_VALUES.COUNT` is a DIFFERENT thing -- the `count`
// VALUE of `hdml-field@aggregation` -- and is untouched. It is the
// one member a careless grep for `COUNT` destroys.
export enum TICK_ATTRS_LIST {
  CHANNEL = "channel",
  STEP = "step",
  VALUES = "values",
}

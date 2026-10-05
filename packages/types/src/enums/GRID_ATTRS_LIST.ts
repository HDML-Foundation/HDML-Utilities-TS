/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

// `count` left this enum at 019 step 16 (item 18, RFC 019/001 §2.3).
// A grid's line count is appearance, not data, so it is now authored
// as the registered CSS property `--hdml-tick-count` -- the same
// property the other three guides take, because a grid line and a
// tick are the same subdivision drawn two ways. The registration is
// step 28's, in `@hdml/components`.
//
// ★ `AGGREGATION_VALUES.COUNT` is a DIFFERENT thing -- the `count`
// VALUE of `hdml-field@aggregation` -- and is untouched.
export enum GRID_ATTRS_LIST {
  CHANNEL = "channel",
  STEP = "step",
  VALUES = "values",
}

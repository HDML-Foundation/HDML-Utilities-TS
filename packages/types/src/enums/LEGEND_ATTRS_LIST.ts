/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

// TWO members left this enum at 019 step 16, both because what they
// control is appearance rather than data (RFC 019/001 §2.3):
//
// - `count` -> `--hdml-tick-count` (item 18), how many entries a
//   continuous legend's ramp is divided into;
// - `format` -> `--hdml-text-format` (item 19), how each entry's
//   value is rendered as text.
//
// Both are now authored in a stylesheet. The registrations are step
// 28's, in `@hdml/components`.
//
// ★ `AGGREGATION_VALUES.COUNT` is a DIFFERENT thing -- the `count`
// VALUE of `hdml-field@aggregation` -- and is untouched.
export enum LEGEND_ATTRS_LIST {
  CHANNEL = "channel",
  STEP = "step",
  VALUES = "values",
}

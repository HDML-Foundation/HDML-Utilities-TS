/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export enum BAR_ATTRS_LIST {
  X = "x",
  X0 = "x0",
  X1 = "x1",
  Y = "y",
  Y0 = "y0",
  Y1 = "y1",
  COLOR = "color",
  HIDDEN = "hidden",
  SOURCE = "source",
  // The `initial-{slot}` literals, one per slot, spelled `initial-`
  // plus the exact slot attribute name with no transformation, so 021
  // can generate the whole set from a channel name (RFC 019/001
  // §5.6). `hidden` and `source` get none: a flag and the frame
  // binding, neither a slot. Nothing reads these yet: the literal
  // branch, `slotValuesOf` and `paintSuppressed` are step 43's, in
  // `@hdml/components`.
  INITIAL_X = "initial-x",
  INITIAL_X0 = "initial-x0",
  INITIAL_X1 = "initial-x1",
  INITIAL_Y = "initial-y",
  INITIAL_Y0 = "initial-y0",
  INITIAL_Y1 = "initial-y1",
  INITIAL_COLOR = "initial-color",
}

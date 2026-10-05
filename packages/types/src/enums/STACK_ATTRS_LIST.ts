/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export enum STACK_ATTRS_LIST {
  X = "x",
  Y = "y",
  OFFSET = "offset",
  HIDDEN = "hidden",
  SOURCE = "source",
  // The `initial-{slot}` literals, one per slot, spelled `initial-`
  // plus the exact slot attribute name with no transformation, so 021
  // can generate the whole set from a channel name (RFC 019/001
  // §5.6). `offset`, `hidden` and `source` get none: two flags and
  // the frame binding, none a slot. Nothing reads these yet: the
  // literal branch, `slotValuesOf` and `paintSuppressed` are step
  // 43's, in `@hdml/components`.
  INITIAL_X = "initial-x",
  INITIAL_Y = "initial-y",
}

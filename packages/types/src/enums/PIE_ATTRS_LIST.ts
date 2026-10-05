/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export enum PIE_ATTRS_LIST {
  ANGLE = "angle",
  COLOR = "color",
  SOURCE = "source",
  // The `initial-{slot}` literals, one per slot, spelled `initial-`
  // plus the exact slot attribute name with no transformation, so 021
  // can generate the whole set from a channel name (RFC 019/001
  // §5.6). `source` gets none: it is the frame binding, not a slot.
  // Nothing reads these yet: the literal branch, `slotValuesOf` and
  // `paintSuppressed` are step 43's, in `@hdml/components`.
  INITIAL_ANGLE = "initial-angle",
  INITIAL_COLOR = "initial-color",
}

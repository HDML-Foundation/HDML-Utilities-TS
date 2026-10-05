/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export enum ARC_ATTRS_LIST {
  A0 = "a0",
  A1 = "a1",
  ANGLE = "angle",
  RADIUS = "radius",
  R0 = "r0",
  R1 = "r1",
  COLOR = "color",
  SOURCE = "source",
  // The `initial-{slot}` literals, one per slot, spelled `initial-`
  // plus the exact slot attribute name with no transformation, so 021
  // can generate the whole set from a channel name (RFC 019/001
  // §5.6). `source` gets none: it is the frame binding, not a slot.
  // Nothing reads these yet: the literal branch, `slotValuesOf` and
  // `paintSuppressed` are step 43's, in `@hdml/components`.
  INITIAL_A0 = "initial-a0",
  INITIAL_A1 = "initial-a1",
  INITIAL_ANGLE = "initial-angle",
  INITIAL_RADIUS = "initial-radius",
  INITIAL_R0 = "initial-r0",
  INITIAL_R1 = "initial-r1",
  INITIAL_COLOR = "initial-color",
}

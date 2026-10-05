/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * `hdml-text`'s attributes. It is positioned like an `hdml-point`
 * (Note 003 §7.2), so this is `POINT_ATTRS_LIST` with one slot
 * swapped and nothing else: `x`/`y` cartesian, `angle`/`radius`
 * polar, `color` through the same `scale.paint` path.
 *
 * ★ `size` is deliberately absent. A run's size is
 * `--hdml-font-size`, a registered CSS property, not a channel —
 * so unlike every other point-like mark `hdml-text` has no `size`
 * binding, and the `--hdml-text-*` family is the whole appearance
 * surface it reuses (Note 003 §7.2, §7.4).
 *
 * ★ `text` is a NEW KIND of binding, not a seventh channel. It
 * names the printed column and needs no scale: `checkV1` derives
 * its required channels from the closed `CHANNEL_ATTRS` table,
 * and a slot spelled outside that table contributes none (Note
 * 003 §2.2). That is what makes a scale-less `text` legal with no
 * structural change and no new V-rule.
 *
 * ★ Thirteen members, not the six §7.2's slot table lists.
 * `source` is not a slot — it is the frame binding every mark
 * carries, so a mark's enum is its slots, plus `SOURCE`, plus one
 * `initial-{slot}` per slot (step 15, RFC 019/001 §5.3). Omitting
 * `source` fails `check-dist` check 8, which compares the
 * manifest's attribute list against this enum (plan C10).
 *
 * Nothing implements the element yet. The module, the `mark`
 * family entry, the registration, the manifest entry and V19's
 * `text`-is-required check are step 41's, in `@hdml/components`.
 */
export enum TEXT_ATTRS_LIST {
  X = "x",
  Y = "y",
  ANGLE = "angle",
  RADIUS = "radius",
  COLOR = "color",
  TEXT = "text",
  SOURCE = "source",
  // The `initial-{slot}` literals, one per slot, spelled `initial-`
  // plus the exact slot attribute name with no transformation, so 021
  // can generate the whole set from a channel name (RFC 019/001
  // §5.6). `source` gets none: it is the frame binding, not a slot.
  // And `size` is absent from this enum, so there is no
  // `initial-size` here either. Nothing reads these yet: the literal
  // branch, `slotValuesOf` and `paintSuppressed` are step 43's, in
  // `@hdml/components`.
  INITIAL_X = "initial-x",
  INITIAL_Y = "initial-y",
  INITIAL_ANGLE = "initial-angle",
  INITIAL_RADIUS = "initial-radius",
  INITIAL_COLOR = "initial-color",
  INITIAL_TEXT = "initial-text",
}

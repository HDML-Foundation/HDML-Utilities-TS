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
 * ★ Seven members, not the six §7.2's slot table lists. `source`
 * is not a slot — it is the frame binding every mark carries, and
 * every mark's enum is its slots plus `SOURCE`. Omitting it fails
 * `check-dist` check 8, which compares the manifest's attribute
 * list against this enum (plan C10).
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
}

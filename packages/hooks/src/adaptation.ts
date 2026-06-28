/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * The mutation an adaptation rule applies to a matched element —
 * mirrors HDIO-Server `domain.AdaptationAction` (RFC 002 §5.1).
 */
export type AdaptationAction = "set-attribute" | "remove-element";

/**
 * A single document mutation: a CSS-like `selector` plus the
 * `action` to apply. `attribute` / `value` are present only for
 * `set-attribute`. Mirrors the lowercase JSON shape HDIO-Server
 * emits for `domain.AdaptationRule` on the compiler envelope.
 */
export interface AdaptationRule {
  selector: string;
  action: AdaptationAction;
  attribute?: string;
  value?: unknown;
}

/**
 * The parsed `adaptation.yml` policy carried on the compiler
 * envelope: adaptation rules keyed by role name. The full all-roles
 * map is shipped; the `applyAdaptation` step selects the caller's
 * single role's bucket (single-role contract, Slice D D1).
 */
export interface AdaptationPolicy {
  roles: Record<string, AdaptationRule[]>;
}

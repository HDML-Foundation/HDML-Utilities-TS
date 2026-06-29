/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type { HTMLElement } from "@hdml/parser";
import { message } from "./compileConnections";
import type { AdaptationPolicy } from "./adaptation";

/**
 * Fail-loud carrier for an adaptation that cannot be applied (RFC 002
 * §2, decision D3): a selector the DOM engine rejects, or a rule with
 * an unknown `action`. Thrown out of `applyAdaptation`; the `sql`
 * branch's round-trip `try/catch` maps it to `adaptation_failed`, and
 * the `effective` branch surfaces it the same way (Slice D, Step 02).
 * A bad policy never silently no-ops — see D5 for the genuine no-op
 * cases (absent policy / role / empty match).
 */
export class AdaptationError extends Error {
  public constructor(detail: string) {
    super(detail);
    this.name = "AdaptationError";
  }
}

/**
 * Applies the single active `role`'s adaptation rules to `dom` in
 * place (RFC 002 §4, single-role contract D1). Selects **only**
 * `policy.roles[role]` and walks its rules in array order — the
 * within-role order is the whole conflict resolution: a later rule's
 * `set-attribute` on the same `(node, attribute)` overwrites an
 * earlier one, so broad-then-specific (e.g. all `hdml-field` →
 * `type="string"`, then `hdml-field[name='salary']` →
 * `type="decimal"`) lands the specific value (D5). Each rule is a
 * single in-place mutation; there is no cross-rule bookkeeping.
 *
 * `remove-element` deletes every matched element and its whole
 * subtree (a removed `hdml-frame` takes its `hdml-field`s); it
 * ignores `attribute` / `value`. `set-attribute` writes
 * `String(rule.value)` to `rule.attribute` — `value` is
 * `interface{}` on the Go side, so int / float / bool / string all
 * coerce to a string. A value
 * carrying `${scope.*}` / `${env.*}` is left **literal** here:
 * injection (in the `sql` branch) resolves it after adaptation; the
 * `effective` branch keeps it literal (D2). No attribute allowlist —
 * structural attributes (`source` / `identifier` / `name`) are
 * writable like any other (D6, trust domain).
 *
 * No-op identity (D5): an absent `policy`, a `role` not present in
 * `policy.roles`, or a selector that matches nothing all leave `dom`
 * unchanged.
 *
 * @throws {AdaptationError} when the DOM rejects a `rule.selector`
 *   (fail-loud, D3) or a rule carries an unknown `action` (D3).
 */
export function applyAdaptation(
  dom: HTMLElement,
  policy: AdaptationPolicy | undefined,
  role: string,
): void {
  if (!policy || !policy.roles || !policy.roles[role]) {
    return;
  }
  for (const rule of policy.roles[role]) {
    let matches: HTMLElement[];
    try {
      matches = dom.querySelectorAll(rule.selector);
    } catch (e) {
      throw new AdaptationError(message(e));
    }
    for (const el of matches) {
      switch (rule.action) {
        case "remove-element":
          el.remove();
          break;
        case "set-attribute":
          el.setAttribute(
            rule.attribute as string,
            String(rule.value),
          );
          break;
        default:
          throw new AdaptationError(
            `unknown action: ${String(rule.action)}`,
          );
      }
    }
  }
}

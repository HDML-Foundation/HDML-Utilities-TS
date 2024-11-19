/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { uuid } from "@hdml/common";
const { v1, v5 } = uuid;

/**
 * Generates a random session-specific UUID-like string.
 *
 * This function combines the results of two UUID algorithms: `v1`
 * (time-based UUID) and `v5` (namespace-based UUID), resulting in
 * a string that is unique for each session. While this does not
 * produce a standard UUID, it creates a similarly structured
 * identifier that can be useful for temporary or short-lived
 * contexts.
 *
 * @returns A unique string in UUID format.
 *
 * @example
 * ```TypeScript
 * import { uid } from "./uid";
 *
 * const id1 = uid();
 * const id2 = uid();
 * console.log(id1); // A UUID-like string
 * console.log(id1 === id2); // Output: false
 * ```
 *
 * @remarks
 * - The function combines `v1` and `v5` UUIDs to generate a string
 *   that looks like a UUID but is unique per session.
 * - The resulting string is not a valid UUID for global
 *   identification (e.g., for database records or API usage). in
 *   those cases.
 * - Since the function leverages the timestamp-based `v1`, it’s
 *   unlikely to generate duplicate strings within the same session.
 *
 * @see https://www.ietf.org/rfc/rfc4122.txt for UUID specification.
 */
export function uid(): string {
  return v5(v1(), v1()).toString();
}

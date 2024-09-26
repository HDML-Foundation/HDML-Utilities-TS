/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Generates a persistent time-based hash from a timestamp.
 *
 * This function returns a hash derived from the provided `timestamp`
 * by rounding it to the nearest multiple of the given `timestep`
 * (in milliseconds). The result is returned as a base-36 string,
 * which is more compact than base-32 and includes alphanumeric
 * characters (0-9 and a-z).
 *
 * If no `timestep` is provided, the default value of `1` is used,
 * which results in the hash being a direct base-36 representation
 * of the timestamp.
 *
 * @param timestamp - The Unix timestamp (in milliseconds) to hash.
 * @param timestep - The step interval (in milliseconds) used for
 *                   rounding. Defaults to `1`.
 * @returns A base-36 string representing the rounded timestamp.
 *
 * @throws Will throw an error if the `timestep` is `0` or negative.
 *
 * @example
 * ```TypeScript
 * import { hashtime } from "./hashtime";
 *
 * const timestamp = Date.now();
 * const timestep = 60000; // 1 minute
 *
 * const hash = hashtime(timestamp, timestep);
 * console.log(hash); // Output: A base-36 string hash
 * ```
 *
 * @remarks
 * - This function is useful for generating time-based cache keys
 *   or rate-limited tokens where persistence across a time window is
 *   needed.
 * - The `timestep` must be greater than `0`.
 * - The default timestep is `1`, meaning the function directly
 *   converts the timestamp to a base-36 string.
 * - The base-36 format allows for compact and alphanumeric output.
 *
 * @see https://en.wikipedia.org/wiki/Unix_time for more information
 *      on Unix timestamps.
 */
export function hashtime(timestamp: number, timestep = 1): string {
  if (timestep <= 0) {
    throw new Error("`timestep` must be greater than 0");
  }
  return Math.floor(timestamp / timestep).toString(36);
}

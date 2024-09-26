/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Parses a base-36 `hashtime` string back into a timestamp.
 *
 * The function takes a base-36 encoded `hashtime` string and converts
 * it back to the original timestamp by multiplying the decoded value
 * by the provided `timestep` value. If no `timestep` is provided, it
 * defaults to `1`.
 *
 * @param hashtime - The base-36 string representing a hashed time
 *                   value.
 * @param timestep - The time interval (in milliseconds) used for
 *                   rounding.
 *                   Defaults to `1`. Must be greater than `0`.
 * @returns The original timestamp (in milliseconds) represented by
 *          the `hashtime`.
 *
 * @throws Will throw an error if the `timestep` is `0` or negative.
 *
 * @example
 * ```TypeScript
 * import { parsetime } from "./parsetime";
 *
 * const hash = "k12"; // Hashed time value (base-36 string)
 * const timestamp = parsetime(hash, 60000); // 1-minute step
 *
 * console.log(timestamp); // Reconstructed Unix timestamp
 * ```
 *
 * @remarks
 * - The `timestep` must be greater than `0`.
 * - If no `timestep` is specified, the base-36 value is directly
 *   converted back to a timestamp without scaling.
 *
 * @see {@link hashtime} for generating the base-36 `hashtime` value.
 */
export function parsetime(hashtime: string, timestep = 1): number {
  if (timestep <= 0) {
    throw new Error("`timestep` must be greater than 0");
  }
  return parseInt(hashtime, 36) * timestep;
}

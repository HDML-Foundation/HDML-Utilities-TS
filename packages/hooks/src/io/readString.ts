/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { readUint8Array } from "./readUint8Array";

/**
 * Reads a string from stdin.
 *
 * This function reads input from stdin and returns it as a
 * string. It uses the `readUint8Array` function to read the
 * input from stdin and then decodes it using the `TextDecoder`
 * API.
 *
 * @returns A string containing the input from stdin.
 *
 * @example
 * ```ts
 * const string = readString();
 * console.log(string);
 * ```
 */
export function readString(): string {
  return new TextDecoder().decode(readUint8Array());
}

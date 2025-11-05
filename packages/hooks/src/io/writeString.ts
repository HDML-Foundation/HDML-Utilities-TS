/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { writeUint8Array } from "./writeUint8Array";

/**
 * Writes a string to stdout.
 *
 * This function writes a string to stdout. It uses the
 * `writeUint8Array` function to write the string to stdout.
 *
 * @param string The string to write to stdout.
 *
 * @returns The number of bytes written to stdout.
 *
 * @example
 * ```ts
 * const bytesWritten = writeString("Hello, world!");
 * console.log(bytesWritten);
 * ```
 */
export function writeString(string: string): number {
  return writeUint8Array(new TextEncoder().encode(string));
}

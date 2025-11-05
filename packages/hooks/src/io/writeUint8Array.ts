/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "../types/global";

/**
 * Writes a `Uint8Array` to stdout.
 *
 * This function writes a `Uint8Array` to stdout. It uses the
 * `Javy.IO.writeSync` method to write the `Uint8Array` to stdout.
 *
 * @param uint8Array The `Uint8Array` to write to stdout.
 *
 * @returns The number of bytes written to stdout.
 *
 * @example
 * ```ts
 * const bytesWritten = writeUint8Array(new Uint8Array([1, 2, 3]));
 * console.log(bytesWritten);
 * ```
 */
export function writeUint8Array(uint8Array: Uint8Array): number {
  return Javy.IO.writeSync(1, uint8Array);
}

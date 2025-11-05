/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "../types/global";

/**
 * Reads a `Uint8Array` from stdin.
 *
 * This function reads input from stdin and returns it as a
 * `Uint8Array`. It reads the input in chunks of 1024 bytes
 * and assembles them into a single `Uint8Array`. The function
 * uses the `Javy.IO.readSync` method to read the input from
 * stdin.
 *
 * @returns A `Uint8Array` containing the input from stdin.
 *
 * @example
 * ```ts
 * const uint8Array = readUint8Array();
 * console.log(uint8Array);
 * ```
 */
export function readUint8Array(): Uint8Array {
  const size = 1024;
  const chunks: Uint8Array[] = [];
  let total: number = 0;

  // Read all the available bytes
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const buffer = new Uint8Array(size);
    const bytes: number = Javy.IO.readSync(0, buffer);

    total += bytes;
    if (bytes === 0) {
      break;
    }
    chunks.push(buffer.subarray(0, bytes));
  }

  // Assemble input into a single Uint8Array
  const { buffer } = chunks.reduce(
    (context, chunk) => {
      context.buffer.set(chunk, context.offset);
      context.offset += chunk.length;
      return context;
    },
    { offset: 0, buffer: new Uint8Array(total) },
  );

  return buffer;
}

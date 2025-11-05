/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { writeString } from "./writeString";

/**
 * Writes a JSON object to stdout.
 *
 * This function writes a JSON object to stdout. It uses the
 * `writeString` function to write the JSON object to stdout.
 *
 * @param object The object to write to stdout.
 *
 * @returns The number of bytes written to stdout.
 *
 * @example
 * ```ts
 * const bytesWritten = writeJson<{
 *   name: string;
 *   age: number;
 * }>({ name: "John", age: 30 });
 * console.log(bytesWritten);
 * ```
 */
export function writeJson<T = unknown>(object: T): number {
  return writeString(JSON.stringify(object));
}

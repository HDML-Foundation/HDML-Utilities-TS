/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { readString } from "./readString";

/**
 * Reads a JSON object from stdin.
 *
 * This function reads input from stdin and returns it as a
 * JSON object. It uses the `readString` function to read the
 * input from stdin and then parses it using the `JSON.parse`
 * method.
 *
 * @returns A JSON object containing the input from stdin.
 *
 * @example
 * ```ts
 * const json = readJson<{ name: string; age: number }>();
 * console.log(json);
 * ```
 */
export function readJson<T = unknown>(): T {
  return JSON.parse(readString()) as T;
}

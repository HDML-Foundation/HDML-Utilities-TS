/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Converts a Base64 string to a Uint8Array.
 *
 * This function converts a Base64 string to a Uint8Array using the
 * base64Chars string.
 *
 * @param base64 - The Base64 string to convert to a Uint8Array.
 * @returns The Uint8Array.
 *
 * @example
 * ```TypeScript
 * import { base64ToBytes } from "./base64ToBytes";
 *
 * const bytes = base64ToBytes("SGVsbG8gV29ybGQ=");
 * console.log(bytes); // Outputs the Uint8Array.
 * ```
 */
export function base64ToBytes(base64: string): Uint8Array {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz" +
    "0123456789" +
    "+/";
  const lookup: Record<string, number> = {};
  for (let i = 0; i < base64Chars.length; i++) {
    lookup[base64Chars[i]] = i;
  }

  base64 = base64.replace(/[^A-Za-z0-9+/]/g, "");
  const len = base64.length;
  const bytes: number[] = [];

  for (let i = 0; i < len; i += 4) {
    const encoded1 = lookup[base64[i]];
    const encoded2 = lookup[base64[i + 1]];
    const encoded3 = lookup[base64[i + 2]];
    const encoded4 = lookup[base64[i + 3]];

    const bitmap =
      (encoded1 << 18) |
      (encoded2 << 12) |
      (encoded3 << 6) |
      encoded4;

    bytes.push((bitmap >> 16) & 255);
    if (encoded3 !== 64) bytes.push((bitmap >> 8) & 255);
    if (encoded4 !== 64) bytes.push(bitmap & 255);
  }

  return new Uint8Array(bytes);
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Converts a Uint8Array to a Base64 string.
 *
 * This function converts a Uint8Array to a Base64 string using the
 * base64Chars string.
 *
 * @param bytes - The Uint8Array to convert to a Base64 string.
 * @returns The Base64 string.
 *
 * @example
 * ```TypeScript
 * import { bytesToBase64 } from "./bytesToBase64";
 *
 * const base64 = bytesToBase64(new Uint8Array([1, 2, 3]));
 * console.log(base64); // Outputs the Base64 string.
 * ```
 */
export function bytesToBase64(bytes: Uint8Array): string {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz" +
    "0123456789" +
    "+/";
  let result = "";
  let i = 0;

  while (i < bytes.length) {
    const a = bytes[i++];
    const b = i < bytes.length ? bytes[i++] : 0;
    const c = i < bytes.length ? bytes[i++] : 0;

    const bitmap = (a << 16) | (b << 8) | c;

    result += base64Chars.charAt((bitmap >> 18) & 63);
    result += base64Chars.charAt((bitmap >> 12) & 63);
    result +=
      i - 2 < bytes.length
        ? base64Chars.charAt((bitmap >> 6) & 63)
        : "=";
    result +=
      i - 1 < bytes.length ? base64Chars.charAt(bitmap & 63) : "=";
  }

  return result;
}

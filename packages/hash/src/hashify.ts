/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { md5 } from "./md5";

const charset = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Converts the given input into a unique hash-like string.
 *
 * This function uses the MD5 hash of the input string and then
 * converts the first 5 bytes of the hash to a short, custom-encoded
 * hash string using the defined `charset`. The resulting string
 * is approximately 6 characters long.
 *
 * @param input - The input string to be hashed.
 * @returns A custom hash-like string.
 *
 * @example
 * ```TypeScript
 * import { hashify } from "./hashify";
 *
 * const hashedValue = hashify("example");
 * console.log(hashedValue); // Outputs a short custom hash string.
 * ```
 */
export function hashify(input: string): string {
  input = md5(input);
  let hashname = "";
  let residue = 0;
  let counter = 0;
  for (let i = 0; i < 5; i++) {
    const byte = input[i].charCodeAt(0);
    counter += 8;
    residue = (byte << (counter - 8)) | residue;
    while (residue >> 5) {
      hashname += charset.charAt(residue % 32);
      counter -= 5;
      residue = residue >> 5;
    }
  }
  hashname += charset.charAt(residue % 32);
  return hashname;
}

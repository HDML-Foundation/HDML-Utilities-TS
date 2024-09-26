/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { hashify } from "./hashify";

/**
 * Tests for the hashify function.
 */
describe("The `hashify` function", () => {
  /** Test that hashify returns a string */
  it("should return a string", () => {
    const result = hashify("test");
    expect(typeof result).toBe("string");
  });

  /** Test that hashify generates consistent hashes */
  it("should generate the same hash for the same content", () => {
    const hash1 = hashify("example");
    const hash2 = hashify("example");
    expect(hash1).toBe(hash2);
  });

  /** Test that hashify produces different hashes for different content */
  it("should generate different hashes for different content", () => {
    const hash1 = hashify("example1");
    const hash2 = hashify("example2");
    expect(hash1).not.toBe(hash2);
  });

  /** Test that hashify respects charset length */
  it("should generate a hash using the charset", () => {
    const result = hashify("test");
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    // Verify all characters are from the charset
    for (let i = 0; i < result.length; i++) {
      expect(charset.includes(result[i])).toBe(true);
    }
  });

  /** Test hashing a common string */
  it('should return correct MD5 hash for "hello"', () => {
    const result = hashify("hello");
    expect(result).toBe("vbzityqg");
  });

  /** Test hashing an empty string */
  it("should return correct MD5 hash for an empty string", () => {
    const result = hashify("");
    expect(result).toBe("edncdsbh");
  });

  /** Test hashing a long string */
  it("should return correct MD5 hash for a long string", () => {
    const longString = "a".repeat(1000);
    const result = hashify(longString);
    expect(result).toBe("dlyewsrg");
  });

  /** Test hashing a string with special characters */
  it("should return correct MD5 hash for a string with special characters", () => {
    const result = hashify("!@#$%^&*()_+");
    expect(result).toBe("qbnigsvm");
  });

  /** Test hashing a number converted to string */
  it("should return correct MD5 hash for a number as string", () => {
    const result = hashify("1234567890");
    expect(result).toBe("fdoat1ym");
  });
});

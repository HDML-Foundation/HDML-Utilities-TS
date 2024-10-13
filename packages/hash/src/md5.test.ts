/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { md5 } from "./md5";

describe("MD5 Hash Function", () => {
  /** Test hashing a common string */
  it('should return correct MD5 hash for "hello"', () => {
    const result = md5("hello");
    expect(result).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  /** Test hashing an empty string */
  it("should return correct MD5 hash for an empty string", () => {
    const result = md5("");
    expect(result).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });

  /** Test hashing a long string */
  it("should return correct MD5 hash for a long string", () => {
    const longString = "a".repeat(1000);
    const result = md5(longString);
    expect(result).toBe("cabe45dcc9ae5b66ba86600cca6b8ba8");
  });

  /** Test hashing a string with special characters */
  it("should return correct MD5 hash for a string with special characters", () => {
    const result = md5("!@#$%^&*()_+");
    expect(result).toBe("04dde9f462255fe14b5160bbf2acffe8");
  });

  /** Test hashing a number converted to string */
  it("should return correct MD5 hash for a number as string", () => {
    const result = md5("1234567890");
    expect(result).toBe("e807f1fcf82d132f9bb018ca6738a19f");
  });
});

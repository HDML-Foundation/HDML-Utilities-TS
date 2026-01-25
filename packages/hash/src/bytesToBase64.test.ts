/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { bytesToBase64 } from "./bytesToBase64";

/**
 * Tests for the bytesToBase64 function.
 */
describe("The `bytesToBase64` function", () => {
  /** Test that bytesToBase64 returns a string */
  it("should return a string", () => {
    const result = bytesToBase64(new Uint8Array([1, 2, 3]));
    expect(typeof result).toBe("string");
  });

  /** Test that bytesToBase64 handles empty array */
  it("should return empty string for empty array", () => {
    const result = bytesToBase64(new Uint8Array([]));
    expect(result).toBe("");
  });

  /** Test single byte conversion */
  it("should convert single byte correctly", () => {
    const result = bytesToBase64(new Uint8Array([65]));
    expect(result).toBe("QQAA");
  });

  /** Test two bytes conversion */
  it("should convert two bytes correctly", () => {
    const result = bytesToBase64(new Uint8Array([65, 66]));
    expect(result).toBe("QUIA");
  });

  /** Test three bytes conversion without padding */
  it("should convert three bytes correctly without padding", () => {
    const result = bytesToBase64(new Uint8Array([65, 66, 67]));
    expect(result).toBe("QUJD");
  });

  /** Test four bytes conversion */
  it("should convert four bytes correctly", () => {
    const result = bytesToBase64(new Uint8Array([65, 66, 67, 68]));
    expect(result).toBe("QUJDRAAA");
  });

  /** Test five bytes conversion */
  it("should convert five bytes correctly", () => {
    const result = bytesToBase64(
      new Uint8Array([65, 66, 67, 68, 69]),
    );
    expect(result).toBe("QUJDREUA");
  });

  /** Test six bytes conversion without padding */
  it("should convert six bytes correctly without padding", () => {
    const result = bytesToBase64(
      new Uint8Array([65, 66, 67, 68, 69, 70]),
    );
    expect(result).toBe("QUJDREVG");
  });

  /** Test known string: "Hello" */
  it('should convert "Hello" correctly', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]);
    const result = bytesToBase64(bytes);
    expect(result).toBe("SGVsbG8A");
  });

  /** Test known string: "Hello World" */
  it('should convert "Hello World" correctly', () => {
    const bytes = new Uint8Array([
      72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
    ]);
    const result = bytesToBase64(bytes);
    expect(result).toBe("SGVsbG8gV29ybGQA");
  });

  /** Test all zeros */
  it("should convert all zeros correctly", () => {
    const result = bytesToBase64(new Uint8Array([0, 0, 0]));
    expect(result).toBe("AAAA");
  });

  /** Test maximum byte values */
  it("should convert maximum byte values correctly", () => {
    const result = bytesToBase64(new Uint8Array([255, 255, 255]));
    expect(result).toBe("////");
  });

  /** Test mixed byte values */
  it("should convert mixed byte values correctly", () => {
    const result = bytesToBase64(new Uint8Array([0, 255, 128, 64]));
    expect(result).toBe("AP+AQAAA");
  });

  /** Test long array */
  it("should convert long array correctly", () => {
    const bytes = new Uint8Array(100);
    for (let i = 0; i < 100; i++) {
      bytes[i] = i % 256;
    }
    const result = bytesToBase64(bytes);
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toContain("undefined");
    expect(result).not.toContain("null");
  });

  /** Test array with one byte at end */
  it("should handle array with one byte at end correctly", () => {
    const result = bytesToBase64(new Uint8Array([1, 2, 3, 4, 5]));
    expect(result).toBe("AQIDBAUA");
  });

  /** Test array with two bytes at end */
  it("should handle array with two bytes at end correctly", () => {
    const result = bytesToBase64(new Uint8Array([1, 2, 3, 4]));
    expect(result).toBe("AQIDBAAA");
  });
});

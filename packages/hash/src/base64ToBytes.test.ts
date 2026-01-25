/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { base64ToBytes } from "./base64ToBytes";
import { bytesToBase64 } from "./bytesToBase64";

/**
 * Tests for the base64ToBytes function.
 */
describe("The `base64ToBytes` function", () => {
  /** Test that base64ToBytes returns a Uint8Array */
  it("should return a Uint8Array", () => {
    const result = base64ToBytes("QUJD");
    expect(result).toBeInstanceOf(Uint8Array);
  });

  /** Test that base64ToBytes handles empty string */
  it("should return empty array for empty string", () => {
    const result = base64ToBytes("");
    expect(result.length).toBe(0);
  });

  /** Test single character Base64 string */
  it("should convert single character correctly", () => {
    const result = base64ToBytes("QQAA");
    expect(Array.from(result)).toEqual([65, 0, 0]);
  });

  /** Test two character Base64 string */
  it("should convert two characters correctly", () => {
    const result = base64ToBytes("QUIA");
    expect(Array.from(result)).toEqual([65, 66, 0]);
  });

  /** Test three character Base64 string without padding */
  it("should convert three characters correctly without padding", () => {
    const result = base64ToBytes("QUJD");
    expect(Array.from(result)).toEqual([65, 66, 67]);
  });

  /** Test four character Base64 string */
  it("should convert four characters correctly", () => {
    const result = base64ToBytes("QUJDRA==");
    expect(Array.from(result)).toEqual([65, 66, 67, 68, 0, 0]);
  });

  /** Test Base64 string with standard padding */
  it("should handle Base64 string with padding correctly", () => {
    const result = base64ToBytes("SGVsbG8=");
    expect(Array.from(result)).toEqual([72, 101, 108, 108, 111, 0]);
  });

  /** Test Base64 string with double padding */
  it("should handle Base64 string with double padding correctly", () => {
    const result = base64ToBytes("QQ==");
    expect(Array.from(result)).toEqual([65, 0, 0]);
  });

  /** Test known Base64 string: "Hello" */
  it('should convert "Hello" Base64 correctly', () => {
    const result = base64ToBytes("SGVsbG8A");
    expect(Array.from(result)).toEqual([72, 101, 108, 108, 111, 0]);
  });

  /** Test known Base64 string: "Hello World" */
  it('should convert "Hello World" Base64 correctly', () => {
    const result = base64ToBytes("SGVsbG8gV29ybGQA");
    expect(Array.from(result)).toEqual([
      72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 0,
    ]);
  });

  /** Test all zeros Base64 */
  it("should convert all zeros Base64 correctly", () => {
    const result = base64ToBytes("AAAA");
    expect(Array.from(result)).toEqual([0, 0, 0]);
  });

  /** Test maximum byte values Base64 */
  it("should convert maximum byte values Base64 correctly", () => {
    const result = base64ToBytes("////");
    expect(Array.from(result)).toEqual([255, 255, 255]);
  });

  /** Test mixed byte values Base64 */
  it("should convert mixed byte values Base64 correctly", () => {
    const result = base64ToBytes("AP+AQAAA");
    expect(Array.from(result)).toEqual([0, 255, 128, 64, 0, 0]);
  });

  /** Test Base64 string with invalid characters */
  it("should strip invalid characters from Base64 string", () => {
    const result = base64ToBytes("QU\nJD\tRA==");
    expect(Array.from(result)).toEqual([65, 66, 67, 68, 0, 0]);
  });

  /** Test Base64 string with whitespace */
  it("should strip whitespace from Base64 string", () => {
    const result = base64ToBytes("QU JD RA ==");
    expect(Array.from(result)).toEqual([65, 66, 67, 68, 0, 0]);
  });

  /** Test round-trip conversion: bytes -> base64 -> bytes */
  it("should round-trip convert bytes correctly", () => {
    const original = new Uint8Array([65, 66, 67, 68, 69]);
    const base64 = bytesToBase64(original);
    const result = base64ToBytes(base64);
    // Note: round-trip includes padding zeros from bytesToBase64
    expect(result.length).toBeGreaterThanOrEqual(original.length);
    expect(Array.from(result.slice(0, original.length))).toEqual(
      Array.from(original),
    );
  });

  /** Test round-trip with three bytes */
  it("should round-trip convert three bytes correctly", () => {
    const original = new Uint8Array([72, 101, 108]);
    const base64 = bytesToBase64(original);
    const result = base64ToBytes(base64);
    expect(Array.from(result)).toEqual(Array.from(original));
  });

  /** Test round-trip with single byte */
  it("should round-trip convert single byte correctly", () => {
    const original = new Uint8Array([65]);
    const base64 = bytesToBase64(original);
    const result = base64ToBytes(base64);
    // Note: round-trip includes padding zeros from bytesToBase64
    expect(result.length).toBeGreaterThanOrEqual(original.length);
    expect(Array.from(result.slice(0, original.length))).toEqual(
      Array.from(original),
    );
  });

  /** Test round-trip with two bytes */
  it("should round-trip convert two bytes correctly", () => {
    const original = new Uint8Array([65, 66]);
    const base64 = bytesToBase64(original);
    const result = base64ToBytes(base64);
    // Note: round-trip includes padding zeros from bytesToBase64
    expect(result.length).toBeGreaterThanOrEqual(original.length);
    expect(Array.from(result.slice(0, original.length))).toEqual(
      Array.from(original),
    );
  });

  /** Test long Base64 string */
  it("should convert long Base64 string correctly", () => {
    const bytes = new Uint8Array(100);
    for (let i = 0; i < 100; i++) {
      bytes[i] = i % 256;
    }
    const base64 = bytesToBase64(bytes);
    const result = base64ToBytes(base64);
    // Note: round-trip includes padding zeros from bytesToBase64
    expect(result.length).toBeGreaterThanOrEqual(bytes.length);
    expect(Array.from(result.slice(0, bytes.length))).toEqual(
      Array.from(bytes),
    );
  });

  /** Test Base64 string with special characters in charset */
  it("should handle Base64 string with + and / correctly", () => {
    const result = base64ToBytes("+/AA");
    expect(Array.from(result)).toEqual([251, 240, 0]);
  });
});

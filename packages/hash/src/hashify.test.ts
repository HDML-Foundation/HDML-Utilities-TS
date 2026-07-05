/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { readFileSync } from "fs";
import { resolve } from "path";
import { TextEncoder } from "util";
import { hashify } from "./hashify";
import { bytesToBase64 } from "./bytesToBase64";

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

/**
 * Shared TS<->Go drift guard. The vector at
 * packages/hash/src/testdata/hashify_vector.json is a byte-identical
 * copy of HDIO-Server's internal/hash/testdata/hashify_vector.json
 * (asserted by the Go unit test). It pins the FE `bytesToBase64` +
 * `hashify` pipeline that mints every dynamic-doc key against the Go
 * `BytesToBase64` + `Hashify` ports, so a drift on either side fails
 * a test in whichever repo changed (RFC 004 Slice E §3.2 / §8.8;
 * Step 00). Do NOT edit an expected value without the other side's
 * test failing.
 */
describe("The shared hashify vector (TS<->Go parity)", () => {
  interface VectorCase {
    name: string;
    content_utf8: string;
    base64: string;
    std: string;
    hashify: string;
  }
  interface VectorFile {
    note: string;
    cases: VectorCase[];
  }

  const fixturePath = resolve(
    __dirname,
    "../src/testdata/hashify_vector.json",
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const vector: VectorFile = JSON.parse(
    readFileSync(fixturePath, "utf8"),
  );

  it("covers all three base64 length residues", () => {
    // empty + mod0 + mod1 + mod2.
    expect(vector.cases.length).toBeGreaterThanOrEqual(4);
  });

  vector.cases.forEach((c) => {
    it(`bytesToBase64 matches the vector for "${c.name}"`, () => {
      const bytes = new TextEncoder().encode(c.content_utf8);
      expect(bytesToBase64(bytes)).toBe(c.base64);
    });

    it(`hashify matches the vector for "${c.name}"`, () => {
      const hash = hashify(c.base64);
      expect(hash).toBe(c.hashify);
      // hashify is 8 chars, never ~6 as the upstream JSDoc claims.
      expect(hash.length).toBe(8);
    });
  });
});

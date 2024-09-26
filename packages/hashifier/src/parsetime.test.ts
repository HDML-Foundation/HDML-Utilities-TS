/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { parsetime } from "./parsetime";

describe("parsetime", () => {
  it("should return the correct timestamp for a given hashtime and timestep", () => {
    const hashtime = "k12"; // Base-36 hash
    const timestep = 60000; // 1 minute in milliseconds

    const result = parsetime(hashtime, timestep);
    const expected = parseInt(hashtime, 36) * timestep;

    expect(result).toBe(expected);
  });

  it("should return the correct timestamp when timestep is not provided", () => {
    const hashtime = "k12"; // Base-36 hash

    const result = parsetime(hashtime);
    const expected = parseInt(hashtime, 36); // Default timestep of 1

    expect(result).toBe(expected);
  });

  it("should throw an error if timestep is 0", () => {
    const hashtime = "abc";

    expect(() => parsetime(hashtime, 0)).toThrowError(
      "`timestep` must be greater than 0",
    );
  });

  it("should throw an error if timestep is negative", () => {
    const hashtime = "abc";

    expect(() => parsetime(hashtime, -100)).toThrowError(
      "`timestep` must be greater than 0",
    );
  });

  it("should handle small timestep values", () => {
    const hashtime = "a"; // Small base-36 hash
    const timestep = 0.001; // Milliseconds to microseconds conversion

    const result = parsetime(hashtime, timestep);
    const expected = parseInt(hashtime, 36) * timestep;

    expect(result).toBeCloseTo(expected, 5); // Handle floating-point precision
  });

  it("should correctly handle large base-36 hashtimes", () => {
    const hashtime = "zzzzzz"; // Large base-36 value
    const timestep = 1;

    const result = parsetime(hashtime, timestep);
    const expected = parseInt(hashtime, 36);

    expect(result).toBe(expected);
  });
});

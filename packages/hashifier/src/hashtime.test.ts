/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { hashtime } from "./hashtime";

describe("hashtime", () => {
  it("should return the same hash for timestamps within the same timestep", () => {
    const timestep = 60000; // 1 minute in milliseconds
    const timestamp1 = 1633036800000; // Arbitrary timestamp
    const timestamp2 = 1633036805999; // Within the same 1-minute window

    const hash1 = hashtime(timestamp1, timestep);
    const hash2 = hashtime(timestamp2, timestep);

    expect(hash1).toBe(hash2); // Same hash for timestamps in same window
  });

  it("should return different hashes for timestamps in different timesteps", () => {
    const timestep = 60000; // 1 minute in milliseconds
    const timestamp1 = 1633036800000; // Arbitrary timestamp
    const timestamp2 = 1633036860000; // 1 minute later

    const hash1 = hashtime(timestamp1, timestep);
    const hash2 = hashtime(timestamp2, timestep);

    expect(hash1).not.toBe(hash2); // Different hash for different time windows
  });

  it("should return a valid base-36 string", () => {
    const timestep = 1000; // 1 second in milliseconds
    const timestamp = Date.now();

    const hash = hashtime(timestamp, timestep);

    expect(hash).toMatch(/^[0-9a-z]+$/); // Base-36 characters only
  });

  it("should use default timestep if not provided", () => {
    const timestamp = 1633036800000;

    const hash = hashtime(timestamp);
    const expectedHash = Math.floor(timestamp).toString(36);

    expect(hash).toBe(expectedHash); // Direct base-36 conversion of timestamp
  });

  it("should handle zero timestep", () => {
    const timestamp = 1633036800000;

    expect(() => hashtime(timestamp, 0)).toThrow(); // Edge case test
  });
});

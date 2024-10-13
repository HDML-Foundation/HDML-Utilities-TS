/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { uid } from "./uid";

/**
 * Tests for the uid function.
 */
describe("uid Function", () => {
  /** Test that uid returns a string */
  it("should return a string", () => {
    const result = uid();
    expect(typeof result).toBe("string");
  });

  /** Test that uid returns unique values on multiple calls */
  it("should return unique values for each call", () => {
    const uid1 = uid();
    const uid2 = uid();
    expect(uid1).not.toBe(uid2);
  });

  /** Test that uid returns a valid UUID format */
  it("should return a string that resembles a UUID", () => {
    const result = uid();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(result).toMatch(uuidRegex);
  });
});

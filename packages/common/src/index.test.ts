/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { arrow, uuid, throdeb } from ".";

describe("Common package", () => {
  it("should export expected types", () => {
    expect(arrow).toBeDefined();
    expect(uuid).toBeDefined();
    expect(throdeb).toBeDefined();
  });
});

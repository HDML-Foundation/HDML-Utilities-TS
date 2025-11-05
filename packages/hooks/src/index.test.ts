/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import {
  readString,
  readJson,
  readUint8Array,
  writeString,
  writeJson,
  writeUint8Array,
} from ".";

describe("Common package", () => {
  it("should export expected types", () => {
    expect(readString).toBeDefined();
    expect(readJson).toBeDefined();
    expect(readUint8Array).toBeDefined();
    expect(writeString).toBeDefined();
    expect(writeJson).toBeDefined();
    expect(writeUint8Array).toBeDefined();
  });
});

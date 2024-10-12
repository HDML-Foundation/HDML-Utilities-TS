/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { IInclude } from "@hdml/schemas";
import { getIncludeData } from "./getIncludeData";
import { INCLUDE_ATTRS_LIST } from "../enums/INCLUDE_ATTRS_LIST";

describe("The `getIncludeData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getIncludeData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getIncludeData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `IInclude` object if correct attributes passed", () => {
    const include = getIncludeData([
      { name: INCLUDE_ATTRS_LIST.PATH, value: "value" },
    ]) as IInclude;

    expect(include).toBeDefined();
    expect(
      Object.hasOwn(include, INCLUDE_ATTRS_LIST.PATH),
    ).toBeTruthy();
    expect(include.path).toBe("value");
  });
});

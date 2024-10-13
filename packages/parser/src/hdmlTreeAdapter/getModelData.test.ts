/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { Model } from "@hdml/types";
import { getModelData } from "./getModelData";
import { MODEL_ATTRS_LIST } from "../enums/MODEL_ATTRS_LIST";

describe("The `getModelData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getModelData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getModelData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `Model` object if correct attributes passed", () => {
    const model = getModelData([
      { name: MODEL_ATTRS_LIST.NAME, value: "value" },
      { name: MODEL_ATTRS_LIST.DESCRIPTION, value: "description" },
    ]) as Model;

    expect(model).not.toBeNull();
    expect(Object.hasOwn(model, MODEL_ATTRS_LIST.NAME)).toBeTruthy();
    expect(model.name).toBe("value");
    expect(model.description).toBe("description");
  });
});

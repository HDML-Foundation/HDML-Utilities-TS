/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { IModel } from "@hdml/schemas";
import { getModelData } from "./getModelData";
import { MODEL_ATTRS_LIST } from "../enums/MODEL_ATTRS_LIST";

describe("The `getModelData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getModelData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getModelData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `IModel` object if correct attributes passed", () => {
    const model = getModelData([
      { name: MODEL_ATTRS_LIST.NAME, value: "value" },
    ]) as IModel;

    expect(model).not.toBeNull();
    expect(Object.hasOwn(model, MODEL_ATTRS_LIST.NAME)).toBeTruthy();
    expect(model.name).toBe("value");
  });
});

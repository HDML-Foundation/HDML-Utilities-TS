/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import {
  Model,
  MODEL_ATTRS_LIST,
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { getModelData } from "./getModelData";
import { DiagnosticSink } from "../diagnostics";

const MESSAGE =
  "`<hdml-model>` needs a `name`; this one was dropped.";

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

describe("The `getModelData` diagnostic", () => {
  it("records the drop and still returns `null`", () => {
    const sink: DiagnosticSink = [];

    expect(getModelData([], sink)).toBeNull();
    expect(sink.length).toBe(1);
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME,
    );
    expect(sink[0].severity).toBe("error");
    expect(sink[0].message).toBe(MESSAGE);
  });

  it("records nothing for a model it accepts", () => {
    const sink: DiagnosticSink = [];
    const model = getModelData(
      [{ name: MODEL_ATTRS_LIST.NAME, value: "m" }],
      sink,
    ) as Model;

    expect(model).not.toBeNull();
    expect(sink.length).toBe(0);
  });
});

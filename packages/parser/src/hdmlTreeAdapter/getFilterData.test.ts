/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { FilterType, FilterName } from "@hdml/schemas";
import { getFilterData } from "./getFilterData";
import { FILTER_ATTRS_LIST } from "../enums/FILTER_ATTRS_LIST";
import { FILTER_TYPE_VALUES } from "../enums/FILTER_TYPE_VALUES";
import { FILTER_NAME_VALUES } from "../enums/FILTER_NAME_VALUES";

describe("The `getFilterData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getFilterData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getFilterData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `null` if `type` attribute is missed or incorrect", () => {
    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.LEFT,
          value: "left",
        },
        {
          name: FILTER_ATTRS_LIST.RIGHT,
          value: "right",
        },
      ]),
    ).toBeNull();

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: "invalid",
        },
        {
          name: FILTER_ATTRS_LIST.LEFT,
          value: "left",
        },
        {
          name: FILTER_ATTRS_LIST.RIGHT,
          value: "right",
        },
      ]),
    ).toBeNull();
  });

  it("shoud return `null` if `left` or `right` attribute is missed for `keys` filter", () => {
    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.KEYS,
        },
        {
          name: FILTER_ATTRS_LIST.RIGHT,
          value: "right",
        },
      ]),
    ).toBeNull();

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.KEYS,
        },
        {
          name: FILTER_ATTRS_LIST.LEFT,
          value: "left",
        },
      ]),
    ).toBeNull();
  });

  it("shoud return `null` if `clause` attribute is missed for `expr` filter", () => {
    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.EXPR,
        },
      ]),
    ).toBeNull();
  });

  it("shoud return `null` if `name`, `field` or `value` attribute is missed for `named` filter", () => {
    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toBeNull();

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.BETWEEN,
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toBeNull();

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.BETWEEN,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
      ]),
    ).toBeNull();
  });

  it("shoud return `IFilter` object if correct attributes passed for `keys` filter", () => {
    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.KEYS,
        },
        {
          name: FILTER_ATTRS_LIST.LEFT,
          value: "left",
        },
        {
          name: FILTER_ATTRS_LIST.RIGHT,
          value: "right",
        },
      ]),
    ).toEqual({
      type: FilterType.Keys,
      options: {
        left: "left",
        right: "right",
      },
    });
  });

  it("shoud return `IFilter` object if correct attributes passed for `expr` filter", () => {
    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.EXPR,
        },
        {
          name: FILTER_ATTRS_LIST.CLAUSE,
          value: "clause",
        },
      ]),
    ).toEqual({
      type: FilterType.Expression,
      options: {
        clause: "clause",
      },
    });
  });

  it("shoud return `IFilter` object if correct attributes passed for `named` filter", () => {
    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.BETWEEN,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "'value1','value2'",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.Between,
        field: "field",
        values: ["'value1'", "'value2'"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.CONTAINS,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.Contains,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.ENDS_WITH,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.EndsWith,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.EQUALS,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.Equals,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.GREATER,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.Greater,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.GREATER_EQUAL,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.GreaterEqual,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.IS_NOT_NULL,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.IsNotNull,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.IS_NULL,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.IsNull,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.LESS,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.Less,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.LESS_EQUAL,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.LessEqual,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.NOT_CONTAINS,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.NotContains,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.NOT_EQUALS,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.NotEquals,
        field: "field",
        values: ["value"],
      },
    });

    expect(
      getFilterData([
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.STARTS_WITH,
        },
        {
          name: FILTER_ATTRS_LIST.FIELD,
          value: "field",
        },
        {
          name: FILTER_ATTRS_LIST.VALUES,
          value: "value",
        },
      ]),
    ).toEqual({
      type: FilterType.Named,
      options: {
        name: FilterName.StartsWith,
        field: "field",
        values: ["value"],
      },
    });
  });
});

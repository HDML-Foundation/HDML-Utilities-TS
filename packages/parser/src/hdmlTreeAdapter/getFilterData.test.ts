/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { FilterTypeEnum, FilterNameEnum } from "@hdml/schemas";
import { getFilterData } from "./getFilterData";
import {
  FILTER_ATTRS_LIST,
  FILTER_TYPE_VALUES,
  FILTER_NAME_VALUES,
} from "@hdml/types";

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

  it("shoud return `Filter` object if correct attributes passed for `keys` filter", () => {
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
      type: FilterTypeEnum.Keys,
      options: {
        left: "left",
        right: "right",
      },
    });
  });

  it("shoud return `Filter` object if correct attributes passed for `expr` filter", () => {
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
      type: FilterTypeEnum.Expression,
      options: {
        clause: "clause",
      },
    });
  });

  it("shoud return `Filter` object if correct attributes passed for `named` filter", () => {
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Between,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Contains,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.EndsWith,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Greater,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.GreaterEqual,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.IsNotNull,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.IsNull,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Less,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.LessEqual,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.NotContains,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.NotEquals,
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
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.StartsWith,
        field: "field",
        values: ["value"],
      },
    });
  });
});

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { FilterOperator } from "@hdml/schemas";
import { getConnectiveData } from "./getConnectiveData";
import { CONNECTIVE_ATTRS_LIST } from "../enums/CONNECTIVE_ATTRS_LIST";
import { CONNECTIVE_OP_VALUES } from "../enums/CONNECTIVE_OP_VALUES";

describe("The `getConnectiveData` function", () => {
  it("shoud return `IFilterClause` object if empty attributes are passed", () => {
    expect(getConnectiveData([])).toEqual({
      type: FilterOperator.None,
      filters: [],
      children: [],
    });
  });

  it("shoud return `IFilterClause` object if incorrect attributes are passed", () => {
    expect(getConnectiveData([{ name: "a", value: "b" }])).toEqual({
      type: FilterOperator.None,
      filters: [],
      children: [],
    });
  });

  it("shoud return `IFilterClause` object if incorrect `operator` attribute value is passed", () => {
    expect(
      getConnectiveData([
        { name: CONNECTIVE_ATTRS_LIST.OPERATOR, value: "incorrect" },
      ]),
    ).toEqual({
      type: FilterOperator.None,
      filters: [],
      children: [],
    });
  });

  it("shoud return `IFilterClause` object if correct attributes are passed", () => {
    expect(
      getConnectiveData([
        {
          name: CONNECTIVE_ATTRS_LIST.OPERATOR,
          value: CONNECTIVE_OP_VALUES.NONE,
        },
      ]),
    ).toEqual({
      type: FilterOperator.None,
      filters: [],
      children: [],
    });

    expect(
      getConnectiveData([
        {
          name: CONNECTIVE_ATTRS_LIST.OPERATOR,
          value: CONNECTIVE_OP_VALUES.OR,
        },
      ]),
    ).toEqual({
      type: FilterOperator.Or,
      filters: [],
      children: [],
    });

    expect(
      getConnectiveData([
        {
          name: CONNECTIVE_ATTRS_LIST.OPERATOR,
          value: CONNECTIVE_OP_VALUES.AND,
        },
      ]),
    ).toEqual({
      type: FilterOperator.And,
      filters: [],
      children: [],
    });
  });
});

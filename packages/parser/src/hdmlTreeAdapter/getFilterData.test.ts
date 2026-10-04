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
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { DiagnosticSink } from "../diagnostics";

const NO_TYPE =
  "`<hdml-filter>` needs a `type` of `expr`, `keys` or `named`; this one was dropped.";
const KEYS =
  '`<hdml-filter type="keys">` needs `left` and `right`; this one was dropped.';
const EXPR =
  '`<hdml-filter type="expr">` needs a `clause`; this one was dropped.';
const NAMED =
  '`<hdml-filter type="named">` needs `name`, `field` and `values`; this one was dropped.';

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

describe("The `getFilterData` diagnostic", () => {
  it("reports an absent `type`", () => {
    const sink: DiagnosticSink = [];

    expect(getFilterData([], sink)).toBeNull();
    expect(sink.length).toBe(1);
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_TYPE,
    );
    expect(sink[0].severity).toBe("error");
    expect(sink[0].message).toBe(NO_TYPE);
  });

  it("reports an unrecognized `type` the same way", () => {
    const sink: DiagnosticSink = [];
    const data = getFilterData(
      [{ name: FILTER_ATTRS_LIST.TYPE, value: "nope" }],
      sink,
    );

    // ★ The author wrote a `type` and it was none of the three,
    // so the switch never assigned one -- which is why the
    // message LISTS the three legal values rather than saying
    // `type` is missing.
    expect(data).toBeNull();
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_TYPE,
    );
    expect(sink[0].message).toBe(NO_TYPE);
  });

  it("names what `keys` requires", () => {
    const sink: DiagnosticSink = [];
    const data = getFilterData(
      [
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.KEYS,
        },
        { name: FILTER_ATTRS_LIST.LEFT, value: "a" },
      ],
      sink,
    );

    expect(data).toBeNull();
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_OPERANDS,
    );
    expect(sink[0].message).toBe(KEYS);
  });

  it("names what `expr` requires", () => {
    const sink: DiagnosticSink = [];
    const data = getFilterData(
      [
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.EXPR,
        },
      ],
      sink,
    );

    expect(data).toBeNull();
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_OPERANDS,
    );
    // ★ Three sites share one code and must NOT share one
    // string: the author needs to know what THIS type requires.
    expect(sink[0].message).toBe(EXPR);
    expect(sink[0].message).not.toBe(KEYS);
  });

  it("names what `named` requires", () => {
    const sink: DiagnosticSink = [];
    const data = getFilterData(
      [
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.NAMED,
        },
        {
          name: FILTER_ATTRS_LIST.NAME,
          value: FILTER_NAME_VALUES.EQUALS,
        },
        { name: FILTER_ATTRS_LIST.FIELD, value: "f" },
      ],
      sink,
    );

    expect(data).toBeNull();
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_OPERANDS,
    );
    expect(sink[0].message).toBe(NAMED);
    expect(sink[0].message).not.toBe(EXPR);
  });

  it("records nothing for a filter it accepts", () => {
    const sink: DiagnosticSink = [];
    const data = getFilterData(
      [
        {
          name: FILTER_ATTRS_LIST.TYPE,
          value: FILTER_TYPE_VALUES.EXPR,
        },
        { name: FILTER_ATTRS_LIST.CLAUSE, value: "1 = 1" },
      ],
      sink,
    );

    expect(data).not.toBeNull();
    expect(sink.length).toBe(0);
  });
});

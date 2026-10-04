/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { JoinTypeEnum, FilterOperatorEnum } from "@hdml/schemas";
import {
  JOIN_ATTRS_LIST,
  JOIN_TYPE_VALUES,
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { getJoinData } from "./getJoinData";
import { DiagnosticSink } from "../diagnostics";

const MESSAGE =
  "`<hdml-join>` needs `left` and `right`; this one was dropped.";

describe("The `getJoinData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getJoinData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getJoinData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `null` if `left` attribute ismissing", () => {
    expect(
      getJoinData([
        { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.CROSS },
        { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
      ]),
    ).toBeNull();
  });

  it("shoud return `null` if `right` attribute ismissing", () => {
    expect(
      getJoinData([
        { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.CROSS },
        { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      ]),
    ).toBeNull();
  });

  it("shoud return `Join` object if correct attributes passed", () => {
    let data = getJoinData([
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
      { name: JOIN_ATTRS_LIST.DESCRIPTION, value: "description" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.Cross,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: "description",
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.CROSS },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.Cross,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: null,
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.FULL },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.Full,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: null,
    });

    data = getJoinData([
      {
        name: JOIN_ATTRS_LIST.TYPE,
        value: JOIN_TYPE_VALUES.FULL_OUTER,
      },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.FullOuter,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: null,
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.INNER },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.Inner,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: null,
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.LEFT },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.Left,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: null,
    });

    data = getJoinData([
      {
        name: JOIN_ATTRS_LIST.TYPE,
        value: JOIN_TYPE_VALUES.LEFT_OUTER,
      },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.LeftOuter,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: null,
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.RIGHT },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.Right,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: null,
    });

    data = getJoinData([
      {
        name: JOIN_ATTRS_LIST.TYPE,
        value: JOIN_TYPE_VALUES.RIGHT_OUTER,
      },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinTypeEnum.RightOuter,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      description: null,
    });
  });
});

describe("The `getJoinData` diagnostic", () => {
  it("records the drop and still returns `null`", () => {
    const sink: DiagnosticSink = [];
    const data = getJoinData(
      [{ name: JOIN_ATTRS_LIST.LEFT, value: "a" }],
      sink,
    );

    expect(data).toBeNull();
    expect(sink.length).toBe(1);
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_JOIN_SIDES,
    );
    expect(sink[0].severity).toBe("error");
    expect(sink[0].message).toBe(MESSAGE);
  });

  it("records nothing for a join it accepts", () => {
    const sink: DiagnosticSink = [];
    const data = getJoinData(
      [
        { name: JOIN_ATTRS_LIST.LEFT, value: "a" },
        { name: JOIN_ATTRS_LIST.RIGHT, value: "b" },
      ],
      sink,
    );

    expect(data).not.toBeNull();
    expect(sink.length).toBe(0);
  });
});

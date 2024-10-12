/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { JoinType, FilterOperator } from "@hdml/schemas";
import { getJoinData } from "./getJoinData";
import { JOIN_ATTRS_LIST } from "../enums/JOIN_ATTRS_LIST";
import { JOIN_TYPE_VALUES } from "../enums/JOIN_TYPE_VALUES";

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

  it("shoud return `IJoin` object if correct attributes passed", () => {
    let data = getJoinData([
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinType.Cross,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.CROSS },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinType.Cross,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.FULL },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinType.Full,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
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
      type: JoinType.FullOuter,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.INNER },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinType.Inner,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.LEFT },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinType.Left,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
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
      type: JoinType.LeftOuter,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
    });

    data = getJoinData([
      { name: JOIN_ATTRS_LIST.TYPE, value: JOIN_TYPE_VALUES.RIGHT },
      { name: JOIN_ATTRS_LIST.LEFT, value: "left" },
      { name: JOIN_ATTRS_LIST.RIGHT, value: "right" },
    ]);
    expect(data).not.toBeNull();
    expect(data).toEqual({
      type: JoinType.Right,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
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
      type: JoinType.RightOuter,
      left: "left",
      right: "right",
      clause: {
        type: FilterOperator.None,
        filters: [],
        children: [],
      },
    });
  });
});

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { FilterOperator } from "@hdml/schemas";
import { getFrameData } from "./getFrameData";
import { FRAME_ATTRS_LIST } from "../enums/FRAME_ATTR_LIST";

describe("The `getFrameData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getFrameData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getFrameData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `null` if `name` attribute is missed", () => {
    expect(
      getFrameData([
        { name: FRAME_ATTRS_LIST.SOURCE, value: "source" },
        { name: FRAME_ATTRS_LIST.OFFSET, value: "100" },
        { name: FRAME_ATTRS_LIST.LIMIT, value: "1000" },
      ]),
    ).toBeNull();
  });

  it("shoud return `null` if `source` attribute is missed", () => {
    expect(
      getFrameData([
        { name: FRAME_ATTRS_LIST.NAME, value: "name" },
        { name: FRAME_ATTRS_LIST.OFFSET, value: "100" },
        { name: FRAME_ATTRS_LIST.LIMIT, value: "1000" },
      ]),
    ).toBeNull();
  });

  it("shoud return `IFrame` object if correct attributes passed", () => {
    // with limit and offset
    let frame = getFrameData([
      { name: FRAME_ATTRS_LIST.NAME, value: "name" },
      { name: FRAME_ATTRS_LIST.SOURCE, value: "source" },
      { name: FRAME_ATTRS_LIST.OFFSET, value: "100" },
      { name: FRAME_ATTRS_LIST.LIMIT, value: "1000" },
    ]);

    expect(frame).not.toBeNull();
    expect(frame?.name).toBe("name");
    expect(frame?.source).toBe("source");
    expect(frame?.offset).toBe(100);
    expect(frame?.limit).toBe(1000);
    expect(frame?.fields).toEqual([]);
    expect(frame?.group_by).toEqual([]);
    expect(frame?.sort_by).toEqual([]);
    expect(frame?.split_by).toEqual([]);
    expect(frame?.filter_by).toEqual({
      type: FilterOperator.None,
      filters: [],
      children: [],
    });

    // with limit and offset
    frame = getFrameData([
      { name: FRAME_ATTRS_LIST.NAME, value: "name" },
      { name: FRAME_ATTRS_LIST.SOURCE, value: "source" },
    ]);

    expect(frame).not.toBeNull();
    expect(frame?.name).toBe("name");
    expect(frame?.source).toBe("source");
    expect(frame?.offset).toBe(0);
    expect(frame?.limit).toBe(100000);
    expect(frame?.fields).toEqual([]);
    expect(frame?.group_by).toEqual([]);
    expect(frame?.sort_by).toEqual([]);
    expect(frame?.split_by).toEqual([]);
    expect(frame?.filter_by).toEqual({
      type: FilterOperator.None,
      filters: [],
      children: [],
    });
  });
});

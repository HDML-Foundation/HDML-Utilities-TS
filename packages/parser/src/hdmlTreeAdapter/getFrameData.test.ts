/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { FilterOperatorEnum } from "@hdml/schemas";
import { getFrameData } from "./getFrameData";
import { FRAME_ATTRS_LIST, HDQL_DIAGNOSTIC_CODES } from "@hdml/types";
import { DiagnosticSink } from "../diagnostics";

const NEEDS = "`<hdml-frame>` needs `name` and `source`; missing: ";
const TAIL = ". This one was dropped.";

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

  it("shoud return `Frame` object if correct attributes passed", () => {
    // with limit and offset
    let frame = getFrameData([
      { name: FRAME_ATTRS_LIST.NAME, value: "name" },
      { name: FRAME_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FRAME_ATTRS_LIST.SOURCE, value: "source" },
      { name: FRAME_ATTRS_LIST.OFFSET, value: "100" },
      { name: FRAME_ATTRS_LIST.LIMIT, value: "1000" },
    ]);

    expect(frame).not.toBeNull();
    expect(frame?.name).toBe("name");
    expect(frame?.description).toBe("description");
    expect(frame?.source).toBe("source");
    expect(frame?.offset).toBe(100);
    expect(frame?.limit).toBe(1000);
    expect(frame?.fields).toEqual([]);
    expect(frame?.group_by).toEqual([]);
    expect(frame?.sort_by).toEqual([]);
    expect(frame?.split_by).toEqual([]);
    expect(frame?.filter_by).toEqual({
      type: FilterOperatorEnum.None,
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
      type: FilterOperatorEnum.None,
      filters: [],
      children: [],
    });
  });
});

describe("The `getFrameData` diagnostic", () => {
  it("names `source` when only `name` is present", () => {
    const sink: DiagnosticSink = [];
    const data = getFrameData(
      [{ name: FRAME_ATTRS_LIST.NAME, value: "f" }],
      sink,
    );

    expect(data).toBeNull();
    expect(sink.length).toBe(1);
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
    );
    expect(sink[0].severity).toBe("error");
    expect(sink[0].message).toBe(NEEDS + "`source`" + TAIL);
  });

  it("names `name` when only `source` is present", () => {
    const sink: DiagnosticSink = [];
    const data = getFrameData(
      [{ name: FRAME_ATTRS_LIST.SOURCE, value: "/s.html" }],
      sink,
    );

    expect(data).toBeNull();
    // ★ The mirror. One message that says "name or source is
    // missing" would pass both of these and tell the author
    // nothing; two different strings are the gate.
    expect(sink[0].message).toBe(NEEDS + "`name`" + TAIL);
  });

  it("names both when neither is present", () => {
    const sink: DiagnosticSink = [];

    expect(getFrameData([], sink)).toBeNull();
    expect(sink[0].message).toBe(NEEDS + "`name`, `source`" + TAIL);
  });

  it("records nothing for a frame it accepts", () => {
    const sink: DiagnosticSink = [];
    const data = getFrameData(
      [
        { name: FRAME_ATTRS_LIST.NAME, value: "f" },
        { name: FRAME_ATTRS_LIST.SOURCE, value: "/s.html" },
      ],
      sink,
    );

    expect(data).not.toBeNull();
    expect(sink.length).toBe(0);
  });
});

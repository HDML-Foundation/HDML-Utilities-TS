/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { TableTypeEnum } from "@hdml/schemas";
import {
  Table,
  DATASET_ATTRS_LIST,
  DATASET_TYPE_VALUES,
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { getTableData } from "./getTableData";
import { DiagnosticSink } from "../diagnostics";

const NEEDS =
  "`<hdml-dataset>` needs `name`, `type` (`table` or `query`) and `identifier`; missing or not recognized: ";
const TAIL = ". This one was dropped.";

describe("The `getTableData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getTableData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getTableData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `null` if `name` attribute is missed", () => {
    const data = getTableData([
      { name: DATASET_ATTRS_LIST.TYPE, value: "table" },
      { name: DATASET_ATTRS_LIST.IDENTIFIER, value: "identifier" },
    ]) as Table;

    expect(data).toBeNull();
  });

  it("shoud return `null` if `type` attribute is missed", () => {
    const data = getTableData([
      { name: DATASET_ATTRS_LIST.NAME, value: "name" },
      { name: DATASET_ATTRS_LIST.IDENTIFIER, value: "identifier" },
    ]) as Table;

    expect(data).toBeNull();
  });

  it("shoud return `null` if `identifier` attribute is missed", () => {
    const data = getTableData([
      { name: DATASET_ATTRS_LIST.NAME, value: "name" },
      { name: DATASET_ATTRS_LIST.TYPE, value: "table" },
    ]) as Table;

    expect(data).toBeNull();
  });

  it("shoud return `null` if incorrect `type` attribute was passed", () => {
    const data = getTableData([
      { name: DATASET_ATTRS_LIST.NAME, value: "name" },
      { name: DATASET_ATTRS_LIST.TYPE, value: "type" },
      { name: DATASET_ATTRS_LIST.IDENTIFIER, value: "identifier" },
    ]) as Table;

    expect(data).toBeNull();
  });

  it("shoud return `Table` object if correct attributes are passed", () => {
    // table type
    let data = getTableData([
      { name: DATASET_ATTRS_LIST.NAME, value: "name" },
      { name: DATASET_ATTRS_LIST.TYPE, value: "table" },
      { name: DATASET_ATTRS_LIST.IDENTIFIER, value: "identifier" },
      { name: DATASET_ATTRS_LIST.DESCRIPTION, value: "description" },
    ]) as Table;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      description: "description",
      type: TableTypeEnum.Table,
      identifier: "identifier",
      fields: [],
    });

    // query type
    data = getTableData([
      { name: DATASET_ATTRS_LIST.NAME, value: "name" },
      { name: DATASET_ATTRS_LIST.TYPE, value: "query" },
      { name: DATASET_ATTRS_LIST.IDENTIFIER, value: "identifier" },
    ]) as Table;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      description: null,
      type: TableTypeEnum.Query,
      identifier: "identifier",
      fields: [],
    });
  });
});

describe("The `getTableData` diagnostic", () => {
  it("names `identifier` when it is absent", () => {
    const sink: DiagnosticSink = [];
    const data = getTableData(
      [
        { name: DATASET_ATTRS_LIST.NAME, value: "d" },
        {
          name: DATASET_ATTRS_LIST.TYPE,
          value: DATASET_TYPE_VALUES.TABLE,
        },
      ],
      sink,
    );

    // ★ `null` here is the `return data` at the bottom of the
    // helper, not an early `return null` -- this is the one drop
    // site of the seventeen with no `return null` behind it.
    expect(data).toBeNull();
    expect(sink.length).toBe(1);
    expect(sink[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_DATASET_ATTRS,
    );
    expect(sink[0].severity).toBe("error");
    expect(sink[0].message).toBe(NEEDS + "`identifier`" + TAIL);
  });

  it("names `type` when it is not recognized", () => {
    const sink: DiagnosticSink = [];
    const data = getTableData(
      [
        { name: DATASET_ATTRS_LIST.NAME, value: "d" },
        { name: DATASET_ATTRS_LIST.TYPE, value: "view" },
        { name: DATASET_ATTRS_LIST.IDENTIFIER, value: "t" },
      ],
      sink,
    );

    // ★ The author DID write a `type`; it was not `table` or
    // `query`, so the switch never assigned one. "missing or not
    // recognized" is why the message is worded that way.
    expect(data).toBeNull();
    expect(sink[0].message).toBe(NEEDS + "`type`" + TAIL);
  });

  it("names all three when none is present", () => {
    const sink: DiagnosticSink = [];

    expect(getTableData([], sink)).toBeNull();
    expect(sink[0].message).toBe(
      NEEDS + "`name`, `type`, `identifier`" + TAIL,
    );
  });

  it("records nothing for a dataset it accepts", () => {
    const sink: DiagnosticSink = [];
    const data = getTableData(
      [
        { name: DATASET_ATTRS_LIST.NAME, value: "d" },
        {
          name: DATASET_ATTRS_LIST.TYPE,
          value: DATASET_TYPE_VALUES.TABLE,
        },
        { name: DATASET_ATTRS_LIST.IDENTIFIER, value: "t" },
      ],
      sink,
    ) as Table;

    expect(data).not.toBeNull();
    expect(sink.length).toBe(0);
  });
});

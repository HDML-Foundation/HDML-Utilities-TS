/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { TableTypeEnum } from "@hdml/schemas";
import { Table, TABLE_ATTRS_LIST } from "@hdml/types";
import { getTableData } from "./getTableData";

describe("The `getTableData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getTableData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getTableData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `null` if `name` attribute is missed", () => {
    const data = getTableData([
      { name: TABLE_ATTRS_LIST.TYPE, value: "table" },
      { name: TABLE_ATTRS_LIST.IDENTIFIER, value: "identifier" },
    ]) as Table;

    expect(data).toBeNull();
  });

  it("shoud return `null` if `type` attribute is missed", () => {
    const data = getTableData([
      { name: TABLE_ATTRS_LIST.NAME, value: "name" },
      { name: TABLE_ATTRS_LIST.IDENTIFIER, value: "identifier" },
    ]) as Table;

    expect(data).toBeNull();
  });

  it("shoud return `null` if `identifier` attribute is missed", () => {
    const data = getTableData([
      { name: TABLE_ATTRS_LIST.NAME, value: "name" },
      { name: TABLE_ATTRS_LIST.TYPE, value: "table" },
    ]) as Table;

    expect(data).toBeNull();
  });

  it("shoud return `null` if incorrect `type` attribute was passed", () => {
    const data = getTableData([
      { name: TABLE_ATTRS_LIST.NAME, value: "name" },
      { name: TABLE_ATTRS_LIST.TYPE, value: "type" },
      { name: TABLE_ATTRS_LIST.IDENTIFIER, value: "identifier" },
    ]) as Table;

    expect(data).toBeNull();
  });

  it("shoud return `Table` object if correct attributes are passed", () => {
    // table type
    let data = getTableData([
      { name: TABLE_ATTRS_LIST.NAME, value: "name" },
      { name: TABLE_ATTRS_LIST.TYPE, value: "table" },
      { name: TABLE_ATTRS_LIST.IDENTIFIER, value: "identifier" },
      { name: TABLE_ATTRS_LIST.DESCRIPTION, value: "description" },
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
      { name: TABLE_ATTRS_LIST.NAME, value: "name" },
      { name: TABLE_ATTRS_LIST.TYPE, value: "query" },
      { name: TABLE_ATTRS_LIST.IDENTIFIER, value: "identifier" },
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

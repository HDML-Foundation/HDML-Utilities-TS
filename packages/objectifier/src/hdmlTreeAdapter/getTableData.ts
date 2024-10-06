/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ITable, TableType } from "@hdml/schemas";
import { Token } from "parse5";
import { TABLE_ATTRS_LIST } from "../enums/TABLE_ATTRS_LIST";

export function getTableData(
  attrs: Token.Attribute[],
): null | ITable {
  let data: null | ITable = null;
  let name: null | string = null;
  let type: null | TableType = null;
  let identifier: null | string = null;
  attrs.forEach((attr) => {
    switch (attr.name as TABLE_ATTRS_LIST) {
      case TABLE_ATTRS_LIST.NAME:
        name = attr.value;
        break;
      case TABLE_ATTRS_LIST.TYPE:
        if (attr.value === "table") {
          type = TableType.Table;
        } else if (attr.value === "query") {
          type = TableType.Query;
        }
        break;
      case TABLE_ATTRS_LIST.IDENTIFIER:
        identifier = attr.value;
        break;
    }
  });
  if (name && type !== null && identifier) {
    data = {
      name,
      type,
      identifier,
      fields: [],
    };
  }
  return data;
}

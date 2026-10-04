/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { TableTypeEnum } from "@hdml/schemas";
import {
  Table,
  DATASET_ATTRS_LIST,
  DATASET_TYPE_VALUES,
} from "@hdml/types";
import { Token } from "parse5";
import { backticksToQuotes } from "./backticksToQuotes";

export function getTableData(attrs: Token.Attribute[]): null | Table {
  let data: null | Table = null;
  let name: null | string = null;
  let type: null | TableTypeEnum = null;
  let identifier: null | string = null;
  let description: null | string = null;
  attrs.forEach((attr) => {
    switch (attr.name as DATASET_ATTRS_LIST) {
      case DATASET_ATTRS_LIST.NAME:
        name = attr.value;
        break;
      case DATASET_ATTRS_LIST.TYPE:
        switch (attr.value as DATASET_TYPE_VALUES) {
          case DATASET_TYPE_VALUES.TABLE:
            type = TableTypeEnum.Table;
            break;
          case DATASET_TYPE_VALUES.QUERY:
            type = TableTypeEnum.Query;
            break;
        }
        break;
      case DATASET_ATTRS_LIST.IDENTIFIER:
        identifier = backticksToQuotes(attr.value);
        break;
      case DATASET_ATTRS_LIST.DESCRIPTION:
        description = attr.value;
        break;
    }
  });
  if (name && type !== null && identifier) {
    data = {
      name,
      description,
      type,
      identifier,
      fields: [],
    };
  }
  return data;
}

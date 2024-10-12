/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IFilterClause, FilterOperator } from "@hdml/schemas";
import { Token } from "parse5";
/* eslint-disable-next-line max-len */
import { CONNECTIVE_ATTRS_LIST } from "../enums/CONNECTIVE_ATTRS_LIST";
import { CONNECTIVE_OP_VALUES } from "../enums/CONNECTIVE_OP_VALUES";

export function getConnectiveData(
  attrs: Token.Attribute[],
): IFilterClause {
  const data: IFilterClause = {
    type: FilterOperator.None,
    filters: [],
    children: [],
  };
  attrs.forEach((attr) => {
    switch (attr.name as CONNECTIVE_ATTRS_LIST) {
      case CONNECTIVE_ATTRS_LIST.OPERATOR:
        switch (attr.value as CONNECTIVE_OP_VALUES) {
          case CONNECTIVE_OP_VALUES.NONE:
            data.type = FilterOperator.None;
            break;
          case CONNECTIVE_OP_VALUES.OR:
            data.type = FilterOperator.Or;
            break;
          case CONNECTIVE_OP_VALUES.AND:
            data.type = FilterOperator.And;
            break;
        }
        break;
    }
  });
  return data;
}

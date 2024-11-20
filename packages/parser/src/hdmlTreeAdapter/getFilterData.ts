/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { FilterTypeEnum, FilterNameEnum } from "@hdml/schemas";
import {
  Filter,
  FILTER_ATTRS_LIST,
  FILTER_TYPE_VALUES,
  FILTER_NAME_VALUES,
} from "@hdml/types";
import { Token } from "parse5";

export function getFilterData(
  attrs: Token.Attribute[],
): null | Filter {
  let data: null | Filter = null;
  let type: null | FilterTypeEnum = null;
  let clause: null | string = null;
  let left: null | string = null;
  let right: null | string = null;
  let name: null | FilterNameEnum = null;
  let field: null | string = null;
  let values: string[] = [];

  attrs.forEach((attr) => {
    switch (attr.name as FILTER_ATTRS_LIST) {
      case FILTER_ATTRS_LIST.TYPE:
        switch (attr.value as FILTER_TYPE_VALUES) {
          case FILTER_TYPE_VALUES.EXPR:
            type = FilterTypeEnum.Expression;
            break;
          case FILTER_TYPE_VALUES.KEYS:
            type = FilterTypeEnum.Keys;
            break;
          case FILTER_TYPE_VALUES.NAMED:
            type = FilterTypeEnum.Named;
            break;
        }
        break;
      case FILTER_ATTRS_LIST.CLAUSE:
        clause = attr.value;
        break;
      case FILTER_ATTRS_LIST.LEFT:
        left = attr.value;
        break;
      case FILTER_ATTRS_LIST.RIGHT:
        right = attr.value;
        break;
      case FILTER_ATTRS_LIST.NAME:
        switch (attr.value as FILTER_NAME_VALUES) {
          case FILTER_NAME_VALUES.BETWEEN:
            name = FilterNameEnum.Between;
            break;
          case FILTER_NAME_VALUES.CONTAINS:
            name = FilterNameEnum.Contains;
            break;
          case FILTER_NAME_VALUES.ENDS_WITH:
            name = FilterNameEnum.EndsWith;
            break;
          case FILTER_NAME_VALUES.EQUALS:
            name = FilterNameEnum.Equals;
            break;
          case FILTER_NAME_VALUES.GREATER:
            name = FilterNameEnum.Greater;
            break;
          case FILTER_NAME_VALUES.GREATER_EQUAL:
            name = FilterNameEnum.GreaterEqual;
            break;
          case FILTER_NAME_VALUES.IS_NOT_NULL:
            name = FilterNameEnum.IsNotNull;
            break;
          case FILTER_NAME_VALUES.IS_NULL:
            name = FilterNameEnum.IsNull;
            break;
          case FILTER_NAME_VALUES.LESS:
            name = FilterNameEnum.Less;
            break;
          case FILTER_NAME_VALUES.LESS_EQUAL:
            name = FilterNameEnum.LessEqual;
            break;
          case FILTER_NAME_VALUES.NOT_CONTAINS:
            name = FilterNameEnum.NotContains;
            break;
          case FILTER_NAME_VALUES.NOT_EQUALS:
            name = FilterNameEnum.NotEquals;
            break;
          case FILTER_NAME_VALUES.STARTS_WITH:
            name = FilterNameEnum.StartsWith;
            break;
        }
        break;
      case FILTER_ATTRS_LIST.FIELD:
        field = attr.value;
        break;
      case FILTER_ATTRS_LIST.VALUES:
        values = attr.value.split(",");
        break;
    }
  });

  if (type === null) {
    return null;
  } else {
    switch (type) {
      case FilterTypeEnum.Keys:
        if (!left || !right) {
          return null;
        } else {
          data = {
            type,
            options: {
              left,
              right,
            },
          };
          break;
        }
      case FilterTypeEnum.Expression:
        if (!clause) {
          return null;
        } else {
          data = {
            type,
            options: {
              clause,
            },
          };
          break;
        }
      case FilterTypeEnum.Named:
        if (name === null || !field || !values.length) {
          return null;
        } else {
          data = {
            type,
            options: {
              name,
              field,
              values,
            },
          };
          break;
        }
    }
  }

  return data;
}

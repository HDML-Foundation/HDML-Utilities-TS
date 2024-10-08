/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IFilter, FilterType, FilterName } from "@hdml/schemas";
import { Token } from "parse5";
import { FILTER_ATTRS_LIST } from "../enums/FILTER_ATTRS_LIST";
import { FILTER_TYPE_VALUES } from "../enums/FILTER_TYPE_VALUES";
import { FILTER_NAME_VALUES } from "../enums/FILTER_NAME_VALUES";

export function getFilterData(
  attrs: Token.Attribute[],
): null | IFilter {
  let data: null | IFilter = null;
  let type: null | FilterType = null;
  let clause: null | string = null;
  let left: null | string = null;
  let right: null | string = null;
  let name: null | FilterName = null;
  let field: null | string = null;
  let values: string[] = [];

  attrs.forEach((attr) => {
    switch (attr.name as FILTER_ATTRS_LIST) {
      case FILTER_ATTRS_LIST.TYPE:
        switch (attr.value as FILTER_TYPE_VALUES) {
          case FILTER_TYPE_VALUES.EXPR:
            type = FilterType.Expression;
            break;
          case FILTER_TYPE_VALUES.KEYS:
            type = FilterType.Keys;
            break;
          case FILTER_TYPE_VALUES.NAMED:
            type = FilterType.Named;
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
            name = FilterName.Between;
            break;
          case FILTER_NAME_VALUES.CONTAINS:
            name = FilterName.Contains;
            break;
          case FILTER_NAME_VALUES.ENDS_WITH:
            name = FilterName.EndsWith;
            break;
          case FILTER_NAME_VALUES.EQUALS:
            name = FilterName.Equals;
            break;
          case FILTER_NAME_VALUES.GREATER:
            name = FilterName.Greater;
            break;
          case FILTER_NAME_VALUES.GREATER_EQUAL:
            name = FilterName.GreaterEqual;
            break;
          case FILTER_NAME_VALUES.IS_NOT_NULL:
            name = FilterName.IsNotNull;
            break;
          case FILTER_NAME_VALUES.IS_NULL:
            name = FilterName.IsNull;
            break;
          case FILTER_NAME_VALUES.LESS:
            name = FilterName.Less;
            break;
          case FILTER_NAME_VALUES.LESS_EQUAL:
            name = FilterName.LessEqual;
            break;
          case FILTER_NAME_VALUES.NOT_CONTAINS:
            name = FilterName.NotContains;
            break;
          case FILTER_NAME_VALUES.NOT_EQUALS:
            name = FilterName.NotEquals;
            break;
          case FILTER_NAME_VALUES.STARTS_WITH:
            name = FilterName.StartsWith;
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
      case FilterType.Keys:
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
      case FilterType.Expression:
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
      case FilterType.Named:
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

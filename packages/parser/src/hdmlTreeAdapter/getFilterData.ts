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
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { Token } from "parse5";
import { backticksToQuotes } from "./backticksToQuotes";
import { DiagnosticSink, pushDiagnostic } from "../diagnostics";

/**
 * Reads an `<hdml-filter>`'s attributes into a {@link Filter}, or
 * returns `null` when the element must be dropped.
 *
 * Four rejection paths, over two codes: an absent or unrecognized
 * `type` (`missing-filter-type`) and, per type, absent operands
 * (`missing-filter-operands`). ★ The fifth exit -- the
 * `return data` at the bottom -- emits **nothing**, deliberately:
 * see the comment there.
 *
 * @param attrs The element's attributes.
 * @param sink The parse's diagnostics sink. **Optional**: the
 * module-singleton adapter and the existing unit cases call this
 * with one argument, and an absent sink discards.
 *
 * @returns The filter, or `null`.
 */
export function getFilterData(
  attrs: Token.Attribute[],
  sink?: DiagnosticSink,
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
        clause = backticksToQuotes(attr.value);
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
        field = backticksToQuotes(attr.value);
        break;
      case FILTER_ATTRS_LIST.VALUES:
        values = backticksToQuotes(attr.value).split(",");
        break;
    }
  });

  if (type === null) {
    // The diagnostic does NOT change the `return null`: 019
    // carries diagnostics, it does not change accept/reject
    // (RFC 019/002 §10.2, D11). The three legal values are named
    // because `type` is also `null` for a value the switch above
    // did not recognize.
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_TYPE,
      "`<hdml-filter>` needs a `type` of `expr`, `keys` or " +
        "`named`; this one was dropped.",
    );
    return null;
  } else {
    switch (type) {
      case FilterTypeEnum.Keys:
        if (!left || !right) {
          // The diagnostic does NOT change the `return null`
          // (RFC 019/002 §10.2, D11).
          pushDiagnostic(
            sink,
            HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_OPERANDS,
            '`<hdml-filter type="keys">` needs `left` and ' +
              "`right`; this one was dropped.",
          );
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
          // The diagnostic does NOT change the `return null`
          // (RFC 019/002 §10.2, D11).
          pushDiagnostic(
            sink,
            HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_OPERANDS,
            '`<hdml-filter type="expr">` needs a `clause`; ' +
              "this one was dropped.",
          );
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
          // The diagnostic does NOT change the `return null`
          // (RFC 019/002 §10.2, D11).
          pushDiagnostic(
            sink,
            HDQL_DIAGNOSTIC_CODES.MISSING_FILTER_OPERANDS,
            '`<hdml-filter type="named">` needs `name`, ' +
              "`field` and `values`; this one was dropped.",
          );
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

  // ★ NOTHING is emitted here, deliberately. This `return data`
  // is unreachable with `data === null`: the `type === null` guard
  // above covers every value the switch did not recognize, and
  // each of the three `case`s either returns `null` itself or
  // assigns `data` and breaks -- so by the time control reaches
  // this line `data` is always a `Filter`. A diagnostic here
  // would be dead code (RFC 019/002 §3.1, which lists this as one
  // of the two null-typed returns; the other, in `getTableData`,
  // IS reachable and does emit).
  return data;
}

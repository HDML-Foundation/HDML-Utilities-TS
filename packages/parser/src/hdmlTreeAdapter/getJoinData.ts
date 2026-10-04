/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { JoinTypeEnum, FilterOperatorEnum } from "@hdml/schemas";
import {
  Join,
  JOIN_ATTRS_LIST,
  JOIN_TYPE_VALUES,
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { Token } from "parse5";
import { DiagnosticSink, pushDiagnostic } from "../diagnostics";

/**
 * Reads an `<hdml-join>`'s attributes into a {@link Join}, or
 * returns `null` when the element must be dropped.
 *
 * @param attrs The element's attributes.
 * @param sink The parse's diagnostics sink. **Optional**: the
 * module-singleton adapter and the existing unit cases call this
 * with one argument, and an absent sink discards.
 *
 * @returns The join, or `null`.
 */
export function getJoinData(
  attrs: Token.Attribute[],
  sink?: DiagnosticSink,
): null | Join {
  let type: JoinTypeEnum = JoinTypeEnum.Cross;
  let left: null | string = null;
  let right: null | string = null;
  let description: null | string = null;
  attrs.forEach((attr) => {
    switch (attr.name as JOIN_ATTRS_LIST) {
      case JOIN_ATTRS_LIST.TYPE:
        switch (attr.value as JOIN_TYPE_VALUES) {
          case JOIN_TYPE_VALUES.CROSS:
            type = JoinTypeEnum.Cross;
            break;
          case JOIN_TYPE_VALUES.FULL:
            type = JoinTypeEnum.Full;
            break;
          case JOIN_TYPE_VALUES.FULL_OUTER:
            type = JoinTypeEnum.FullOuter;
            break;
          case JOIN_TYPE_VALUES.INNER:
            type = JoinTypeEnum.Inner;
            break;
          case JOIN_TYPE_VALUES.LEFT:
            type = JoinTypeEnum.Left;
            break;
          case JOIN_TYPE_VALUES.LEFT_OUTER:
            type = JoinTypeEnum.LeftOuter;
            break;
          case JOIN_TYPE_VALUES.RIGHT:
            type = JoinTypeEnum.Right;
            break;
          case JOIN_TYPE_VALUES.RIGHT_OUTER:
            type = JoinTypeEnum.RightOuter;
            break;
        }
        break;
      case JOIN_ATTRS_LIST.LEFT:
        left = attr.value;
        break;
      case JOIN_ATTRS_LIST.RIGHT:
        right = attr.value;
        break;
      case JOIN_ATTRS_LIST.DESCRIPTION:
        description = attr.value;
        break;
    }
  });

  if (!left || !right) {
    // The diagnostic does NOT change the `return null`: 019
    // carries diagnostics, it does not change accept/reject
    // (RFC 019/002 §10.2, D11).
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_JOIN_SIDES,
      "`<hdml-join>` needs `left` and `right`; this one was " +
        "dropped.",
    );
    return null;
  }

  return {
    description,
    type,
    left,
    right,
    clause: {
      type: FilterOperatorEnum.None,
      filters: [],
      children: [],
    },
  };
}

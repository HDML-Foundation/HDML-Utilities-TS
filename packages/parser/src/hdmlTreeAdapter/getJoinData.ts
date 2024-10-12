/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IJoin, JoinType, FilterOperator } from "@hdml/schemas";
import { Token } from "parse5";
import { JOIN_ATTRS_LIST } from "../enums/JOIN_ATTRS_LIST";
import { JOIN_TYPE_VALUES } from "../enums/JOIN_TYPE_VALUES";

export function getJoinData(attrs: Token.Attribute[]): null | IJoin {
  let type: JoinType = JoinType.Cross;
  let left: null | string = null;
  let right: null | string = null;
  attrs.forEach((attr) => {
    switch (attr.name as JOIN_ATTRS_LIST) {
      case JOIN_ATTRS_LIST.TYPE:
        switch (attr.value as JOIN_TYPE_VALUES) {
          case JOIN_TYPE_VALUES.CROSS:
            type = JoinType.Cross;
            break;
          case JOIN_TYPE_VALUES.FULL:
            type = JoinType.Full;
            break;
          case JOIN_TYPE_VALUES.FULL_OUTER:
            type = JoinType.FullOuter;
            break;
          case JOIN_TYPE_VALUES.INNER:
            type = JoinType.Inner;
            break;
          case JOIN_TYPE_VALUES.LEFT:
            type = JoinType.Left;
            break;
          case JOIN_TYPE_VALUES.LEFT_OUTER:
            type = JoinType.LeftOuter;
            break;
          case JOIN_TYPE_VALUES.RIGHT:
            type = JoinType.Right;
            break;
          case JOIN_TYPE_VALUES.RIGHT_OUTER:
            type = JoinType.RightOuter;
            break;
        }
        break;
      case JOIN_ATTRS_LIST.LEFT:
        left = attr.value;
        break;
      case JOIN_ATTRS_LIST.RIGHT:
        right = attr.value;
        break;
    }
  });

  if (!left || !right) {
    return null;
  }

  return {
    type,
    left,
    right,
    clause: {
      type: FilterOperator.None,
      filters: [],
      children: [],
    },
  };
}

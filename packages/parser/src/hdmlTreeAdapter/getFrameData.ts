/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IFrame, FilterOperator } from "@hdml/schemas";
import { Token } from "parse5";
import { FRAME_ATTRS_LIST } from "../enums/FRAME_ATTRS_LIST";

export function getFrameData(
  attrs: Token.Attribute[],
): null | IFrame {
  let frame: null | IFrame = null;
  let name: null | string = null;
  let source: null | string = null;
  let offset: null | string = null;
  let limit: null | string = null;

  attrs.forEach((attr) => {
    switch (attr.name as FRAME_ATTRS_LIST) {
      case FRAME_ATTRS_LIST.NAME:
        name = attr.value;
        break;
      case FRAME_ATTRS_LIST.SOURCE:
        source = attr.value;
        break;
      case FRAME_ATTRS_LIST.OFFSET:
        offset = attr.value;
        break;
      case FRAME_ATTRS_LIST.LIMIT:
        limit = attr.value;
        break;
    }
  });

  if (!name || !source) {
    return null;
  }

  frame = {
    name,
    source,
    offset: offset ? Number(offset) : 0,
    limit: limit ? Number(limit) : 100000,
    fields: [],
    filter_by: {
      type: FilterOperator.None,
      filters: [],
      children: [],
    },
    group_by: [],
    sort_by: [],
    split_by: [],
  };

  return frame;
}

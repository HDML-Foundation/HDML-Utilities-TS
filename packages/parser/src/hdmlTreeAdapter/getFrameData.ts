/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { FilterOperatorEnum } from "@hdml/schemas";
import { Frame, FRAME_ATTRS_LIST } from "@hdml/types";
import { Token } from "parse5";

export function getFrameData(attrs: Token.Attribute[]): null | Frame {
  let frame: null | Frame = null;
  let name: null | string = null;
  let description: null | string = null;
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
      case FRAME_ATTRS_LIST.DESCRIPTION:
        description = attr.value;
        break;
    }
  });

  if (!name || !source) {
    return null;
  }

  frame = {
    name,
    description,
    source,
    offset: offset ? Number(offset) : 0,
    limit: limit ? Number(limit) : 100000,
    fields: [],
    filter_by: {
      type: FilterOperatorEnum.None,
      filters: [],
      children: [],
    },
    group_by: [],
    sort_by: [],
    split_by: [],
  };

  return frame;
}

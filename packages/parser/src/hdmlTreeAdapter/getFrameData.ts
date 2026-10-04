/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { FilterOperatorEnum } from "@hdml/schemas";
import {
  Frame,
  FRAME_ATTRS_LIST,
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { Token } from "parse5";
import { DiagnosticSink, pushDiagnostic } from "../diagnostics";

/**
 * Reads an `<hdml-frame>`'s attributes into a {@link Frame}, or
 * returns `null` when the element must be dropped.
 *
 * @param attrs The element's attributes.
 * @param sink The parse's diagnostics sink. **Optional**: the
 * module-singleton adapter and the existing unit cases call this
 * with one argument, and an absent sink discards.
 *
 * @returns The frame, or `null`.
 */
export function getFrameData(
  attrs: Token.Attribute[],
  sink?: DiagnosticSink,
): null | Frame {
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
    // The diagnostic does NOT change the `return null`: 019
    // carries diagnostics, it does not change accept/reject
    // (RFC 019/002 §10.2, D11).
    const missing: string[] = [];
    if (!name) {
      missing.push("`name`");
    }
    if (!source) {
      missing.push("`source`");
    }
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_FRAME_NAME_OR_SOURCE,
      "`<hdml-frame>` needs `name` and `source`; missing: " +
        missing.join(", ") +
        ". This one was dropped.",
    );
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

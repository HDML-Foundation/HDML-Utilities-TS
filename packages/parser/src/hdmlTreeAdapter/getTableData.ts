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
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { Token } from "parse5";
import { backticksToQuotes } from "./backticksToQuotes";
import { DiagnosticSink, pushDiagnostic } from "../diagnostics";

/**
 * Reads an `<hdml-dataset>`'s attributes into a {@link Table}, or
 * returns `null` when the element must be dropped.
 *
 * ★ Unlike its five siblings this helper has **no `return null`**:
 * `data` starts `null`, is assigned only when all three required
 * attributes are present, and the single `return data` at the end
 * carries the rejection. The diagnostic therefore lives in an
 * `else`, and the `return data` below is UNCHANGED -- 019 carries
 * diagnostics, it does not change accept/reject (RFC 019/002
 * §10.2, D11).
 *
 * @param attrs The element's attributes.
 * @param sink The parse's diagnostics sink. **Optional**: the
 * module-singleton adapter and the existing unit cases call this
 * with one argument, and an absent sink discards.
 *
 * @returns The dataset, or `null`.
 */
export function getTableData(
  attrs: Token.Attribute[],
  sink?: DiagnosticSink,
): null | Table {
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
  } else {
    // ★ "missing or not recognized" rather than "missing",
    // measured: `type` is also `null` when the author DID write
    // one and it was neither `table` nor `query` -- the switch
    // above only assigns on a recognized value. `name` and
    // `identifier` can only be absent, so the disjunction is true
    // in every case and a single code covers all three.
    const missing: string[] = [];
    if (!name) {
      missing.push("`name`");
    }
    if (type === null) {
      missing.push("`type`");
    }
    if (!identifier) {
      missing.push("`identifier`");
    }
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_DATASET_ATTRS,
      "`<hdml-dataset>` needs `name`, `type` (`table` or " +
        "`query`) and `identifier`; missing or not recognized: " +
        missing.join(", ") +
        ". This one was dropped.",
    );
  }
  return data;
}

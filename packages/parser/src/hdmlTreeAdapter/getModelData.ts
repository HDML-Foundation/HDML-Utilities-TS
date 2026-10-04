/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Model,
  MODEL_ATTRS_LIST,
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { Token } from "parse5";
import { DiagnosticSink, pushDiagnostic } from "../diagnostics";

/**
 * Reads an `<hdml-model>`'s attributes into a {@link Model}, or
 * returns `null` when the element must be dropped.
 *
 * @param attrs The element's attributes.
 * @param sink The parse's diagnostics sink. **Optional**: the
 * module-singleton adapter and the existing unit cases call this
 * with one argument, and an absent sink discards.
 *
 * @returns The model, or `null`.
 */
export function getModelData(
  attrs: Token.Attribute[],
  sink?: DiagnosticSink,
): null | Model {
  let name: null | string = null;
  let description: null | string = null;
  attrs.forEach((attr) => {
    switch (attr.name as MODEL_ATTRS_LIST) {
      case MODEL_ATTRS_LIST.NAME:
        name = attr.value;
        break;
      case MODEL_ATTRS_LIST.DESCRIPTION:
        description = attr.value;
        break;
    }
  });

  if (!name) {
    // The diagnostic does NOT change the `return null`: 019
    // carries diagnostics, it does not change accept/reject
    // (RFC 019/002 §10.2, D11).
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME,
      "`<hdml-model>` needs a `name`; this one was dropped.",
    );
    return null;
  }

  return {
    name,
    description,
    tables: [],
    joins: [],
  };
}

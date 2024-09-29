/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IHDDM } from "@hdml/schemas";
import { parse } from "parse5";
import { hdmlTreeAdapter } from "./hdmlTreeAdapter";

export function objectify(content: string): IHDDM {
  return parse(content, {
    // onParseError?: null | ParserErrorHandler;
    scriptingEnabled: false,
    sourceCodeLocationInfo: false,
    treeAdapter: hdmlTreeAdapter,
  }) as unknown as IHDDM;
}

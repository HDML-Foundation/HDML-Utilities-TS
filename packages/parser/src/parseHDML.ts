/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDOM } from "@hdml/types";
import { parseFragment } from "parse5";
import { hdmlTreeAdapter } from "./hdmlTreeAdapter/hdmlTreeAdapter";
import { HDMLTreeAdapterMap } from "./types/HDMLTreeAdapterMap";

/**
 * Parses an HDML (HyperData Markup Language) string and converts
 * it into an `HDOM` (HyperData Object Model) structure, which
 * represents the parsed document in a hierarchical and structured
 * format.
 *
 * This function serves as the core utility for processing HDML
 * content, enabling further manipulation and traversal of the
 * document's structure.
 *
 * @param content The HDML content represented as a string.
 *
 * @returns The parsed `HDOM` object, representing the HDML
 * document structure.
 *
 * ## Example:
 * ```ts
 * const hdml = "<hdml-model>...</hdml-model>";
 * const hdom = parseHDML(hdml);
 * console.log(hdom);
 * ```
 */
export function parseHDML(content: string): HDOM {
  const fragment = parseFragment<HDMLTreeAdapterMap>(content, {
    onParseError: console.error,
    scriptingEnabled: false,
    treeAdapter: hdmlTreeAdapter,
  });
  const node = hdmlTreeAdapter.getFirstChild(fragment);
  const hddm = node?.rootNode?.hddm || {
    includes: [],
    connections: [],
    models: [],
    frames: [],
  };
  return hddm;
}

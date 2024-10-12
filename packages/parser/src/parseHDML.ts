/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IHDDM as HDDM } from "@hdml/schemas";
import { parseFragment } from "parse5";
import { hdmlTreeAdapter } from "./hdmlTreeAdapter/hdmlTreeAdapter";
import { HDMLTreeAdapterMap } from "./types/HDMLTreeAdapterMap";

export function parseHDML(content: string): HDDM {
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

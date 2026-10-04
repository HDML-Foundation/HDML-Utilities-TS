/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDOM } from "@hdml/types";
import { parseFragment } from "parse5";
// eslint-disable-next-line max-len
import { createHdmlTreeAdapter } from "./hdmlTreeAdapter/hdmlTreeAdapter";
import {
  DiagnosticSink,
  HdqlDiagnostic,
  drainDiagnostics,
} from "./diagnostics";
import { sortFrames } from "./sortFrames";
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
 * @param diagnostics An array this call appends one
 * {@link HdqlDiagnostic} to per element the parser dropped. Pass
 * one to receive them; omit it and they are discarded. It is an
 * out-parameter rather than part of the return value because
 * `HDOM` is serialized and hashed, so a fourth field on it would
 * move every `@hdml/hash` and `@hdml/buffer` digest.
 *
 * @returns The parsed `HDOM` object, representing the HDML
 * document structure. ★ Unchanged by this parameter: a dropped
 * element does not fail the compile (RFC 019/002 §10.2, D11).
 *
 * ## Example:
 * ```ts
 * const hdml = "<hdml-model>...</hdml-model>";
 * const hdom = parseHDML(hdml);
 * console.log(hdom);
 * ```
 */
export function parseHDML(
  content: string,
  diagnostics?: HdqlDiagnostic[],
): HDOM {
  // One sink per call, handed to one adapter per call. See
  // `createHdmlTreeAdapter` for why it may not be module-level.
  const sink: DiagnosticSink = [];
  const adapter = createHdmlTreeAdapter(sink);
  const fragment = parseFragment<HDMLTreeAdapterMap>(content, {
    onParseError: console.error,
    scriptingEnabled: false,
    treeAdapter: adapter,
  });
  // Drained here, not where each entry was pushed: `loc` and
  // `path` are only final once the parse has finished.
  if (diagnostics) {
    diagnostics.push(...drainDiagnostics(sink));
  }
  const node = adapter.getFirstChild(fragment);
  const hddm = node?.rootNode?.hddm || {
    connections: [],
    models: [],
    frames: [],
  };
  return {
    ...hddm,
    frames: sortFrames(hddm.frames),
  };
}

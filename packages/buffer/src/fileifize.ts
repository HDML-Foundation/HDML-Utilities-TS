/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { HDOM } from "@hdml/types";
// eslint-disable-next-line max-len
import { bufferifyDocumentFiles } from "./bufferify/bufferifyDocumentFiles";

/**
 * Converts an `HDOM` object into a `Uint8Array` representing a
 * `DocumentFilesStruct`.
 *
 * This function takes an `HDOM` object and converts it into a
 * FlatBuffers binary format where each connection, model, and frame
 * is serialized individually as a `FileStruct` within a
 * `DocumentFilesStruct`. This format is suitable for file-based
 * storage or transmission of HDML document components.
 *
 * @param hdom The `HDOM` object to be converted. This object
 * represents the hierarchical structure of an HDML document.
 *
 * @returns A `Uint8Array` containing the binary FlatBuffers data
 * representing the `DocumentFilesStruct` structure.
 *
 * @example
 * ```ts
 * const hdom: HDOM = {
 *   includes: [],
 *   connections: [{ name: "conn1", ... }],
 *   models: [{ name: "model1", ... }],
 *   frames: [{ name: "frame1", ... }]
 * };
 * const uint8 = fileifize(hdom);
 * // Now you can transmit or store the binary DocumentFilesStruct
 * ```
 */
export function fileifize(hdom: HDOM): Uint8Array {
  const builder = new flatbuffers.Builder(1024);
  const offset = bufferifyDocumentFiles(builder, hdom);
  builder.finish(offset);
  return builder.asUint8Array();
}

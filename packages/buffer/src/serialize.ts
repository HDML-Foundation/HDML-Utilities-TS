/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { HDOM } from "@hdml/types";
import { bufferifyHDOM } from "./bufferifyHDOM";

/**
 * Serializes an `HDOM` object into a FlatBuffers binary format.
 *
 * This function takes an `HDOM` object and converts it into a
 * FlatBuffers binary representation for efficient storage or
 * transmission. It uses the `bufferifyHDOM` function to construct
 * the FlatBuffers structure, and then finalizes the buffer for
 * output.
 *
 * @param hdom The `HDOM` object to be serialized. This object
 * represents the hierarchical structure of an HDML document.
 *
 * @returns A `Uint8Array` containing the binary FlatBuffers data
 * for the given `HDOM` object.
 *
 * @example
 * ```ts
 * const hdom: HDOM = { ... };  // Your HDOM object
 * const uint8 = serialize(hdom);
 * // Now you can transmit or store `uint8`
 * ```
 */
export function serialize(hdom: HDOM): Uint8Array {
  const builder = new flatbuffers.Builder(1024);
  const offset = bufferifyHDOM(builder, hdom);
  builder.finish(offset);
  return builder.asUint8Array();
}

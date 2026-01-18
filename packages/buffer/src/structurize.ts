/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { HDOMStruct } from "@hdml/schemas";

/**
 * Structurizes a FlatBuffers binary into an `HDOMStruct` object.
 *
 * This function takes a `Uint8Array` of FlatBuffers binary data and
 * converts it into an `HDOMStruct` object structure.
 *
 * @param bytes A `Uint8Array` containing the FlatBuffers binary
 * data to be structurized. This should be a binary representation of
 * an `HDOMStruct`.
 *
 * @returns The structurized `HDOMStruct` object, which represents
 * the hierarchical structure of the HDML document.
 *
 * @example
 * ```ts
 * const uint8: Uint8Array = ...;  // Your binary FlatBuffers data
 * const hdomStruct = structurize(uint8);
 * // Now you can work with the `HDOMStruct` object
 * ```
 */
export function structurize(bytes: Uint8Array): HDOMStruct {
  const byteBuffer = new flatbuffers.ByteBuffer(bytes);
  return HDOMStruct.getRootAsHDOMStruct(byteBuffer);
}

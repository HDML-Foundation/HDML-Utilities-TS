/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { HDOMStruct } from "@hdml/schemas";

/**
 * Deserializes a FlatBuffers binary into an `HDOMStruct` object.
 *
 * This function takes a `Uint8Array` of FlatBuffers binary data and
 * converts it back into an `HDOMStruct` object.
 *
 * @param bytes A `Uint8Array` containing the FlatBuffers binary
 * data to be deserialized. This should be a binary representation of
 * an `HDOMStruct`.
 *
 * @returns The deserialized `HDOMStruct` object, which represents
 * the hierarchical structure of the HDML document.
 *
 * @example
 * ```ts
 * const uint8: Uint8Array = ...;  // Your binary FlatBuffers data
 * const hdomStruct = structurize(uint8);
 * // Now you can work with the `HDOMStruct` object
 * ```
 */
export function deserialize(bytes: Uint8Array): HDOMStruct {
  const byteBuffer = new flatbuffers.ByteBuffer(bytes);
  return HDOMStruct.getRootAsHDOMStruct(byteBuffer);
}

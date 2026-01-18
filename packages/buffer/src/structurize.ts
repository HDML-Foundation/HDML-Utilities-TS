/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import {
  HDOMStruct,
  ConnectionStruct,
  ModelStruct,
  FrameStruct,
} from "@hdml/schemas";
import { StructType } from "./StructType";

/**
 * Structurizes a FlatBuffers binary into a FlatBuffers struct object.
 *
 * This function takes a `Uint8Array` of FlatBuffers binary data and
 * converts it into the appropriate FlatBuffers struct object based on
 * the specified type parameter.
 *
 * @param bytes A `Uint8Array` containing the FlatBuffers binary
 * data to be structurized.
 *
 * @param type Optional enum value specifying which struct type to
 * structurize. Defaults to `StructType.HDOMStruct`.
 *
 * @returns The structurized FlatBuffers struct object. The type
 * depends on the `type` parameter:
 * - `HDOMStruct` for `StructType.HDOMStruct`
 * - `ConnectionStruct` for `StructType.ConnectionStruct`
 * - `ModelStruct` for `StructType.ModelStruct`
 * - `FrameStruct` for `StructType.FrameStruct`
 *
 * @example
 * ```ts
 * const uint8: Uint8Array = ...;  // Your binary FlatBuffers data
 * const hdomStruct = structurize(uint8);
 * // Or specify a different type:
 * const connStruct = structurize(
 *   connBytes,
 *   StructType.ConnectionStruct,
 * );
 * ```
 */
export function structurize(
  bytes: Uint8Array,
  type: StructType = StructType.HDOMStruct,
): HDOMStruct | ConnectionStruct | ModelStruct | FrameStruct {
  const byteBuffer = new flatbuffers.ByteBuffer(bytes);

  switch (type) {
    case StructType.HDOMStruct:
      return HDOMStruct.getRootAsHDOMStruct(byteBuffer);
    case StructType.ConnectionStruct:
      return ConnectionStruct.getRootAsConnectionStruct(byteBuffer);
    case StructType.ModelStruct:
      return ModelStruct.getRootAsModelStruct(byteBuffer);
    case StructType.FrameStruct:
      return FrameStruct.getRootAsFrameStruct(byteBuffer);
    default: {
      const _exhaustive: never = type;
      throw new Error(
        `Unsupported struct type: ${String(_exhaustive)}`,
      );
    }
  }
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { HDOM, Connection, Model, Frame } from "@hdml/types";
import { bufferifyHDOM } from "./bufferify/bufferifyHDOM";
import { bufferifyConnection } from "./bufferify/bufferifyConnection";
import { bufferifyModel } from "./bufferify/bufferifyModel";
import { bufferifyFrame } from "./bufferify/bufferifyFrame";
import { StructType } from "./StructType";

/**
 * Serializes an `HDOM`, `Connection`, `Model`, or `Frame` object
 * into a FlatBuffers binary format.
 *
 * This function takes an `HDOM`, `Connection`, `Model`, or `Frame`
 * object and converts it into a FlatBuffers binary representation for
 * efficient storage or transmission. It uses the `bufferifyHDOM`,
 * `bufferifyConnection`, `bufferifyModel`, or `bufferifyFrame`
 * function to construct the FlatBuffers structure, and then finalizes
 * the buffer for output.
 *
 * @param hdom The `HDOM`, `Connection`, `Model`, or `Frame` object
 * to be serialized. This object represents the hierarchical structure
 * of an HDML document, connection, model, or frame.
 *
 * @returns A `Uint8Array` containing the binary FlatBuffers data
 * for the given `HDOM`, `Connection`, `Model`, or `Frame` object.
 *
 * @example
 * ```ts
 * // This can be an HDOM, Connection, Model, or Frame object
 * const object: HDOM | Connection | Model | Frame = { ... };
 * const uint8 = serialize(object, StructType.HDOMStruct);
 * const uint8 = serialize(object, StructType.ConnectionStruct);
 * const uint8 = serialize(object, StructType.ModelStruct);
 * const uint8 = serialize(object, StructType.FrameStruct);
 * // Now you can transmit or store the binary FlatBuffers data
 * ```
 */
export function serialize(
  hdom: HDOM | Connection | Model | Frame,
  type: StructType = StructType.HDOMStruct,
): Uint8Array {
  const builder = new flatbuffers.Builder(1024);
  let offset: number;
  switch (type) {
    case StructType.HDOMStruct:
      offset = bufferifyHDOM(builder, hdom as HDOM);
      break;
    case StructType.ConnectionStruct:
      offset = bufferifyConnection(builder, hdom as Connection);
      break;
    case StructType.ModelStruct:
      offset = bufferifyModel(builder, hdom as Model);
      break;
    case StructType.FrameStruct:
      offset = bufferifyFrame(builder, hdom as Frame);
      break;
    default: {
      const _exhaustive: never = type;
      throw new Error(
        `Unsupported struct type: ${String(_exhaustive)}`,
      );
    }
  }
  builder.finish(offset);
  return builder.asUint8Array();
}

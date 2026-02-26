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
// eslint-disable-next-line max-len
import { bufferifyFileStatuses } from "./bufferify/bufferifyFileStatuses";
import { StructType } from "./StructType";
import type { FileStatuses } from "./FileStatuses";

/**
 * Serializes an `HDOM`, `Connection`, `Model`, `Frame`, or
 * `FileStatuses` into a FlatBuffers binary format.
 *
 * This function takes an `HDOM`, `Connection`, `Model`, `Frame`,
 * or `FileStatuses` and converts it into a FlatBuffers binary
 * representation for efficient storage or transmission.
 *
 * @param data The `HDOM`, `Connection`, `Model`, `Frame`, or
 * `FileStatuses` to be serialized.
 *
 * @returns A `Uint8Array` containing the binary FlatBuffers data
 * for the given object.
 *
 * @example
 * ```ts
 * const uint8 = serialize(hdom, StructType.HDOMStruct);
 * const uint8 = serialize(conn, StructType.ConnectionStruct);
 * const uint8 = serialize(model, StructType.ModelStruct);
 * const uint8 = serialize(frame, StructType.FrameStruct);
 * const uint8 = serialize(
 *   { names, statuses, messages },
 *   StructType.FileStatusesStruct,
 * );
 * ```
 */
export function serialize(
  data: HDOM | Connection | Model | Frame | FileStatuses,
  type: StructType = StructType.HDOMStruct,
): Uint8Array {
  const builder = new flatbuffers.Builder(1024);
  let offset: number;
  switch (type) {
    case StructType.HDOMStruct:
      offset = bufferifyHDOM(builder, data as HDOM);
      break;
    case StructType.ConnectionStruct:
      offset = bufferifyConnection(builder, data as Connection);
      break;
    case StructType.ModelStruct:
      offset = bufferifyModel(builder, data as Model);
      break;
    case StructType.FrameStruct:
      offset = bufferifyFrame(builder, data as Frame);
      break;
    case StructType.FileStatusesStruct: {
      const fileStatuses = data as FileStatuses;
      offset = bufferifyFileStatuses(
        builder,
        fileStatuses.names,
        fileStatuses.statuses,
        fileStatuses.messages,
      );
      break;
    }
    default: {
      throw new Error("Unsupported struct type");
    }
  }
  builder.finish(offset);
  return builder.asUint8Array();
}

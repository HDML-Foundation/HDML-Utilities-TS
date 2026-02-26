/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDOM, Connection, Model, Frame } from "@hdml/types";
import {
  HDOMStruct,
  ConnectionStruct,
  ModelStruct,
  FrameStruct,
  DocumentFileStatusesStruct,
} from "@hdml/schemas";
import { structurize } from "./structurize";
import { StructType } from "./StructType";
import { objectifyHDOM } from "./objectify/objectifyHDOM";
import { objectifyConnection } from "./objectify/objectifyConnection";
import { objectifyModel } from "./objectify/objectifyModel";
import { objectifyFrame } from "./objectify/objectifyFrame";
// eslint-disable-next-line max-len
import { objectifyFileStatuses } from "./objectify/objectifyFileStatuses";
import type { FileStatuses } from "./FileStatuses";

/**
 * Deserializes a FlatBuffers binary format into an `HDOM`,
 * `Connection`, `Model`, `Frame`, or `FileStatuses` object.
 *
 * This function takes a `Uint8Array` of FlatBuffers binary data and
 * converts it back into an `HDOM`, `Connection`, `Model`, `Frame`,
 * or `FileStatuses` object. It uses `structurize` to convert the
 * binary into a FlatBuffers struct, then the appropriate objectify
 * function to produce the TypeScript object.
 *
 * @param bytes A `Uint8Array` containing the binary FlatBuffers data
 * to be deserialized.
 *
 * @returns The deserialized `HDOM`, `Connection`, `Model`, `Frame`,
 * or `FileStatuses` object.
 *
 * @example
 * ```ts
 * const hdom = deserialize(uint8, StructType.HDOMStruct);
 * const connection = deserialize(uint8, StructType.ConnectionStruct);
 * const model = deserialize(uint8, StructType.ModelStruct);
 * const frame = deserialize(uint8, StructType.FrameStruct);
 * const fs = deserialize(uint8, StructType.FileStatusesStruct);
 * ```
 */
export function deserialize(
  bytes: Uint8Array,
  type: StructType = StructType.HDOMStruct,
): HDOM | Connection | Model | Frame | FileStatuses {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const struct = structurize(bytes, type);
  switch (type) {
    case StructType.HDOMStruct:
      return objectifyHDOM(struct as HDOMStruct);
    case StructType.ConnectionStruct:
      return objectifyConnection(struct as ConnectionStruct);
    case StructType.ModelStruct:
      return objectifyModel(struct as ModelStruct);
    case StructType.FrameStruct:
      return objectifyFrame(struct as FrameStruct);
    case StructType.FileStatusesStruct:
      return objectifyFileStatuses(
        struct as DocumentFileStatusesStruct,
      );
    default: {
      throw new Error("Unsupported struct type");
    }
  }
}

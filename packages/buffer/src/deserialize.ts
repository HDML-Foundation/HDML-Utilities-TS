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
} from "@hdml/schemas";
import { structurize } from "./structurize";
import { StructType } from "./StructType";
import { objectifyHDOM } from "./objectify/objectifyHDOM";
import { objectifyConnection } from "./objectify/objectifyConnection";
import { objectifyModel } from "./objectify/objectifyModel";
import { objectifyFrame } from "./objectify/objectifyFrame";

/**
 * Deserializes a FlatBuffers binary format into an `HDOM`,
 * `Connection`, `Model`, or `Frame` object.
 *
 * This function takes a `Uint8Array` of FlatBuffers binary data and
 * converts it back into an `HDOM`, `Connection`, `Model`, or `Frame`
 * object. It uses the `structurize` function to convert the binary
 * data into a FlatBuffers struct, and then uses `objectifyHDOM`,
 * `objectifyConnection`, `objectifyModel`, or `objectifyFrame` to
 * convert the struct into a TypeScript `HDOM`, `Connection`, `Model`,
 * or `Frame` object.
 *
 * @param bytes A `Uint8Array` containing the binary FlatBuffers data
 * to be deserialized. This should be a binary representation of an
 * `HDOMStruct`, `ConnectionStruct`, `ModelStruct`, or `FrameStruct`
 * that was previously serialized using the `serialize` function.
 * function.
 *
 * @returns The deserialized `HDOM`, `Connection`, `Model`, or `Frame`
 * object, which represents the hierarchical structure of an HDML
 * document, connection, model, or frame.
 *
 * @example
 * ```ts
 * const uint8: Uint8Array = ...;  // Your binary FlatBuffers data
 * const hdom = deserialize(uint8, StructType.HDOMStruct);
 * const connection = deserialize(uint8, StructType.ConnectionStruct);
 * const model = deserialize(uint8, StructType.ModelStruct);
 * const frame = deserialize(uint8, StructType.FrameStruct);
 * // Now you can work with the `HDOM`, `Connection`, `Model`,
 * // or `Frame` object
 * ```
 */
export function deserialize(
  bytes: Uint8Array,
  type: StructType = StructType.HDOMStruct,
): HDOM | Connection | Model | Frame {
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
    default: {
      const _exhaustive: never = type;
      throw new Error(
        `Unsupported struct type: ${String(_exhaustive)}`,
      );
    }
  }
}

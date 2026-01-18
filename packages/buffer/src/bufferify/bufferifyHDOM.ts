/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { HDOMStruct, IncludeStruct } from "@hdml/schemas";
import { HDOM } from "@hdml/types";
import { bufferifyConnection } from "./bufferifyConnection";
import { bufferifyModel } from "./bufferifyModel";
import { bufferifyFrame } from "./bufferifyFrame";

/**
 * Serializes an `HDOM` object to FlatBuffers `HDOMStruct` format.
 *
 * This function converts an HDOM interface object, representing
 * an HDML document, into a FlatBuffers serialized binary format
 * using the generated FlatBuffers schema for `HDOMStruct`. The
 * resulting FlatBuffer can be used for efficient transmission or
 * storage of hierarchical HDML document data.
 *
 * ## Parameters:
 *
 * - `builder` (flatbuffers.Builder): The FlatBuffers builder instance
 *   used to construct the serialized document.
 *
 * - `hddm` (HDOM): The `HDOM` object to be serialized. This
 *   includes references to `IncludeStruct`, `Connection`, `Model`,
 *   and `Frame` elements, each of which will be serialized into the
 *   FlatBuffer.
 *
 * ## Returns:
 *
 * - `(number)`: The offset to the serialized `HDOMStruct` object
 *   within the FlatBuffer.
 *
 * ## Example:
 *
 * ```ts
 * const builder = new flatbuffers.Builder(1024);
 * const hdom: HDOM = {
 *   includes: [],
 *   connections: [],
 *   models: [],
 *   frames: []
 * };
 * const buffer = bufferifyHDOM(builder, hddm);
 * ```
 *
 * In this example, a new `HDOM` object is serialized into a
 * FlatBuffer using the `bufferifyHDOM` function.
 */
export function bufferifyHDOM(
  builder: flatbuffers.Builder,
  hdom: HDOM,
): number {
  const includesVector = HDOMStruct.createIncludesVector(
    builder,
    hdom.includes.map((include) => {
      const path = builder.createString(include.path);
      return IncludeStruct.createIncludeStruct(builder, path);
    }),
  );

  const connectionsVector = HDOMStruct.createConnectionsVector(
    builder,
    hdom.connections.map((conn) =>
      bufferifyConnection(builder, conn),
    ),
  );

  const modelsVector = HDOMStruct.createModelsVector(
    builder,
    hdom.models.map((model) => bufferifyModel(builder, model)),
  );

  const framesVector = HDOMStruct.createFramesVector(
    builder,
    hdom.frames.map((frame) => bufferifyFrame(builder, frame)),
  );

  HDOMStruct.startHDOMStruct(builder);
  HDOMStruct.addIncludes(builder, includesVector);
  HDOMStruct.addConnections(builder, connectionsVector);
  HDOMStruct.addModels(builder, modelsVector);
  HDOMStruct.addFrames(builder, framesVector);

  return HDOMStruct.endHDOMStruct(builder);
}

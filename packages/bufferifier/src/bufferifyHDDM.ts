/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { IHDDM, HDDM, Include } from "@hdml/schemas";
import { bufferifyConnection } from "./bufferifyConnection";
import { bufferifyModel } from "./bufferifyModel";
import { bufferifyFrame } from "./bufferifyFrame";

/**
 * Serializes an `IHDDM` object to FlatBuffers `HDDM` format.
 *
 * This function converts an IHDDM interface object, representing
 * an HDML document, into a FlatBuffers serialized binary format
 * using the generated FlatBuffers schema for `HDDM`. The resulting
 * FlatBuffer can be used for efficient transmission or storage
 * of hierarchical HDML document data.
 *
 * ## Parameters:
 *
 * - `builder` (flatbuffers.Builder): The FlatBuffers builder instance
 *   used to construct the serialized document.
 *
 * - `hddm` (IHDDM): The `IHDDM` object to be serialized. This
 *   includes references to `Include`, `Connection`, `Model`, and
 *   `Frame` elements, each of which will be serialized into the
 *   FlatBuffer.
 *
 * ## Returns:
 *
 * - `(number)`: The offset to the serialized `HDDM` object within
 *   the FlatBuffer.
 *
 * ## Example:
 *
 * ```ts
 * const builder = new flatbuffers.Builder(1024);
 * const hddm: IHDDM = {
 *   includes: [],
 *   connections: [],
 *   models: [],
 *   frames: []
 * };
 * const buffer = bufferifyHDDM(builder, hddm);
 * ```
 *
 * In this example, a new `IHDDM` object is serialized into a
 * FlatBuffer using the `bufferifyHDDM` function.
 */
export function bufferifyHDDM(
  builder: flatbuffers.Builder,
  hddm: IHDDM,
): number {
  const includesVector = HDDM.createIncludesVector(
    builder,
    hddm.includes.map((include) => {
      const path = builder.createString(include.path);
      return Include.createInclude(builder, path);
    }),
  );

  const connectionsVector = HDDM.createConnectionsVector(
    builder,
    hddm.connections.map((conn) =>
      bufferifyConnection(builder, conn),
    ),
  );

  const modelsVector = HDDM.createModelsVector(
    builder,
    hddm.models.map((model) => bufferifyModel(builder, model)),
  );

  const framesVector = HDDM.createFramesVector(
    builder,
    hddm.frames.map((frame) => bufferifyFrame(builder, frame)),
  );

  HDDM.startHDDM(builder);
  HDDM.addIncludes(builder, includesVector);
  HDDM.addConnections(builder, connectionsVector);
  HDDM.addModels(builder, modelsVector);
  HDDM.addFrames(builder, framesVector);

  return HDDM.endHDDM(builder);
}

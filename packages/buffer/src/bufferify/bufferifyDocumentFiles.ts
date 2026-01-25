/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { DocumentFilesStruct } from "@hdml/schemas";
import { HDOM } from "@hdml/types";
import { bufferifyFile } from "./bufferifyFile";
import { bufferifyConnection } from "./bufferifyConnection";
import { bufferifyModel } from "./bufferifyModel";
import { bufferifyFrame } from "./bufferifyFrame";

/**
 * Serializes an `HDOM` object into a FlatBuffers
 * `DocumentFilesStruct` structure.
 *
 * This function takes an `HDOM` object and converts its connections,
 * models, and frames into a `DocumentFilesStruct` where each object
 * is serialized individually into a `FileStruct` with the object's
 * name as the file name and the serialized object as the file
 * content.
 *
 * @param builder The FlatBuffers `Builder` instance used to serialize
 * data.
 *
 * @param hdom The `HDOM` object containing connections, models, and
 * frames to be serialized. This object represents the hierarchical
 * structure of an HDML document.
 *
 * @returns The offset of the serialized `DocumentFilesStruct`
 * structure in the FlatBuffers builder.
 *
 * @example
 * ```typescript
 * const builder = new flatbuffers.Builder(1024);
 * const hdom: HDOM = {
 *   includes: [],
 *   connections: [{ name: "conn1", ... }],
 *   models: [{ name: "model1", ... }],
 *   frames: [{ name: "frame1", ... }]
 * };
 * const offset = bufferifyDocumentFiles(builder, hdom);
 * builder.finish(offset);
 * const bytes = builder.asUint8Array();
 * ```
 */
export function bufferifyDocumentFiles(
  builder: flatbuffers.Builder,
  hdom: HDOM,
): number {
  // Serialize connections
  const connectionFileOffsets = hdom.connections.map((connection) => {
    const internalBuilder = new flatbuffers.Builder(1024);
    const connectionOffset = bufferifyConnection(
      internalBuilder,
      connection,
    );
    internalBuilder.finish(connectionOffset);
    const connectionBytes = internalBuilder.asUint8Array();
    return bufferifyFile(builder, connection.name, connectionBytes);
  });

  // Serialize models
  const modelFileOffsets = hdom.models.map((model) => {
    const internalBuilder = new flatbuffers.Builder(1024);
    const modelOffset = bufferifyModel(internalBuilder, model);
    internalBuilder.finish(modelOffset);
    const modelBytes = internalBuilder.asUint8Array();
    return bufferifyFile(builder, model.name, modelBytes);
  });

  // Serialize frames
  const frameFileOffsets = hdom.frames.map((frame) => {
    const internalBuilder = new flatbuffers.Builder(1024);
    const frameOffset = bufferifyFrame(internalBuilder, frame);
    internalBuilder.finish(frameOffset);
    const frameBytes = internalBuilder.asUint8Array();
    return bufferifyFile(builder, frame.name, frameBytes);
  });

  // Create vectors
  const connectionsVector =
    DocumentFilesStruct.createConnectionsVector(
      builder,
      connectionFileOffsets,
    );
  const modelsVector = DocumentFilesStruct.createModelsVector(
    builder,
    modelFileOffsets,
  );
  const framesVector = DocumentFilesStruct.createFramesVector(
    builder,
    frameFileOffsets,
  );

  // Build DocumentFilesStruct
  DocumentFilesStruct.startDocumentFilesStruct(builder);
  DocumentFilesStruct.addConnections(builder, connectionsVector);
  DocumentFilesStruct.addModels(builder, modelsVector);
  DocumentFilesStruct.addFrames(builder, framesVector);

  return DocumentFilesStruct.endDocumentFilesStruct(builder);
}

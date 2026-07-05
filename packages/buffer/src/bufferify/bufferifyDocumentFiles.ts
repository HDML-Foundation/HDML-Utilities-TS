/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { DocumentFilesStruct } from "@hdml/schemas";
import { bufferifyFile } from "./bufferifyFile";
import type { DocumentFileBlobs } from "../fileifize";

/**
 * Packs pre-serialized `{ name, content }` file blobs into a
 * FlatBuffers `DocumentFilesStruct`.
 *
 * Each blob becomes one `FileStruct` (name + content byte-vector) via
 * `bufferifyFile`; the three groups are laid into the connection,
 * model, and frame vectors. This packer does **not** serialize the
 * elements — the caller already serialized each exactly once, so the
 * `name` and `content` are written verbatim.
 *
 * @param builder The FlatBuffers `Builder` instance used to serialize
 * data.
 *
 * @param blobs The pre-serialized connection/model/frame file blobs.
 *
 * @returns The offset of the serialized `DocumentFilesStruct`
 * structure in the FlatBuffers builder.
 *
 * @example
 * ```typescript
 * const builder = new flatbuffers.Builder(1024);
 * const offset = bufferifyDocumentFiles(builder, {
 *   connections: [{ name: "t_pg.hdml", content: cBytes }],
 *   models: [],
 *   frames: [],
 * });
 * builder.finish(offset);
 * const bytes = builder.asUint8Array();
 * ```
 */
export function bufferifyDocumentFiles(
  builder: flatbuffers.Builder,
  blobs: DocumentFileBlobs,
): number {
  const connectionFileOffsets = blobs.connections.map((blob) =>
    bufferifyFile(builder, blob.name, blob.content),
  );
  const modelFileOffsets = blobs.models.map((blob) =>
    bufferifyFile(builder, blob.name, blob.content),
  );
  const frameFileOffsets = blobs.frames.map((blob) =>
    bufferifyFile(builder, blob.name, blob.content),
  );

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

  DocumentFilesStruct.startDocumentFilesStruct(builder);
  DocumentFilesStruct.addConnections(builder, connectionsVector);
  DocumentFilesStruct.addModels(builder, modelsVector);
  DocumentFilesStruct.addFrames(builder, framesVector);

  return DocumentFilesStruct.endDocumentFilesStruct(builder);
}

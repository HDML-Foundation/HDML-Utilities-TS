/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
// eslint-disable-next-line max-len
import { bufferifyDocumentFiles } from "./bufferify/bufferifyDocumentFiles";

/**
 * A single pre-serialized document file: its canonical name plus the
 * already-serialized `*Struct` bytes.
 */
export interface FileBlob {
  /**
   * The full canonical key — `hdml-{type}={name}@{hash}.hdml` for a
   * frame/model, or `{tenant}_{conn}.hdml` for a connection. Written
   * verbatim into `FileStruct.name`.
   */
  name: string;

  /**
   * The pre-serialized `ConnectionStruct` / `ModelStruct` /
   * `FrameStruct` bytes. Copied verbatim into `FileStruct.content`.
   */
  content: Uint8Array;
}

/**
 * The three per-vector groups of pre-serialized file blobs that make
 * up a `DocumentFilesStruct`.
 */
export interface DocumentFileBlobs {
  connections: FileBlob[];
  models: FileBlob[];
  frames: FileBlob[];
}

/**
 * Assembles a `DocumentFilesStruct` `Uint8Array` from pre-serialized
 * `{ name, content }` blobs.
 *
 * Repurposed packer: the former `HDOM`-taking, element-serializing
 * form is gone. This function does **not** serialize the elements —
 * the caller (the composition root) already did, exactly once — and
 * writes each caller-supplied `name` verbatim into `FileStruct.name`
 * and each `content` verbatim into `FileStruct.content`.
 *
 * @param blobs The pre-serialized connection/model/frame file blobs.
 *
 * @returns A `Uint8Array` containing the binary FlatBuffers data
 * representing the `DocumentFilesStruct` structure.
 *
 * @example
 * ```ts
 * const data = fileifize({
 *   connections: [{ name: "t_pg.hdml", content: cBytes }],
 *   models: [{ name: "hdml-model=m@abc123de.hdml", content: m }],
 *   frames: [{ name: "hdml-frame=f@0a1b2c3d.hdml", content: f }],
 * });
 * ```
 */
export function fileifize(blobs: DocumentFileBlobs): Uint8Array {
  const builder = new flatbuffers.Builder(1024);
  const offset = bufferifyDocumentFiles(builder, blobs);
  builder.finish(offset);
  return builder.asUint8Array();
}

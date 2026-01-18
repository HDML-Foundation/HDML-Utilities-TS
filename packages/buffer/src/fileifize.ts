/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { Connection, Model, Frame } from "@hdml/types";
import { deserialize } from "./deserialize";
import { bufferifyConnection } from "./bufferify/bufferifyConnection";
import { bufferifyModel } from "./bufferify/bufferifyModel";
import { bufferifyFrame } from "./bufferify/bufferifyFrame";

/**
 * Result structure for fileifize function containing buffered
 * connections, models, and frames.
 */
export interface FileifizeResult {
  connections: Array<{ name: string; buffer: Uint8Array }>;
  models: Array<{ name: string; buffer: Uint8Array }>;
  frames: Array<{ name: string; buffer: Uint8Array }>;
}

/**
 * Converts a FlatBuffers binary buffer into separate file buffers for
 * connections, models, and frames.
 *
 * This function takes a complete HDOM binary buffer, deserializes it
 * to extract the HDOM object, then independently bufferifies each
 * connection, model, and frame into separate binary buffers. Each
 * resulting buffer contains only the individual object, making it
 * suitable for file-based storage or transmission.
 *
 * @param buffer A `Uint8Array` containing the binary FlatBuffers data
 * representing a complete HDOM structure.
 *
 * @returns An object containing three arrays:
 * - `connections`: Array of objects with `name` and `buffer`
 *   properties
 * - `models`: Array of objects with `name` and `buffer`
 *   properties
 * - `frames`: Array of objects with `name` and `buffer`
 *   properties
 *
 * @example
 * ```ts
 * const hdomBuffer: Uint8Array = ...; // Complete HDOM binary
 * const result = fileifize(hdomBuffer);
 * // result.connections[0].name === "MyConnection"
 * // result.connections[0].buffer === Uint8Array for that connection
 * // result.models[0].name === "MyModel"
 * // result.models[0].buffer === Uint8Array for that model
 * // result.frames[0].name === "MyFrame"
 * // result.frames[0].buffer === Uint8Array for that frame
 * ```
 */
export function fileifize(buffer: Uint8Array): FileifizeResult {
  const hdom = deserialize(buffer);

  const connections = hdom.connections.map((conn) => ({
    name: conn.name,
    buffer: bufferifySingleConnection(conn),
  }));

  const models = hdom.models.map((model) => ({
    name: model.name,
    buffer: bufferifySingleModel(model),
  }));

  const frames = hdom.frames.map((frame) => ({
    name: frame.name,
    buffer: bufferifySingleFrame(frame),
  }));

  return {
    connections,
    models,
    frames,
  };
}

/**
 * Bufferifies a single Connection object into a Uint8Array.
 *
 * @param connection The Connection object to bufferify.
 *
 * @returns A Uint8Array containing the serialized Connection.
 */
function bufferifySingleConnection(
  connection: Connection,
): Uint8Array {
  const builder = new flatbuffers.Builder(1024);
  const offset = bufferifyConnection(builder, connection);
  builder.finish(offset);
  return builder.asUint8Array();
}

/**
 * Bufferifies a single Model object into a Uint8Array.
 *
 * @param model The Model object to bufferify.
 *
 * @returns A Uint8Array containing the serialized Model.
 */
function bufferifySingleModel(model: Model): Uint8Array {
  const builder = new flatbuffers.Builder(1024);
  const offset = bufferifyModel(builder, model);
  builder.finish(offset);
  return builder.asUint8Array();
}

/**
 * Bufferifies a single Frame object into a Uint8Array.
 *
 * @param frame The Frame object to bufferify.
 *
 * @returns A Uint8Array containing the serialized Frame.
 */
function bufferifySingleFrame(frame: Frame): Uint8Array {
  const builder = new flatbuffers.Builder(1024);
  const offset = bufferifyFrame(builder, frame);
  builder.finish(offset);
  return builder.asUint8Array();
}

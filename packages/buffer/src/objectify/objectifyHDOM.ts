/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDOMStruct } from "@hdml/schemas";
import { HDOM, Include } from "@hdml/types";
import { objectifyConnection } from "./objectifyConnection";
import { objectifyModel } from "./objectifyModel";
import { objectifyFrame } from "./objectifyFrame";

/**
 * Converts a FlatBuffers `HDOMStruct` to a TypeScript `HDOM` object.
 *
 * This function deserializes a FlatBuffers `HDOMStruct` structure,
 * representing an HDML document, into a TypeScript `HDOM` interface
 * object. The resulting object can be used for programmatic
 * manipulation of hierarchical HDML document data.
 *
 * @param hdomStruct The FlatBuffers `HDOMStruct` object to convert.
 *
 * @returns The converted `HDOM` object containing includes,
 * connections, models, and frames.
 *
 * @example
 * ```ts
 * const bytes: Uint8Array = ...; // FlatBuffers binary data
 * const byteBuffer = new flatbuffers.ByteBuffer(bytes);
 * const hdomStruct = HDOMStruct.getRootAsHDOMStruct(byteBuffer);
 * const hdom = objectifyHDOM(hdomStruct);
 * ```
 */
export function objectifyHDOM(hdomStruct: HDOMStruct): HDOM {
  const includes: Include[] = [];
  for (let i = 0; i < hdomStruct.includesLength(); i++) {
    const includeStruct = hdomStruct.includes(i);
    if (includeStruct) {
      includes.push({
        path: includeStruct.path() || "",
      });
    }
  }

  const connections = [];
  for (let i = 0; i < hdomStruct.connectionsLength(); i++) {
    const connStruct = hdomStruct.connections(i);
    if (connStruct) {
      connections.push(objectifyConnection(connStruct));
    }
  }

  const models = [];
  for (let i = 0; i < hdomStruct.modelsLength(); i++) {
    const modelStruct = hdomStruct.models(i);
    if (modelStruct) {
      models.push(objectifyModel(modelStruct));
    }
  }

  const frames = [];
  for (let i = 0; i < hdomStruct.framesLength(); i++) {
    const frameStruct = hdomStruct.frames(i);
    if (frameStruct) {
      frames.push(objectifyFrame(frameStruct));
    }
  }

  return {
    includes,
    connections,
    models,
    frames,
  };
}

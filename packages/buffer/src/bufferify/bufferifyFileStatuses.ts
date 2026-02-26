/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { DocumentFileStatusesStruct } from "@hdml/schemas";

/**
 * Serializes file status arrays into a FlatBuffers
 * `DocumentFileStatusesStruct`.
 *
 * Takes parallel arrays of file names, status strings, and
 * message strings and converts them into a
 * `DocumentFileStatusesStruct` structure. The three arrays
 * are stored as string vectors in the struct.
 *
 * @param builder The FlatBuffers `Builder` instance used to
 * serialize data.
 *
 * @param names Array of file names (e.g. connection/model/frame
 * identifiers).
 *
 * @param statuses Array of status strings (e.g. "ok", "error").
 *
 * @param messages Array of message strings (e.g. error or
 * status messages).
 *
 * @returns The offset of the serialized
 * `DocumentFileStatusesStruct` in the FlatBuffers builder.
 *
 * @example
 * ```typescript
 * const builder = new Builder(1024);
 * const names = ["conn1", "model1"];
 * const statuses = ["ok", "error"];
 * const messages = ["", "Parse failed"];
 * const offset = bufferifyFileStatuses(
 *   builder,
 *   names,
 *   statuses,
 *   messages,
 * );
 * builder.finish(offset);
 * const bytes = builder.asUint8Array();
 * ```
 */
export function bufferifyFileStatuses(
  builder: Builder,
  names: string[],
  statuses: string[],
  messages: string[],
): number {
  const nameOffsets = names.map((n) => builder.createString(n));
  const statusOffsets = statuses.map((s) => builder.createString(s));
  const messageOffsets = messages.map((m) => builder.createString(m));

  const nameVector = DocumentFileStatusesStruct.createNameVector(
    builder,
    nameOffsets,
  );
  const statusVector = DocumentFileStatusesStruct.createStatusVector(
    builder,
    statusOffsets,
  );
  const messageVector =
    DocumentFileStatusesStruct.createMessageVector(
      builder,
      messageOffsets,
    );

  DocumentFileStatusesStruct.startDocumentFileStatusesStruct(builder);
  DocumentFileStatusesStruct.addName(builder, nameVector);
  DocumentFileStatusesStruct.addStatus(builder, statusVector);
  DocumentFileStatusesStruct.addMessage(builder, messageVector);
  return DocumentFileStatusesStruct.endDocumentFileStatusesStruct(
    builder,
  );
}

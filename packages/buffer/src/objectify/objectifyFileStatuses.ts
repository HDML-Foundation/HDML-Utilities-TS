/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { DocumentFileStatusesStruct } from "@hdml/schemas";
import type { FileStatuses } from "../FileStatuses";

/**
 * Converts a FlatBuffers `DocumentFileStatusesStruct` to a
 * TypeScript `FileStatuses` object.
 *
 * Reads the name, status, and message vectors from the struct
 * and returns them as parallel arrays in a `FileStatuses` object.
 *
 * @param struct The FlatBuffers `DocumentFileStatusesStruct`
 * to convert.
 *
 * @returns The converted `FileStatuses` object with `names`,
 * `statuses`, and `messages` arrays.
 *
 * @example
 * ```ts
 * const struct = DocumentFileStatusesStruct
 *  .getRootAsDocumentFileStatusesStruct(bb);
 * const fileStatuses = objectifyFileStatuses(struct);
 * // fileStatuses.names, fileStatuses.statuses,
 * // fileStatuses.messages
 * ```
 */
export function objectifyFileStatuses(
  struct: DocumentFileStatusesStruct,
): FileStatuses {
  const nameLen = struct.nameLength();
  const statusLen = struct.statusLength();
  const messageLen = struct.messageLength();

  const names: string[] = [];
  for (let i = 0; i < nameLen; i++) {
    names.push(struct.name(i) ?? "");
  }

  const statuses: string[] = [];
  for (let i = 0; i < statusLen; i++) {
    statuses.push(struct.status(i) ?? "");
  }

  const messages: string[] = [];
  for (let i = 0; i < messageLen; i++) {
    messages.push(struct.message(i) ?? "");
  }

  return { names, statuses, messages };
}

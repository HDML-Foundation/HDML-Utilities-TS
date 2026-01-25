/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { FileStruct } from "@hdml/schemas";

/**
 * Serializes a file name and content into a FlatBuffers `FileStruct`.
 *
 * This function takes a file name (string) and file content
 * (Uint8Array) and converts them into a FlatBuffers `FileStruct`
 * structure. The `FileStruct` can be used to efficiently store or
 * transmit file data in binary format.
 *
 * @param builder The FlatBuffers `Builder` instance used to
 * serialize data.
 *
 * @param fileName The name of the file as a string.
 *
 * @param fileContent The content of the file as a `Uint8Array`.
 *
 * @returns The offset of the serialized `FileStruct` structure
 * in the FlatBuffers builder.
 *
 * @example
 * ```typescript
 * const builder = new Builder(1024);
 * const fileName = "example.txt";
 * const fileContent = new Uint8Array([72, 101, 108, 108, 111]);
 * const offset = bufferifyFile(builder, fileName, fileContent);
 * builder.finish(offset);
 * const bytes = builder.asUint8Array();
 * ```
 */
export function bufferifyFile(
  builder: Builder,
  fileName: string,
  fileContent: Uint8Array,
): number {
  const nameOffset = builder.createString(fileName);
  const contentOffset = builder.createByteVector(fileContent);

  FileStruct.startFileStruct(builder);
  FileStruct.addName(builder, nameOffset);
  FileStruct.addContent(builder, contentOffset);
  return FileStruct.endFileStruct(builder);
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import { Builder } from "flatbuffers";
import { FileStruct } from "@hdml/schemas";
import { bufferifyFile } from "./bufferifyFile";

/**
 * Jest test suite for `bufferifyFile`.
 * This suite tests the serialization of file name and content
 * into `FileStruct` objects.
 */
describe("The `bufferifyFile` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  it("should bufferify a file with name and content", () => {
    const fileName = "example.txt";
    const fileContent = new Uint8Array([72, 101, 108, 108, 111]);

    const offset = bufferifyFile(builder, fileName, fileContent);
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct = FileStruct.getRootAsFileStruct(
      new flatbuffers.ByteBuffer(bytes),
    );

    expect(struct.name()).toBe(fileName);
    const contentArray = struct.contentArray();
    expect(contentArray).toBeDefined();
    expect(contentArray?.length).toBe(fileContent.length);
    expect(Array.from(contentArray || [])).toEqual(
      Array.from(fileContent),
    );
  });

  it("should bufferify a file with empty content", () => {
    const fileName = "empty.txt";
    const fileContent = new Uint8Array([]);

    const offset = bufferifyFile(builder, fileName, fileContent);
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct = FileStruct.getRootAsFileStruct(
      new flatbuffers.ByteBuffer(bytes),
    );

    expect(struct.name()).toBe(fileName);
    const contentArray = struct.contentArray();
    expect(contentArray?.length).toBe(0);
  });

  it("should bufferify a file with large content", () => {
    const fileName = "large.bin";
    const fileContent = new Uint8Array(1000);
    for (let i = 0; i < fileContent.length; i++) {
      fileContent[i] = i % 256;
    }

    const offset = bufferifyFile(builder, fileName, fileContent);
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct = FileStruct.getRootAsFileStruct(
      new flatbuffers.ByteBuffer(bytes),
    );

    expect(struct.name()).toBe(fileName);
    const contentArray = struct.contentArray();
    expect(contentArray?.length).toBe(fileContent.length);
    expect(Array.from(contentArray || [])).toEqual(
      Array.from(fileContent),
    );
  });

  it("should bufferify a file with special characters in name", () => {
    const fileName = "file-with-special-chars_123.txt";
    const fileContent = new Uint8Array([65, 66, 67]);

    const offset = bufferifyFile(builder, fileName, fileContent);
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct = FileStruct.getRootAsFileStruct(
      new flatbuffers.ByteBuffer(bytes),
    );

    expect(struct.name()).toBe(fileName);
  });

  it("should bufferify a file with binary content", () => {
    const fileName = "binary.dat";
    const fileContent = new Uint8Array([
      0x00, 0x01, 0x02, 0x03, 0xff, 0xfe, 0xfd, 0xfc,
    ]);

    const offset = bufferifyFile(builder, fileName, fileContent);
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct = FileStruct.getRootAsFileStruct(
      new flatbuffers.ByteBuffer(bytes),
    );

    expect(struct.name()).toBe(fileName);
    const contentArray = struct.contentArray();
    expect(contentArray?.length).toBe(fileContent.length);
    expect(Array.from(contentArray || [])).toEqual(
      Array.from(fileContent),
    );
  });
});

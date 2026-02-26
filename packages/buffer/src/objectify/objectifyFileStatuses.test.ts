/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import { Builder } from "flatbuffers";
import { DocumentFileStatusesStruct } from "@hdml/schemas";
import { bufferifyFileStatuses } from "../bufferify/bufferifyFileStatuses";
import { objectifyFileStatuses } from "./objectifyFileStatuses";

describe("The `objectifyFileStatuses` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  test("should objectify names, statuses, and messages", () => {
    const names = ["conn1", "model1", "frame1"];
    const statuses = ["ok", "ok", "error"];
    const messages = ["", "", "Parse failed"];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        byteBuffer,
      );
    const result = objectifyFileStatuses(struct);

    expect(result.names).toEqual(names);
    expect(result.statuses).toEqual(statuses);
    expect(result.messages).toEqual(messages);
  });

  test("should objectify empty vectors", () => {
    const names: string[] = [];
    const statuses: string[] = [];
    const messages: string[] = [];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        byteBuffer,
      );
    const result = objectifyFileStatuses(struct);

    expect(result.names).toEqual([]);
    expect(result.statuses).toEqual([]);
    expect(result.messages).toEqual([]);
  });

  test("should objectify a single entry", () => {
    const names = ["only"];
    const statuses = ["ok"];
    const messages = ["No issues"];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        byteBuffer,
      );
    const result = objectifyFileStatuses(struct);

    expect(result).toEqual({ names, statuses, messages });
  });

  test("should objectify different-length vectors", () => {
    const names = ["a", "b"];
    const statuses = ["ok"];
    const messages = ["msg1", "msg2", "msg3"];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        byteBuffer,
      );
    const result = objectifyFileStatuses(struct);

    expect(result.names).toHaveLength(2);
    expect(result.statuses).toHaveLength(1);
    expect(result.messages).toHaveLength(3);
    expect(result.names).toEqual(["a", "b"]);
    expect(result.statuses).toEqual(["ok"]);
    expect(result.messages).toEqual(["msg1", "msg2", "msg3"]);
  });

  test("should preserve special characters in strings", () => {
    const names = ["file_with-special_chars.123"];
    const statuses = ["error"];
    const messages = ["Line 1\nLine 2\tTab"];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        byteBuffer,
      );
    const result = objectifyFileStatuses(struct);

    expect(result.names[0]).toBe("file_with-special_chars.123");
    expect(result.statuses[0]).toBe("error");
    expect(result.messages[0]).toBe("Line 1\nLine 2\tTab");
  });
});

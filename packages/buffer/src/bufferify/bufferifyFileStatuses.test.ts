/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import { Builder } from "flatbuffers";
import { DocumentFileStatusesStruct } from "@hdml/schemas";
import { bufferifyFileStatuses } from "./bufferifyFileStatuses";

/**
 * Jest test suite for `bufferifyFileStatuses`.
 * Tests serialization of name/status/message arrays into
 * `DocumentFileStatusesStruct`.
 */
describe("The `bufferifyFileStatuses` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  it("should bufferify names, statuses, and messages", () => {
    const names = ["conn1", "model1", "frame1"];
    const statuses = ["ok", "ok", "error"];
    const messages = ["", "", "Parse failed"];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        new flatbuffers.ByteBuffer(bytes),
      );

    expect(struct.nameLength()).toBe(3);
    expect(struct.statusLength()).toBe(3);
    expect(struct.messageLength()).toBe(3);
    expect(struct.name(0)).toBe("conn1");
    expect(struct.name(1)).toBe("model1");
    expect(struct.name(2)).toBe("frame1");
    expect(struct.status(0)).toBe("ok");
    expect(struct.status(1)).toBe("ok");
    expect(struct.status(2)).toBe("error");
    expect(struct.message(0)).toBe("");
    expect(struct.message(1)).toBe("");
    expect(struct.message(2)).toBe("Parse failed");
  });

  it("should bufferify empty arrays", () => {
    const names: string[] = [];
    const statuses: string[] = [];
    const messages: string[] = [];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        new flatbuffers.ByteBuffer(bytes),
      );

    expect(struct.nameLength()).toBe(0);
    expect(struct.statusLength()).toBe(0);
    expect(struct.messageLength()).toBe(0);
  });

  it("should bufferify a single entry", () => {
    const names = ["only"];
    const statuses = ["ok"];
    const messages = ["No issues"];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        new flatbuffers.ByteBuffer(bytes),
      );

    expect(struct.nameLength()).toBe(1);
    expect(struct.name(0)).toBe("only");
    expect(struct.status(0)).toBe("ok");
    expect(struct.message(0)).toBe("No issues");
  });

  it("should allow different-length arrays", () => {
    const names = ["a", "b"];
    const statuses = ["ok"];
    const messages = ["msg1", "msg2", "msg3"];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        new flatbuffers.ByteBuffer(bytes),
      );

    expect(struct.nameLength()).toBe(2);
    expect(struct.statusLength()).toBe(1);
    expect(struct.messageLength()).toBe(3);
    expect(struct.name(0)).toBe("a");
    expect(struct.name(1)).toBe("b");
    expect(struct.status(0)).toBe("ok");
    expect(struct.message(0)).toBe("msg1");
    expect(struct.message(1)).toBe("msg2");
    expect(struct.message(2)).toBe("msg3");
  });

  it("should preserve special characters in strings", () => {
    const names = ["file_with-special_chars.123"];
    const statuses = ["error"];
    const messages = ["Line 1\nLine 2\tTab"];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        new flatbuffers.ByteBuffer(bytes),
      );

    expect(struct.name(0)).toBe("file_with-special_chars.123");
    expect(struct.status(0)).toBe("error");
    expect(struct.message(0)).toBe("Line 1\nLine 2\tTab");
  });

  it("should preserve long messages", () => {
    const names = ["item"];
    const statuses = ["error"];
    const messages = ["x".repeat(500)];

    const offset = bufferifyFileStatuses(
      builder,
      names,
      statuses,
      messages,
    );
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const struct =
      DocumentFileStatusesStruct.getRootAsDocumentFileStatusesStruct(
        new flatbuffers.ByteBuffer(bytes),
      );

    expect(struct.message(0)).toBe("x".repeat(500));
  });
});

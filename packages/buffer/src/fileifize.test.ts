/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import {
  DocumentFilesStruct,
  ConnectorTypesEnum,
} from "@hdml/schemas";
import { HDOM, Connection } from "@hdml/types";
import { fileifize, serialize, deserialize, StructType } from ".";
import type { DocumentFileBlobs } from ".";

const readback = (bytes: Uint8Array): DocumentFilesStruct =>
  DocumentFilesStruct.getRootAsDocumentFilesStruct(
    new flatbuffers.ByteBuffer(bytes),
  );

describe("The `fileifize` function", () => {
  it("packs blobs, writing name and content verbatim", () => {
    // Arbitrary (non-struct) bytes: if fileifize re-serialized, these
    // would not survive — so byte-equality proves pack-only behavior.
    const connContent = new Uint8Array([10, 20, 30, 40, 50]);
    const modelContent = new Uint8Array([1, 2, 3]);
    const frameContent = new Uint8Array([9, 8, 7, 6]);

    const blobs: DocumentFileBlobs = {
      connections: [{ name: "tenant_pg.hdml", content: connContent }],
      models: [
        { name: "hdml-model=m@abc123de.hdml", content: modelContent },
      ],
      frames: [
        { name: "hdml-frame=f@0a1b2c3d.hdml", content: frameContent },
      ],
    };

    const bytes = fileifize(blobs);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(0);

    const struct = readback(bytes);
    expect(struct.connectionsLength()).toBe(1);
    expect(struct.modelsLength()).toBe(1);
    expect(struct.framesLength()).toBe(1);

    // Full canonical key written verbatim, not the bare element name.
    expect(struct.connections(0)?.name()).toBe("tenant_pg.hdml");
    expect(struct.models(0)?.name()).toBe(
      "hdml-model=m@abc123de.hdml",
    );
    expect(struct.frames(0)?.name()).toBe(
      "hdml-frame=f@0a1b2c3d.hdml",
    );

    // Content copied byte-for-byte — NO re-serialize.
    expect(
      Array.from(struct.connections(0)?.contentArray() ?? []),
    ).toEqual(Array.from(connContent));
    expect(
      Array.from(struct.models(0)?.contentArray() ?? []),
    ).toEqual(Array.from(modelContent));
    expect(
      Array.from(struct.frames(0)?.contentArray() ?? []),
    ).toEqual(Array.from(frameContent));
  });

  it("preserves real serialized struct content on round-trip", () => {
    const connection: Connection = {
      name: "tenant_pg",
      description: "primary",
      options: {
        connector: ConnectorTypesEnum.Postgres,
        parameters: {
          host: "localhost",
          user: "root",
          password: "pass",
          ssl: true,
        },
      },
    };
    const content = serialize(
      connection,
      StructType.ConnectionStruct,
    );

    const bytes = fileifize({
      connections: [{ name: "tenant_pg.hdml", content }],
      models: [],
      frames: [],
    });
    const stored = readback(bytes).connections(0)?.contentArray();
    expect(stored).toBeDefined();
    expect(Array.from(stored ?? [])).toEqual(Array.from(content));

    const roundTripped = deserialize(
      stored as Uint8Array,
      StructType.ConnectionStruct,
    ) as Connection;
    expect(roundTripped.name).toBe("tenant_pg");
    expect(roundTripped.description).toBe("primary");
  });

  it("handles empty blob groups", () => {
    const struct = readback(
      fileifize({ connections: [], models: [], frames: [] }),
    );
    expect(struct.connectionsLength()).toBe(0);
    expect(struct.modelsLength()).toBe(0);
    expect(struct.framesLength()).toBe(0);
  });

  it("no longer accepts the old HDOM-taking signature", () => {
    const hdom: HDOM = { connections: [], models: [], frames: [] };
    // @ts-expect-error fileifize(hdom: HDOM) is gone — it now takes
    // DocumentFileBlobs (pre-serialized {name, content} blobs), and
    // Connection/Model/Frame are not assignable to FileBlob.
    fileifize(hdom);
  });
});

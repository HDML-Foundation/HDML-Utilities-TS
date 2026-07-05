/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import { DocumentFilesStruct } from "@hdml/schemas";
import { bufferifyDocumentFiles } from "./bufferifyDocumentFiles";
import type { DocumentFileBlobs } from "../fileifize";

describe("The `bufferifyDocumentFiles` function", () => {
  let builder: flatbuffers.Builder;

  beforeEach(() => {
    builder = new flatbuffers.Builder(1024);
  });

  const pack = (blobs: DocumentFileBlobs): DocumentFilesStruct => {
    const offset = bufferifyDocumentFiles(builder, blobs);
    expect(offset).toBeGreaterThan(0);
    builder.finish(offset);
    const bytes = builder.asUint8Array();
    return DocumentFilesStruct.getRootAsDocumentFilesStruct(
      new flatbuffers.ByteBuffer(bytes),
    );
  };

  it("writes name verbatim and content byte-for-byte", () => {
    const connContent = new Uint8Array([1, 2, 3, 4]);
    const modelContent = new Uint8Array([5, 6, 7]);
    const frameContent = new Uint8Array([8, 9]);
    const blobs: DocumentFileBlobs = {
      connections: [{ name: "tenant_pg.hdml", content: connContent }],
      models: [
        { name: "hdml-model=m@abc123de.hdml", content: modelContent },
      ],
      frames: [
        { name: "hdml-frame=f@0a1b2c3d.hdml", content: frameContent },
      ],
    };

    const struct = pack(blobs);

    expect(struct.connectionsLength()).toBe(1);
    expect(struct.modelsLength()).toBe(1);
    expect(struct.framesLength()).toBe(1);

    // Name written verbatim — the caller-supplied canonical key.
    expect(struct.connections(0)?.name()).toBe("tenant_pg.hdml");
    expect(struct.models(0)?.name()).toBe(
      "hdml-model=m@abc123de.hdml",
    );
    expect(struct.frames(0)?.name()).toBe(
      "hdml-frame=f@0a1b2c3d.hdml",
    );

    // Content copied byte-for-byte — the packer never re-serializes.
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

  it("handles empty blob groups", () => {
    const struct = pack({ connections: [], models: [], frames: [] });
    expect(struct.connectionsLength()).toBe(0);
    expect(struct.modelsLength()).toBe(0);
    expect(struct.framesLength()).toBe(0);
  });

  it("preserves order across multiple blobs per vector", () => {
    const struct = pack({
      connections: [
        { name: "t_a.hdml", content: new Uint8Array([1]) },
        { name: "t_b.hdml", content: new Uint8Array([2]) },
      ],
      models: [
        {
          name: "hdml-model=m1@aaaaaaaa.hdml",
          content: new Uint8Array([3]),
        },
        {
          name: "hdml-model=m2@bbbbbbbb.hdml",
          content: new Uint8Array([4]),
        },
      ],
      frames: [
        {
          name: "hdml-frame=f1@cccccccc.hdml",
          content: new Uint8Array([5]),
        },
        {
          name: "hdml-frame=f2@dddddddd.hdml",
          content: new Uint8Array([6]),
        },
      ],
    });

    expect(struct.connectionsLength()).toBe(2);
    expect(struct.modelsLength()).toBe(2);
    expect(struct.framesLength()).toBe(2);

    expect(struct.connections(0)?.name()).toBe("t_a.hdml");
    expect(struct.connections(1)?.name()).toBe("t_b.hdml");
    expect(struct.models(0)?.name()).toBe(
      "hdml-model=m1@aaaaaaaa.hdml",
    );
    expect(struct.models(1)?.name()).toBe(
      "hdml-model=m2@bbbbbbbb.hdml",
    );
    expect(struct.frames(0)?.name()).toBe(
      "hdml-frame=f1@cccccccc.hdml",
    );
    expect(struct.frames(1)?.name()).toBe(
      "hdml-frame=f2@dddddddd.hdml",
    );
  });
});

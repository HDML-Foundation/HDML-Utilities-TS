/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { parseHDML } from "@hdml/parser";
import { serialize, deserialize, StructType } from "@hdml/buffer";
import { bytesToBase64, base64ToBytes } from "@hdml/hash";
import type { Connection } from "@hdml/types";
import {
  buildManifest,
  Manifest,
  ManifestError,
  ManifestDeps,
} from "./buildManifest";

const deps: ManifestDeps = {
  parseHDML,
  serialize,
  bytesToBase64,
  StructType,
};

const hdml = `
  <div>
    <hdml-connection
      name="tenant_pg"
      type="postgresql"
      host="example.com"
      user="user"
      password="pass">
    </hdml-connection>

    <hdml-model name="sales">
      <hdml-table
        name="orders"
        type="table"
        identifier="\`tenant_pg\`.\`public\`.\`orders\`">
        <hdml-field name="id"></hdml-field>
        <hdml-field name="amount"></hdml-field>
      </hdml-table>
    </hdml-model>

    <hdml-frame
      name="sales_2024"
      source="/sales.html?hdml-model=sales">
      <hdml-field name="amount"></hdml-field>
    </hdml-frame>
  </div>
`;

describe("buildManifest", () => {
  it("splits a document into a §3.1 manifest", () => {
    const out = buildManifest(deps, hdml) as Manifest;
    expect(out.connections.map((c) => c.name)).toEqual(["tenant_pg"]);
    expect(out.models.map((m) => m.name)).toEqual(["sales"]);
    expect(out.frames.map((f) => f.name)).toEqual(["sales_2024"]);
  });

  it("emits base64 of individually-serialized FlatBuffers", () => {
    const out = buildManifest(deps, hdml) as Manifest;
    const conn = deserialize(
      base64ToBytes(out.connections[0].content),
      StructType.ConnectionStruct,
    ) as Connection;
    expect(conn.name).toBe("tenant_pg");
  });

  it("returns empty_source for an empty string", () => {
    expect(buildManifest(deps, "")).toEqual({
      error: "empty_source",
    });
  });

  it("returns empty arrays when no HDML elements present", () => {
    const out = buildManifest(
      deps,
      "<div>no hdml here</div>",
    ) as Manifest;
    expect(out).toEqual({
      connections: [],
      models: [],
      frames: [],
    });
  });

  it("returns parse_failed when parsing throws", () => {
    const bad: ManifestDeps = {
      ...deps,
      parseHDML: () => {
        throw new Error("nope");
      },
    };
    const out = buildManifest(bad, hdml) as ManifestError;
    expect(out.error).toBe("parse_failed");
    expect(out.detail).toBe("nope");
  });

  it("returns serialize_failed when serialization throws", () => {
    const bad: ManifestDeps = {
      ...deps,
      serialize: () => {
        throw new Error("boom");
      },
    };
    const out = buildManifest(bad, hdml) as ManifestError;
    expect(out.error).toBe("serialize_failed");
    expect(out.detail).toBe("boom");
  });
});

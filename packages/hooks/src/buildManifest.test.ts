/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { parseHDML } from "@hdml/parser";
import type { HdqlDiagnostic } from "@hdml/parser";
import { serialize, deserialize, StructType } from "@hdml/buffer";
import { bytesToBase64, base64ToBytes } from "@hdml/hash";
import type { Connection } from "@hdml/types";
import { HDQL_DIAGNOSTIC_CODES } from "@hdml/types";
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
      <hdml-dataset
        name="orders"
        type="table"
        identifier="\`tenant_pg\`.\`public\`.\`orders\`">
        <hdml-field name="id"></hdml-field>
        <hdml-field name="amount"></hdml-field>
      </hdml-dataset>
    </hdml-model>

    <hdml-frame
      name="sales_2024"
      source="/sales.html?hdml-model=sales">
      <hdml-field name="amount"></hdml-field>
    </hdml-frame>
  </div>
`;

/**
 * The same document with a SECOND, nameless `<hdml-field>` in the
 * dataset. ★ The dropped element is a leaf: a dropped CONTAINER
 * with a surviving HDML child makes `parseHDML` throw instead of
 * returning, which `buildManifest` reports as `parse_failed` with
 * no diagnostics at all. Measured at step 10 and pre-existing --
 * see `parseHDML.test.ts`.
 */
const dropped = hdml.replace(
  '<hdml-field name="amount"></hdml-field>\n      </hdml-dataset>',
  '<hdml-field name="amount"></hdml-field>\n        <hdml-field type="int32"></hdml-field>\n      </hdml-dataset>',
);

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
      diagnostics: [],
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

  it("carries an empty `diagnostics` for a clean document", () => {
    const out = buildManifest(deps, hdml) as Manifest;

    // ★ An empty ARRAY, asserted as one. Never `!out.diagnostics`
    // and never `toBeFalsy()`: an ABSENT field passes both, and
    // the whole point is that absence and emptiness differ. 022
    // cannot tell them apart, and step 26 turns the distinction
    // into a Go-side fault (RFC 019/002 §2.3, A3).
    expect(Array.isArray(out.diagnostics)).toBe(true);
    expect(out.diagnostics.length).toBe(0);
  });

  it("carries the diagnostics of a dropped element", () => {
    const out = buildManifest(deps, dropped) as Manifest;

    expect(out.diagnostics.length).toBe(1);
    expect(out.diagnostics[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_FIELD_NAME,
    );
    expect(out.diagnostics[0].severity).toBe("error");
    // ★ `[2]`, not `[1]`: the dataset already holds `id` and
    // `amount`, and the path counts TREE siblings rather than
    // surviving data -- "the third field in that dataset".
    expect(out.diagnostics[0].path).toBe(
      "hdml-model[0]/hdml-dataset[0]/hdml-field[2]",
    );
    // ★ Still a Manifest, not a ManifestError: a dropped element
    // does not fail the compile (RFC 019/002 §10.2, D11).
    expect(out.models.map((m) => m.name)).toEqual(["sales"]);
  });

  it("gives an error return no `diagnostics` field at all", () => {
    // ★ `Manifest | ManifestError` is a union and only the
    // Manifest arm gains the field: a document that did not parse
    // has nothing to attribute.
    const empty = buildManifest(deps, "");
    expect("diagnostics" in empty).toBe(false);

    const threw = buildManifest(
      {
        ...deps,
        parseHDML: () => {
          throw new Error("nope");
        },
      },
      hdml,
    );
    expect("diagnostics" in threw).toBe(false);
  });

  it("forwards the array to the INJECTED `parseHDML`", () => {
    // ★ The mechanism gate. In WASM `parseHDML` is resolved off
    // `globalThis` through `deps`, so the out-array has to reach
    // the injected function and not a directly-imported one. A
    // double that ignores its second parameter could never
    // produce a diagnostic, so this double writes into it.
    const planted: HdqlDiagnostic = {
      code: HDQL_DIAGNOSTIC_CODES.MISSING_MODEL_NAME,
      severity: "error",
      message: "planted",
      path: null,
      line: null,
      column: null,
      offset: null,
    };
    const double: ManifestDeps = {
      ...deps,
      parseHDML: (source, diagnostics) => {
        diagnostics?.push(planted);
        return parseHDML(source);
      },
    };
    const out = buildManifest(double, hdml) as Manifest;

    expect(out.diagnostics).toEqual([planted]);
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

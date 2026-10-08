/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { parseHDML, parseHTML } from "@hdml/parser";
import type { HdqlDiagnostic } from "@hdml/parser";
import {
  serialize,
  deserialize,
  structurize,
  StructType,
} from "@hdml/buffer";
import { bytesToBase64, base64ToBytes } from "@hdml/hash";
import {
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
  getModelSQL,
  getFrameSQL,
} from "@hdml/stringifier";
import { HDQL_DIAGNOSTIC_CODES } from "@hdml/types";
import type { ConnectionEntry } from "./compileConnections";
import type { AdaptationPolicy } from "./adaptation";

/**
 * The compiler bin entry's `diagnostics` field (019 step 26, RFC
 * 019/002 §2.3's A3 and §9.1).
 *
 * ★ Uses the same seam `versionEcho.test.ts` opened, and for the same
 * reason: the entry is a top-level IIFE that calls `readJson()` /
 * `writeJson()` at module scope, so it cannot be imported and then
 * exercised — but it resolves its own I/O from `globalThis`, so
 * seeding the namespaces and re-importing runs its real body against
 * doubles. `jest.resetModules()` is load-bearing.
 *
 * ★★ **The point of these tests is the FLOOR, not the content.** A3
 * makes the post-019 envelope the baseline, so an absent
 * `diagnostics` must mean *a skewed bundle*, never *this version has
 * nothing to say* — which is only true if **every** response shape
 * carries the key. Hence one case per output mode plus the error
 * path, all asserting presence, and `toHaveProperty` rather than a
 * truthiness check so `[]` counts.
 *
 * ⚠⚠ **And a populated set means ADAPTATION broke the document, not
 * that the author did.** The envelope carries post-parse structs, so
 * an ingest-time drop is already absent from them and cannot be
 * re-dropped here (C234). The `sql` cases below are the only ones
 * that can ever be non-empty, and they are driven by a *policy*.
 */

type Globals = Record<string, unknown>;

const g = globalThis as unknown as Globals;

const PLUGIN = "0.0.2-alpha.27+step26";

async function emit(input: unknown): Promise<Globals> {
  const written: unknown[] = [];
  g["@hdml/hooks"] = {
    readJson: () => input,
    writeJson: (o: unknown) => {
      written.push(o);
      return 0;
    },
  };
  g["@hdml/parser"] = { parseHDML, parseHTML };
  g["@hdml/buffer"] = {
    serialize,
    deserialize,
    structurize,
    StructType,
  };
  g["@hdml/hash"] = { bytesToBase64, base64ToBytes };
  g["@hdml/stringifier"] = {
    getConnectionSQLs,
    getModelHTML,
    getFrameHTML,
    getModelSQL,
    getFrameSQL,
  };
  g["@hdml/version"] = PLUGIN;
  jest.resetModules();
  await import("./compiler");
  return (written[0] ?? {}) as Globals;
}

/** A clean two-frame closure over one model. */
const DOC = `
  <hdml-connection name="pg" type="postgresql" host="h" user="u"
    password="p"></hdml-connection>
  <hdml-model name="m_stock">
    <hdml-dataset name="amazon" type="table"
      identifier="pg.public.amazon_stock">
      <hdml-field name="open"></hdml-field>
      <hdml-field name="close"></hdml-field>
    </hdml-dataset>
  </hdml-model>
  <hdml-frame name="inner" source="/q/q.html?hdml-model=m_stock"
    limit="100" offset="0">
    <hdml-field name="open"></hdml-field>
  </hdml-frame>
  <hdml-frame name="outer" source="/q/q.html?hdml-frame=inner"
    limit="50" offset="0">
    <hdml-field name="open"></hdml-field>
  </hdml-frame>
`;

/** A document whose only fault is the AUTHOR's: two dropped elements. */
const AUTHORED_BADLY = `
  <hdml-model name="m_stock">
    <hdml-dataset name="amazon"
      identifier="pg.public.amazon_stock">
      <hdml-field name="open"></hdml-field>
    </hdml-dataset>
    <hdml-dataset name="good" type="table" identifier="pg.public.t">
      <hdml-field></hdml-field>
      <hdml-field name="close"></hdml-field>
    </hdml-dataset>
  </hdml-model>
  <hdml-frame name="outer" source="/q/q.html?hdml-model=m_stock"
    limit="50" offset="0">
    <hdml-field name="close"></hdml-field>
  </hdml-frame>
`;

/** Serializes a parsed document into a compiler envelope's limbs. */
function closure(html: string): {
  model: string;
  frames: string[];
  connections: ConnectionEntry[];
} {
  const hdom = parseHDML(html);
  return {
    model: bytesToBase64(
      serialize(hdom.models[0], StructType.ModelStruct),
    ),
    frames: hdom.frames.map((f) =>
      bytesToBase64(serialize(f, StructType.FrameStruct)),
    ),
    connections: hdom.connections.map((c) => ({
      name: c.name,
      content: bytesToBase64(
        serialize(c, StructType.ConnectionStruct),
      ),
    })),
  };
}

const clean = closure(DOC);

/** Empties whatever it matches: an unrecognized `type` is a drop. */
const BREAKS_THE_DATASET: AdaptationPolicy = {
  roles: {
    viewer: [
      {
        selector: "hdml-dataset",
        action: "set-attribute",
        attribute: "type",
        value: "bogus",
      },
    ],
  },
};

/** Removes the same element instead of corrupting it. */
const REMOVES_THE_DATASET: AdaptationPolicy = {
  roles: {
    viewer: [{ selector: "hdml-dataset", action: "remove-element" }],
  },
};

function base(output: string): Record<string, unknown> {
  return {
    output,
    model: clean.model,
    frames: clean.frames,
    connections: clean.connections,
    env: {},
    scope: {},
    role: "viewer",
  };
}

describe("the compiler bin entry always carries diagnostics", () => {
  // A3's floor: the key is present on EVERY shape, so its absence can
  // only mean a bundle that predates it.
  it.each([
    ["connection", "connection"],
    ["source", "source"],
    ["sql", "sql"],
    ["effective", "effective"],
  ])("carries diagnostics in %s mode", async (_label, mode) => {
    const out = await emit(base(mode));
    expect(out.error).toBeUndefined();
    expect(out).toHaveProperty("diagnostics");
    expect(out.diagnostics).toEqual([]);
    expect(out.plugin).toBe(PLUGIN);
  });

  it("carries diagnostics on the error path too", async () => {
    const out = await emit({ output: "nope" });
    expect(out.error).toBe("invalid_output");
    expect(out).toHaveProperty("diagnostics");
    expect(out.diagnostics).toEqual([]);
  });

  it("survives JSON.stringify as [] rather than being dropped", async () => {
    // ★ The asymmetry the floor depends on: an absent `plugin` global
    // leaves the key out, but an empty diagnostic set must still be
    // on the wire, because the Go reader treats nil as a fault.
    const out = await emit(base("source"));
    expect(JSON.stringify(out)).toContain('"diagnostics":[]');
  });
});

describe("the compiler's diagnostics report adaptation, not authoring", () => {
  it("is populated when a policy empties an element", async () => {
    const out = await emit({
      ...base("sql"),
      adaptation_policy: BREAKS_THE_DATASET,
    });
    const got = out.diagnostics as HdqlDiagnostic[];
    expect(got).toHaveLength(1);
    expect(got[0].code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_DATASET_ATTRS,
    );
    // Anchored, and the anchor is the ADAPTED document's.
    expect(got[0].path).toBe("hdml-model[0]/hdml-dataset[0]");
    expect(got[0].line).toEqual(expect.any(Number));
    expect(got[0].column).toEqual(expect.any(Number));
    expect(got[0].offset).toEqual(expect.any(Number));
  });

  it("still returns a result when a policy empties an element", async () => {
    // D11: a diagnostic does not fail the compile. ⚠ But the SQL it
    // returns is the empty-model shape Trino rejects, and this set is
    // the only record of why — which is the whole value of the field.
    const out = await emit({
      ...base("sql"),
      adaptation_policy: BREAKS_THE_DATASET,
    });
    expect(out.error).toBeUndefined();
    expect(out.result).toHaveLength(1);
    expect(out.diagnostics).toHaveLength(1);
  });

  it("is empty for remove-element — nothing was dropped", async () => {
    // The element is gone before the parse, so there is nothing to
    // diagnose, and the removal is what the policy asked for.
    const out = await emit({
      ...base("sql"),
      adaptation_policy: REMOVES_THE_DATASET,
    });
    expect(out.diagnostics).toEqual([]);
  });

  it("is EMPTY for a badly authored document (C234)", async () => {
    // ⚠⚠ The counter-intuitive one, and the reason it is a test: the
    // envelope carries post-parse structs, so the author's two drops
    // are already absent and cannot be re-dropped. Their diagnostics
    // live on the PARSER manifest. A reader who expects the compiler
    // to repeat them gets `[]` and must not read that as "clean".
    const authored = closure(AUTHORED_BADLY);
    const ingest: HdqlDiagnostic[] = [];
    parseHDML(AUTHORED_BADLY, ingest);
    expect(ingest).toHaveLength(2);

    const out = await emit({
      output: "sql",
      model: authored.model,
      frames: authored.frames,
      env: {},
      scope: {},
      role: "viewer",
    });
    expect(out.diagnostics).toEqual([]);
  });
});

describe("the compiler's shape is the parser's shape", () => {
  it("has an IDENTICAL key set to the parser's, by machine", async () => {
    // ★ RFC 019/002 §2.1's "one shape, two emitters" — the contract
    // 022 is written against. Compared as SETS, not by eye: a nested
    // `anchor` on one side would leave both emitters "working" while
    // the Go reader silently discarded every location (C231).
    const parserSink: HdqlDiagnostic[] = [];
    parseHDML(AUTHORED_BADLY, parserSink);
    expect(parserSink.length).toBeGreaterThan(0);

    const out = await emit({
      ...base("sql"),
      adaptation_policy: BREAKS_THE_DATASET,
    });
    const compilerSet = out.diagnostics as HdqlDiagnostic[];
    expect(compilerSet.length).toBeGreaterThan(0);

    const keys = (d: HdqlDiagnostic): string[] =>
      Object.keys(d).sort();
    expect(keys(compilerSet[0])).toEqual(keys(parserSink[0]));
    // And the names themselves are contract — spelled out so a
    // rename cannot pass by matching itself on both sides.
    expect(keys(compilerSet[0])).toEqual([
      "code",
      "column",
      "line",
      "message",
      "offset",
      "path",
      "severity",
    ]);
  });
});

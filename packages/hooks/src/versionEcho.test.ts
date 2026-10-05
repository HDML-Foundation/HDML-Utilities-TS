/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { parseHDML, parseHTML } from "@hdml/parser";
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
import type { ConnectionEntry } from "./compileConnections";

/**
 * A4's version echo, asserted on BOTH bin entries and on BOTH a
 * success and an error return (RFC 019/002 §4.6; RFC 019/001 §8.5).
 *
 * ★ Neither `parser.ts` nor `compiler.ts` had a test of any kind
 * before 019 step 16, and the reason is structural: both are
 * top-level IIFEs that call `readJson()` and `writeJson()` at MODULE
 * SCOPE, so merely importing one runs it. They cannot be imported
 * and then exercised.
 *
 * ★ But they resolve their own I/O from `globalThis`, not from the
 * `./index` module they import types from -- which is the opening.
 * Seed `globalThis["@hdml/hooks"]` with a `readJson` that returns
 * the test's input and a `writeJson` that captures the output, seed
 * the other namespaces with the REAL implementations, then import
 * the entry: its IIFE runs against the doubles and needs no stdio
 * and no WASM host at all. ⇒ the entries keep their shape exactly,
 * which matters because they are what `hdio.wasm` runs.
 *
 * `jest.resetModules()` before each import is load-bearing: a module
 * body runs ONCE per registry, so without it the second import of
 * an entry is a cache hit that emits nothing.
 */

type Globals = Record<string, unknown>;

const g = globalThis as unknown as Globals;

/** A value that cannot be confused with a real plugin version. */
const PLUGIN = "0.0.2-alpha.26+step16";

/**
 * Seeds every namespace a bin entry destructures, re-imports the
 * entry so its IIFE runs, and returns what it wrote. `version`
 * `undefined` removes the global entirely rather than setting it to
 * `undefined`, so the absent-plugin case is genuinely absent.
 */
async function emit(
  entry: () => Promise<unknown>,
  input: unknown,
  version: string | undefined,
): Promise<{ out: Globals; writes: number }> {
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
  if (version === undefined) {
    delete g["@hdml/version"];
  } else {
    g["@hdml/version"] = version;
  }
  jest.resetModules();
  await entry();
  return {
    out: (written[0] ?? {}) as Globals,
    writes: written.length,
  };
}

const parserEntry = (): Promise<unknown> => import("./parser");
const compilerEntry = (): Promise<unknown> => import("./compiler");

const hdml = `
  <hdml-connection
    name="tenant_pg"
    type="postgresql"
    host="example.com"
    user="admin"
    password="s3cret">
  </hdml-connection>
`;

function entryFrom(html: string): ConnectionEntry {
  const conn = parseHDML(html).connections[0];
  return {
    name: conn.name,
    content: bytesToBase64(
      serialize(conn, StructType.ConnectionStruct),
    ),
  };
}

describe("the parser bin entry echoes the plugin version", () => {
  it("carries plugin on a manifest", async () => {
    const { out, writes } = await emit(
      parserEntry,
      { source: hdml },
      PLUGIN,
    );
    expect(writes).toBe(1);
    expect(out.connections).toHaveLength(1);
    expect(out.error).toBeUndefined();
    expect(out.plugin).toBe(PLUGIN);
  });

  it("carries plugin on an error too", async () => {
    const { out } = await emit(parserEntry, { source: "" }, PLUGIN);
    expect(out.error).toBe("empty_source");
    expect(out.plugin).toBe(PLUGIN);
  });

  it("omits plugin when the global is absent", async () => {
    const { out } = await emit(
      parserEntry,
      { source: hdml },
      undefined,
    );
    expect(out.plugin).toBeUndefined();
    expect(JSON.stringify(out)).not.toContain("plugin");
  });
});

describe("the compiler bin entry echoes the plugin version", () => {
  it("carries plugin on a result", async () => {
    const { out, writes } = await emit(
      compilerEntry,
      {
        output: "connection",
        connections: [entryFrom(hdml)],
        env: {},
      },
      PLUGIN,
    );
    expect(writes).toBe(1);
    expect(out.result).toHaveLength(3);
    expect(out.error).toBeUndefined();
    expect(out.plugin).toBe(PLUGIN);
  });

  it("carries plugin on an error too", async () => {
    const { out } = await emit(
      compilerEntry,
      { output: "nope" },
      PLUGIN,
    );
    expect(out.error).toBe("invalid_output");
    expect(out.plugin).toBe(PLUGIN);
  });
});

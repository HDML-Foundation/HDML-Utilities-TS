// @author Artem Lytvynov
// @copyright Artem Lytvynov
// @license Apache-2.0
//
// 004 compiler bin entry. Reads the compiler envelope from stdin,
// dispatches on `output`, and writes the result to stdout. The
// `connection` (B), `source`, and `sql` (C) modes are implemented;
// `effective` (D) lands later. Resolves @hdml/* from globalThis
// (provided by the Javy plugin): a broken hdio-javy-core link leaves
// these undefined and throws at _start, so the link is load-bearing.
// The `sql`/`source` modes also pull @hdml/parser (DOM round-trip).

import type { readJson, writeJson } from "./index";
import type {
  serialize,
  deserialize,
  structurize,
  StructType,
} from "@hdml/buffer";
import type { base64ToBytes } from "@hdml/hash";
import type {
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
  getModelSQL,
  getFrameSQL,
} from "@hdml/stringifier";
import type { parseHTML, parseHDML } from "@hdml/parser";
import { CompilerInput } from "./compileConnections";
import { compile } from "./compile";

const _export = globalThis as unknown as {
  "@hdml/hooks": {
    readJson: typeof readJson;
    writeJson: typeof writeJson;
  };
  "@hdml/buffer": {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
    structurize: typeof structurize;
    StructType: typeof StructType;
  };
  "@hdml/hash": { base64ToBytes: typeof base64ToBytes };
  "@hdml/stringifier": {
    getConnectionSQLs: typeof getConnectionSQLs;
    getModelHTML: typeof getModelHTML;
    getFrameHTML: typeof getFrameHTML;
    getModelSQL: typeof getModelSQL;
    getFrameSQL: typeof getFrameSQL;
  };
  "@hdml/parser": {
    parseHTML: typeof parseHTML;
    parseHDML: typeof parseHDML;
  };
  env?: Record<string, string>;
  // The plugin's own version string, a hand-maintained literal at
  // `src/lib.rs:48` of HDIO-Javy-Plugin. Optional because an older
  // plugin does not set it, and that absence must be readable rather
  // than fatal -- see the `plugin` echo below.
  "@hdml/version"?: string;
};

const { readJson: read, writeJson: write } = _export["@hdml/hooks"];
const {
  serialize: ser,
  deserialize: des,
  structurize: struct,
  StructType: structType,
} = _export["@hdml/buffer"];
const { base64ToBytes: fromBase64 } = _export["@hdml/hash"];
const {
  getConnectionSQLs: connSQLs,
  getModelHTML: modelHTML,
  getFrameHTML: frameHTML,
  getModelSQL: modelSQL,
  getFrameSQL: frameSQL,
} = _export["@hdml/stringifier"];
const { parseHTML: parseHtml, parseHDML: parseHdml } =
  _export["@hdml/parser"];

const input = read<CompilerInput>();

// Expose env for any @hdml/* internals that read it (RFC 002 §4.2);
// the connection branch injects ${env.*} explicitly upstream.
_export.env = input?.env ?? {};

const result = compile(
  {
    deserialize: des,
    serialize: ser,
    structurize: struct,
    base64ToBytes: fromBase64,
    getConnectionSQLs: connSQLs,
    getModelHTML: modelHTML,
    getFrameHTML: frameHTML,
    getModelSQL: modelSQL,
    getFrameSQL: frameSQL,
    parseHTML: parseHtml,
    parseHDML: parseHdml,
    StructType: structType,
  },
  input ?? {},
);

// A4's version echo (RFC 019/002 §4.6, specified there once and
// cited from RFC 019/001 §8.5). A predefined module's import surface
// carries NO version and NO hash -- it imports exactly
// `hdio-javy-core::{cabi_realloc, invoke, memory}`, and the plugin's
// only identity marker is the custom section `import_namespace`
// holding the bare string `hdio-javy-core`. So a module built
// against plugin A and run against plugin B silently binds to B's
// globals: measured by execution, byte-identical output, exit 0. The
// echo is what makes that visible.
//
// ⚠ The FIELD is `plugin`; the GLOBAL is `@hdml/version`. The two
// names differ deliberately -- the Go side reads it as
// `Plugin string` tagged `json:"plugin,omitempty"` -- and nothing in
// this repo catches a mix-up, because the compare is step 24's.
//
// ★ It is spread onto the OUTERMOST layer here, at the bin entry,
// rather than inside the five `compile*` branches: `compile` alone
// dispatches to four of them plus an `invalid_output` default, and
// each branch has error returns of its own, so one site here covers
// every shape uniformly and makes step 24's compare total over every
// response instead of conditional on success. A skewed plugin that
// FAILS is exactly the case you most want versioned (C153, D11).
// An absent global leaves `plugin` undefined, which `JSON.stringify`
// drops -- the `omitempty` the Go side already expects.
write({ ...result, plugin: _export["@hdml/version"] });

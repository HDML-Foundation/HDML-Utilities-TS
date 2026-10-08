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
// The entry also owns the HDQL diagnostic sink and guarantees the
// `diagnostics` field on every response shape -- see the write below.

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
import type {
  parseHTML,
  parseHDML,
  HdqlDiagnostic,
} from "@hdml/parser";
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

// Declared BEFORE the call so it is in scope in the write literal
// below -- the same reason `buildManifest` declares its sink ahead of
// its `try`. `compile` forwards it to the `sql` branch and to nothing
// else; see `compile`'s docblock for why the other three modes cannot
// contribute an entry.
const diagnostics: HdqlDiagnostic[] = [];

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
  diagnostics,
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
//
// ★ `diagnostics` is spread here for the SAME reason and at the SAME
// site, and the placement is the whole point of it (RFC 019/002 §2.3,
// A3): the post-019 envelope is the floor, so an ABSENT set means a
// skewed bundle rather than "this version has nothing to say". If any
// one of the five return shapes omitted the key, a correctly paired
// bundle would read as skewed on that shape -- so the guarantee has
// to be total, and one site is the only way it can be. `[]` survives
// `JSON.stringify` (unlike an undefined `plugin`), which is exactly
// the asymmetry the floor needs: the version echo may be absent, the
// diagnostic set may not.
//
// ⚠ It is spread AFTER `...result` deliberately. No branch sets the
// key today; if one ever does, the sink -- which is what the parse
// actually appended to -- must win over a branch's local guess.
//
// ⚠⚠ The shape is FLAT and the anchor member is spelled `column`:
// `drainDiagnostics` returns `{code, severity, message, path, line,
// column, offset}` with `null` rather than an omitted key, and the Go
// reader follows the wire (019 step 26's C231 -- a nested `anchor`
// object unmarshals SUCCESSFULLY into a zero value and silently
// discards every location, so the mismatch has no error value).
// RFC 019/002 §2.1's nested sketch is the stale document; this is the
// contract, and 022 is written against it.
write({
  ...result,
  diagnostics,
  plugin: _export["@hdml/version"],
});

// @author Artem Lytvynov
// @copyright Artem Lytvynov
// @license Apache-2.0
//
// 004 parser bin entry. Reads { source } from stdin and emits the
// RFC 004 §3.1 manifest (or a structured error) to stdout. Resolves
// @hdml/* from globalThis (provided by the Javy plugin): a broken
// hdio-javy-core link leaves these undefined and throws at _start,
// keeping the link load-bearing rather than a silent dead import.

import type { readJson, writeJson } from "./index";
import type { parseHDML } from "@hdml/parser";
import type { serialize, StructType } from "@hdml/buffer";
import type { bytesToBase64 } from "@hdml/hash";
import { buildManifest } from "./buildManifest";

const _export = globalThis as unknown as {
  "@hdml/hooks": {
    readJson: typeof readJson;
    writeJson: typeof writeJson;
  };
  "@hdml/parser": { parseHDML: typeof parseHDML };
  "@hdml/buffer": {
    serialize: typeof serialize;
    StructType: typeof StructType;
  };
  "@hdml/hash": { bytesToBase64: typeof bytesToBase64 };
  // The plugin's own version string, a hand-maintained literal at
  // `src/lib.rs:48` of HDIO-Javy-Plugin. Optional because an older
  // plugin does not set it, and that absence must be readable rather
  // than fatal -- see the `plugin` echo below.
  "@hdml/version"?: string;
};

const { readJson: read, writeJson: write } = _export["@hdml/hooks"];
const { parseHDML: parse } = _export["@hdml/parser"];
const { serialize: ser, StructType: structType } =
  _export["@hdml/buffer"];
const { bytesToBase64: toBase64 } = _export["@hdml/hash"];

const input = read<{ source?: string }>();
const result = buildManifest(
  {
    parseHDML: parse,
    serialize: ser,
    bytesToBase64: toBase64,
    StructType: structType,
  },
  input?.source ?? "",
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
// rather than inside `buildManifest`: that function has four return
// sites and three of them are errors, so one site here covers every
// shape uniformly and makes step 24's compare total over every
// response instead of conditional on success. A skewed plugin that
// FAILS is exactly the case you most want versioned (C153, D11).
// An absent global leaves `plugin` undefined, which `JSON.stringify`
// drops -- the `omitempty` the Go side already expects.
write({ ...result, plugin: _export["@hdml/version"] });

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
};

const { readJson: read, writeJson: write } = _export["@hdml/hooks"];
const { parseHDML: parse } = _export["@hdml/parser"];
const { serialize: ser, StructType: structType } =
  _export["@hdml/buffer"];
const { bytesToBase64: toBase64 } = _export["@hdml/hash"];

const input = read<{ source?: string }>();
write(
  buildManifest(
    {
      parseHDML: parse,
      serialize: ser,
      bytesToBase64: toBase64,
      StructType: structType,
    },
    input?.source ?? "",
  ),
);

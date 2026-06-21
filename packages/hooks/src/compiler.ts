// @author Artem Lytvynov
// @copyright Artem Lytvynov
// @license Apache-2.0
//
// 004 compiler bin entry. Reads the compiler envelope from stdin,
// dispatches on `output`, and writes the result to stdout. Slice B
// implements only the `connection` mode (find-drop-create catalog
// DDL with ${env.*} injection); source/sql (C) and effective (D)
// land later. Resolves @hdml/* from globalThis (provided by the Javy
// plugin): a broken hdio-javy-core link leaves these undefined and
// throws at _start, keeping the link load-bearing.

import type { readJson, writeJson } from "./index";
import type {
  serialize,
  deserialize,
  structurize,
  StructType,
} from "@hdml/buffer";
import type { base64ToBytes } from "@hdml/hash";
import type { getConnectionSQLs } from "@hdml/stringifier";
import { compile, CompilerInput } from "./compileConnections";

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
  };
  env?: Record<string, string>;
};

const { readJson: read, writeJson: write } = _export["@hdml/hooks"];
const {
  serialize: ser,
  deserialize: des,
  structurize: struct,
  StructType: structType,
} = _export["@hdml/buffer"];
const { base64ToBytes: fromBase64 } = _export["@hdml/hash"];
const { getConnectionSQLs: connSQLs } = _export["@hdml/stringifier"];

const input = read<CompilerInput>();

// Expose env for any @hdml/* internals that read it (RFC 002 §4.2);
// the connection branch injects ${env.*} explicitly upstream.
_export.env = input?.env ?? {};

write(
  compile(
    {
      deserialize: des,
      serialize: ser,
      structurize: struct,
      base64ToBytes: fromBase64,
      getConnectionSQLs: connSQLs,
      StructType: structType,
    },
    input ?? {},
  ),
);

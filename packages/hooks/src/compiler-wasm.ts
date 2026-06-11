// @author Artem Lytvynov
// @copyright Artem Lytvynov
// @license Apache-2.0
//
// 003 STUB. See parser-wasm.ts. The real { docs, root, … } →
// { sql, columns, connections } body + column walker land in
// project 004.

import type { readString, writeString } from "./index";
import type { md5 } from "@hdml/hash";

const _export = globalThis as unknown as {
  "@hdml/hooks": {
    readString: typeof readString;
    writeString: typeof writeString;
  };
  "@hdml/hash": { md5: typeof md5 };
};

const { readString: read, writeString: write } =
  _export["@hdml/hooks"];
const { md5: hash } = _export["@hdml/hash"];

write(`hdml_compiler:stub:${hash(read())}`);

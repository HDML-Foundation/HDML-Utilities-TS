// @author Artem Lytvynov
// @copyright Artem Lytvynov
// @license Apache-2.0
//
// 003 STUB. Proves the distribution chain (build → ship → fetch
// → embed → link → instantiate), not real parsing. Real body
// lands in 004. References plugin-provided globals directly: a
// broken hdio-javy-core link → md5 is undefined → _start throws.
// That makes the link load-bearing rather than a dead import that
// bundles silently.

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

write(`hdml_parser:stub:${hash(read())}`);

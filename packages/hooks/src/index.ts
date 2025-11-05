/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { readString } from "./io/readString";
import { readJson } from "./io/readJson";
import { readUint8Array } from "./io/readUint8Array";
import { writeString } from "./io/writeString";
import { writeJson } from "./io/writeJson";
import { writeUint8Array } from "./io/writeUint8Array";

export {
  readString,
  readJson,
  readUint8Array,
  writeString,
  writeJson,
  writeUint8Array,
};

const _export = globalThis as unknown as {
  "@hdml/hooks": {
    readString: typeof readString;
    readJson: typeof readJson;
    readUint8Array: typeof readUint8Array;
    writeString: typeof writeString;
    writeJson: typeof writeJson;
    writeUint8Array: typeof writeUint8Array;
  };
};

_export["@hdml/hooks"] = {
  readString,
  readJson,
  readUint8Array,
  writeString,
  writeJson,
  writeUint8Array,
};

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { md5 } from "./md5";
import { uid } from "./uid";
import { hashify } from "./hashify";
import { hashtime } from "./hashtime";
import { parsetime } from "./parsetime";

export { md5 } from "./md5";
export { uid } from "./uid";
export { hashify } from "./hashify";
export { hashtime } from "./hashtime";
export { parsetime } from "./parsetime";

const _export = globalThis as unknown as {
  "@hdml/hash": {
    md5: typeof md5;
    uid: typeof uid;
    hashify: typeof hashify;
    hashtime: typeof hashtime;
    parsetime: typeof parsetime;
  };
};

_export["@hdml/hash"] = {
  md5,
  uid,
  hashify,
  hashtime,
  parsetime,
};

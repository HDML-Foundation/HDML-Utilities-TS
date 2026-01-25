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
import { bytesToBase64 } from "./bytesToBase64";
import { base64ToBytes } from "./base64ToBytes";

export { md5 } from "./md5";
export { uid } from "./uid";
export { hashify } from "./hashify";
export { hashtime } from "./hashtime";
export { parsetime } from "./parsetime";
export { bytesToBase64 } from "./bytesToBase64";
export { base64ToBytes } from "./base64ToBytes";

const _export = globalThis as unknown as {
  "@hdml/hash": {
    md5: typeof md5;
    uid: typeof uid;
    hashify: typeof hashify;
    hashtime: typeof hashtime;
    parsetime: typeof parsetime;
    bytesToBase64: typeof bytesToBase64;
    base64ToBytes: typeof base64ToBytes;
  };
};

_export["@hdml/hash"] = {
  md5,
  uid,
  hashify,
  hashtime,
  parsetime,
  bytesToBase64,
  base64ToBytes,
};

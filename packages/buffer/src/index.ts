/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { serialize } from "./serialize";
import { deserialize } from "./deserialize";
import { structurize } from "./structurize";
import { fileifize } from "./fileifize";
export { serialize } from "./serialize";
export { deserialize } from "./deserialize";
export { structurize } from "./structurize";
export { fileifize } from "./fileifize";
export { StructType } from "./StructType";
export type { FileifizeResult } from "./fileifize";

const _export = globalThis as unknown as {
  "@hdml/buffer": {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
    structurize: typeof structurize;
    fileifize: typeof fileifize;
  };
};

_export["@hdml/buffer"] = {
  serialize,
  deserialize,
  structurize,
  fileifize,
};

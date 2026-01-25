/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { serialize } from "./serialize";
import { deserialize } from "./deserialize";
import { structurize } from "./structurize";
import { StructType } from "./StructType";
export { serialize } from "./serialize";
export { deserialize } from "./deserialize";
export { structurize } from "./structurize";
export { StructType } from "./StructType";

const _export = globalThis as unknown as {
  "@hdml/buffer": {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
    structurize: typeof structurize;
    StructType: typeof StructType;
  };
};

_export["@hdml/buffer"] = {
  serialize,
  deserialize,
  structurize,
  StructType,
};

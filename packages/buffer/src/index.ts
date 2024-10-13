/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { serialize } from "./serialize";
import { deserialize } from "./deserialize";
export { serialize } from "./serialize";
export { deserialize } from "./deserialize";

const _export = globalThis as unknown as {
  "@hdml/buffer": {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
  };
};

_export["@hdml/buffer"] = {
  serialize,
  deserialize,
};

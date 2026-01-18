/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { serialize } from "./serialize";
import { structurize } from "./structurize";
export { serialize } from "./serialize";
export { structurize } from "./structurize";

const _export = globalThis as unknown as {
  "@hdml/buffer": {
    serialize: typeof serialize;
    structurize: typeof structurize;
  };
};

_export["@hdml/buffer"] = {
  serialize,
  structurize,
};

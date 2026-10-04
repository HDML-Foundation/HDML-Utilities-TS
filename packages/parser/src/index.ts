/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { parseHDML } from "./parseHDML";
import { parseHTML } from "./parseHTML";
import { sortFrames } from "./sortFrames";
export { parseHDML } from "./parseHDML";
export { parseHTML } from "./parseHTML";
export { sortFrames } from "./sortFrames";
export { HTMLElement } from "node-html-parser";
// `Manifest.diagnostics` lives in `@hdml/hooks`, so this type
// crosses a package boundary. Type-only, so the runtime surface
// `globalThis["@hdml/parser"]` stays at three members.
export type { HdqlDiagnostic } from "./diagnostics";

const _export = globalThis as unknown as {
  "@hdml/parser": {
    parseHDML: typeof parseHDML;
    parseHTML: typeof parseHTML;
    sortFrames: typeof sortFrames;
  };
};

_export["@hdml/parser"] = {
  parseHDML,
  parseHTML,
  sortFrames,
};

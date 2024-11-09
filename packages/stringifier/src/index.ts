/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { getConnectionSQLs, getConnectionHTML } from "./connection";
import { getModelSQL, getModelHTML } from "./model";
import { getFrameSQL, getFrameHTML } from "./frame";

export { getConnectionSQLs, getConnectionHTML } from "./connection";
export { getModelSQL, getModelHTML } from "./model";
export { getFrameSQL, getFrameHTML } from "./frame";

const _export = globalThis as unknown as {
  "@hdml/stringifier": {
    getConnectionSQLs: typeof getConnectionSQLs;
    getConnectionHTML: typeof getConnectionHTML;
    getModelSQL: typeof getModelSQL;
    getModelHTML: typeof getModelHTML;
    getFrameSQL: typeof getFrameSQL;
    getFrameHTML: typeof getFrameHTML;
  };
};

_export["@hdml/stringifier"] = {
  getConnectionSQLs,
  getConnectionHTML,
  getModelSQL,
  getModelHTML,
  getFrameSQL,
  getFrameHTML,
};

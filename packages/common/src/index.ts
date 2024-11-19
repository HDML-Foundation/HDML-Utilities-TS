/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as arrow from "apache-arrow";
import * as uuid from "uuid";
import * as throdeb from "throttle-debounce";

export * as arrow from "apache-arrow";
export * as uuid from "uuid";
export * as throdeb from "throttle-debounce";

const _export = globalThis as unknown as {
  "@hdml/common": {
    arrow: typeof arrow;
    uuid: typeof uuid;
    throdeb: typeof throdeb;
  };
};

_export["@hdml/common"] = {
  arrow,
  uuid,
  throdeb,
};

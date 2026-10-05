/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as arrow from "apache-arrow";
import * as uuid from "uuid";
import * as throdeb from "throttle-debounce";

export * as arrow from "apache-arrow";

/**
 * Pinned `uuid` re-export. Only `v1` and `v5` are ever called in
 * this monorepo, from `@hdml/hash`'s `uid.ts:44`
 * (`v5(v1(), v1())`) — nothing calls `v3`/`v4`/`v6`/`v7`,
 * `validate`, `parse` or `stringify`.
 *
 * This bundle is embedded in `hdio.wasm` at **Rust compile time**
 * (`HDIO-Javy-Plugin/src/hdml/mod.rs:13` `include_str!`s
 * `bin/index.min.js`), so `npm ci` in that repo cannot change which
 * `uuid` it carries — the published tarball has it inlined. A major
 * bump must therefore be **pre-flighted through QuickJS before the
 * publish**: rebuild this package's `bin`, copy it over the Javy
 * repo's installed copy, rebuild the plugin and run the instantiate
 * probe. `^11.1.1` was cleared that way (RFC 019/001 §7.5).
 */
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

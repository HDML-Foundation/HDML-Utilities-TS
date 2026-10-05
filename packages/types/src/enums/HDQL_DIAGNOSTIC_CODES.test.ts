/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDQL_DIAGNOSTIC_CODES } from "./HDQL_DIAGNOSTIC_CODES";
import { FIELD_ATTRS_LIST } from "./FIELD_ATTRS_LIST";

/**
 * ★ **Gate (d)** (019 step 11). The two enums item 3 widens, each
 * pinned by count AND by member, because a count alone cannot tell
 * an addition from a rename.
 */
describe("HDQL_DIAGNOSTIC_CODES", () => {
  it("has eleven members after item 3's warning", () => {
    expect(Object.keys(HDQL_DIAGNOSTIC_CODES).length).toBe(11);
  });

  it("carries `misplaced-key`, the one warning", () => {
    expect(HDQL_DIAGNOSTIC_CODES.MISPLACED_KEY).toBe("misplaced-key");
  });

  it("every code is a unique kebab-case string", () => {
    const values = Object.values(HDQL_DIAGNOSTIC_CODES);
    expect(new Set(values).size).toBe(values.length);
    for (const value of values) {
      expect(value).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it("is disjoint from HDVL's code space", () => {
    // ★ RFC 019/002 §2.2: HDVL's `DiagnosticCode`/`WarningCode`
    // live in `@hdml/components` and nothing keeps the two apart
    // but this disjointness. HDVL's are `E##`/`W##`; a code here
    // that matched that shape would collide.
    for (const value of Object.values(HDQL_DIAGNOSTIC_CODES)) {
      expect(value).not.toMatch(/^[EW]\d+$/);
    }
  });
});

describe("FIELD_ATTRS_LIST", () => {
  it("has fourteen members after item 3's `key`", () => {
    expect(Object.keys(FIELD_ATTRS_LIST).length).toBe(14);
  });

  it("carries `key`", () => {
    expect(FIELD_ATTRS_LIST.KEY).toBe("key");
  });

  it("keeps the seven FieldStruct members in schema order", () => {
    // ★ The first seven mirror `FieldStruct`'s members and `key`
    // is the eighth, so the enum reads in the same order as
    // `document.Field.fbs`. The remaining six are data-type
    // parameters and have no struct member of their own.
    expect(Object.values(FIELD_ATTRS_LIST).slice(0, 8)).toEqual([
      "name",
      "description",
      "origin",
      "clause",
      "type",
      "aggregation",
      "order",
      "key",
    ]);
  });
});

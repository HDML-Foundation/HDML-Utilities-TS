/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import {
  TableTypeEnum,
  HDOMStruct,
  ModelStruct,
} from "@hdml/schemas";
import { parseHDML } from "@hdml/parser";
import { serialize, structurize, StructType } from "@hdml/buffer";
import { getModelHTML } from "@hdml/stringifier";
import { HDOM, Table } from "@hdml/types";

/**
 * `@hdml/hooks` is the only workspace that depends on both
 * `@hdml/parser` and `@hdml/stringifier`, so it is the only place the
 * two halves of the `hdml-dataset` rename can be checked against each
 * other. `@hdml/stringifier` has no `@hdml/parser` dependency and
 * adding one would change `release.sh`'s rewrite count, so the
 * round-trip lives here rather than in `model.test.ts` (019 step 07).
 *
 * The chain runs through `getModelHTML`, which is the public entry
 * point; `getTableHTML` is module-local and not re-exported from
 * `@hdml/stringifier`'s `index.ts`. `getModelHTML` calls it for every
 * dataset, so the same two emission lines are exercised through the
 * surface a real consumer actually has.
 *
 * The assertion that matters is the whole chain: an emitter and a
 * parser that disagree about the tag name each pass their own suite,
 * and only a round-trip sees that they no longer meet.
 */
function roundTrip(hdml: string): HDOM {
  const struct = structurize(
    serialize(parseHDML(hdml)),
    StructType.HDOMStruct,
  ) as HDOMStruct;
  const model = <ModelStruct>struct.models(0);
  return parseHDML(getModelHTML(model));
}

function soleDataset(hdom: HDOM): Table {
  expect(hdom.models.length).toBe(1);
  expect(hdom.models[0].tables.length).toBe(1);
  return hdom.models[0].tables[0];
}

describe("the hdml-dataset round trip", () => {
  it("survives emit then parse, as a table", () => {
    const ds = soleDataset(
      roundTrip(
        '<hdml-model name="model"><hdml-dataset name="ds" type="table" identifier="`c`.`s`.`t`"><hdml-field name="f"></hdml-field></hdml-dataset></hdml-model>',
      ),
    );

    expect(ds.name).toBe("ds");
    expect(ds.type).toBe(TableTypeEnum.Table);
    expect(ds.identifier).toBe('"c"."s"."t"');
    expect(ds.fields.length).toBe(1);
  });

  it("survives emit then parse, as a query", () => {
    const ds = soleDataset(
      roundTrip(
        '<hdml-model name="model"><hdml-dataset name="ds" type="query" identifier="select 1"><hdml-field name="f"></hdml-field></hdml-dataset></hdml-model>',
      ),
    );

    expect(ds.name).toBe("ds");
    expect(ds.type).toBe(TableTypeEnum.Query);
    expect(ds.identifier).toBe("select 1");
  });

  it("emits the tag the parser reads", () => {
    const struct = structurize(
      serialize(
        parseHDML(
          '<hdml-model name="model"><hdml-dataset name="ds" type="table" identifier="`c`.`s`.`t`"></hdml-dataset></hdml-model>',
        ),
      ),
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const html = getModelHTML(<ModelStruct>struct.models(0));

    expect(html).toContain("<hdml-dataset ");
    expect(html).toContain("</hdml-dataset>");
    expect(html).not.toContain("hdml-table");
  });

  it("parses a type=table dataset, whose enum value is 0", () => {
    // `TableTypeEnum.Table === 0`, so `getTableData`'s guard must
    // read `type !== null` and never `type` (RFC 019/001 §3.4). A
    // truthiness test would reject every table-kind dataset while
    // every `type="query"` case above kept passing.
    expect(TableTypeEnum.Table).toBe(0);

    const ds = soleDataset(
      parseHDML(
        '<hdml-model name="model"><hdml-dataset name="ds" type="table" identifier="`c`.`s`.`t`"></hdml-dataset></hdml-model>',
      ),
    );

    expect(ds.type).toBe(TableTypeEnum.Table);
  });
});

/**
 * ★ **Gate (b) — item 3's `key` survives every hop** (019 step 11).
 *
 * This lives beside the dataset round trip for the same reason that
 * one does: `@hdml/hooks` is the only workspace depending on both
 * `@hdml/parser` and `@hdml/stringifier`, so it is the only place
 * the emitter and the parser can be checked against each other.
 *
 * ★ **Why the whole chain and not a unit test.** Item 3 adds `key`
 * to seven hand-maintained legs. Six of them can be right while the
 * seventh -- `getFieldHTML`'s emit -- is missing, and NOTHING else
 * goes red: `@hdml/buffer`'s 88 tests round-trip through
 * `objectify`, never through HTML, and `@hdml/stringifier`'s 264
 * assert HTML strings whose fixtures carry no `key` at all. The
 * `description` case below is that exact failure, already shipped.
 */
describe("the `key` round trip", () => {
  const MODEL =
    '<hdml-model name="model">' +
    '<hdml-dataset name="ds" type="table" identifier="`c`.`s`.`t`">' +
    '<hdml-field name="id" key="pk"></hdml-field>' +
    '<hdml-field name="plain"></hdml-field>' +
    "</hdml-dataset></hdml-model>";

  it("carries a named key group through the whole chain", () => {
    const ds = soleDataset(roundTrip(MODEL));

    expect(ds.fields.length).toBe(2);
    // ★ The assertion the emit line exists for.
    expect(ds.fields[0].key).toBe("pk");
  });

  it("emits `key` as an attribute the parser reads back", () => {
    const struct = structurize(
      serialize(parseHDML(MODEL)),
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const html = getModelHTML(<ModelStruct>struct.models(0));

    expect(html).toContain('key="pk"');
  });

  it("leaves an ABSENT `key` absent, and emits no attribute", () => {
    // ★ `key` is a `string`, so "not declared" is `null` and is
    // distinguishable from any declared value -- unlike a `bool`,
    // whose `false` default would be indistinguishable from
    // absence (RFC 019/001 §4.4). The second field proves it.
    const ds = soleDataset(roundTrip(MODEL));

    expect(ds.fields[1].name).toBe("plain");
    expect(ds.fields[1].key).toBeNull();

    const struct = structurize(
      serialize(parseHDML(MODEL)),
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const html = getModelHTML(<ModelStruct>struct.models(0));

    // Exactly one `key=` in the document: the first field's.
    expect(html.match(/key="/g)?.length).toBe(1);
    expect(html).toContain('<hdml-field name="plain"');
    expect(html).not.toContain('key=""');
  });

  it("still loses `description` — a KNOWN, pre-019 bug", () => {
    // ★ Asserted so the loss stays known rather than being
    // rediscovered. `git grep DESCRIPTION -- packages/stringifier`
    // returns ZERO hits: no stringifier emits a `description` for
    // any element, so every round trip drops every description in
    // the document (RFC 019/001 §4.5, measured).
    //
    // ⚠ This test passing is NOT a good thing. It is the negative
    // control for the emit line above: it documents what happens
    // to a field whose emit line was never written, which is
    // precisely the failure mode `key` was at risk of. Fixing
    // `description` is a named successor, and when it is fixed
    // THIS TEST MUST BE INVERTED, not deleted.
    const src = MODEL.replace(
      'name="plain"',
      'name="plain" description="FIELD DESC"',
    );

    // The parse itself is fine -- the loss is in the emitter.
    expect(soleDataset(parseHDML(src)).fields[1].description).toBe(
      "FIELD DESC",
    );

    const ds = soleDataset(roundTrip(src));
    expect(ds.fields[1].description).toBeNull();
  });
});

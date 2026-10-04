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

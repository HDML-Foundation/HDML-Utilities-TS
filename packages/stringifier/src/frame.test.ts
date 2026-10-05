/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { Field, HDOM } from "@hdml/types";
import {
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  FilterOperatorEnum,
  FilterTypeEnum,
  FilterNameEnum,
} from "@hdml/schemas";
import { serialize, structurize, StructType } from "@hdml/buffer";
import { FrameStruct, HDOMStruct } from "@hdml/schemas";
import { getFrameSQL, getFrameHTML } from "./frame";

let lvl1: string = "";
let lvl2: string = "";
let lvl3: string = "";

describe("The `getFrameSQL` and `getFrameHTML` functions", () => {
  it("should stringify frame with cached source", () => {
    const hdom: HDOM = {
      connections: [],
      models: [],
      frames: [
        {
          name: "frame",
          description: null,
          source: "source",
          fields: [
            {
              name: "F1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: [],
          sort_by: [],
          split_by: [],
          limit: 100,
          offset: 0,
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const frame = struct.frames(0)!;
    lvl3 = getFrameSQL(frame, { name: "cash", sql: "" }, 2);
    const html = getFrameHTML(frame, 2);
    expect(lvl3).toBe(
      '    select\n      "F1" as "F1"\n    from\n      "cash"\n    offset 0\n    limit 100\n',
    );
    expect(html).toBe(
      '    <hdml-frame name="frame" source="source" offset="0" limit="100">\n      <hdml-field name="F1"></hdml-field>\n      <hdml-filter-by>\n        <hdml-connective operator="none">\n        </hdml-connective>\n      </hdml-filter-by>\n    </hdml-frame>\n',
    );
  });

  it("should stringify frame with sub-query", () => {
    const hdom: HDOM = {
      connections: [],
      models: [],
      frames: [
        {
          name: "frame",
          description: null,
          source: "source",
          fields: [
            {
              name: "F1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: [],
          sort_by: [],
          split_by: [],
          limit: 100,
          offset: 0,
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const frame = struct.frames(0)!;
    lvl2 = getFrameSQL(frame, { name: "sub", sql: lvl3 }, 1);
    const html = getFrameHTML(frame, 1);
    expect(lvl2).toBe(
      '  with "sub" as (\n    select\n      "F1" as "F1"\n    from\n      "cash"\n    offset 0\n    limit 100\n  )\n  select\n    "F1" as "F1"\n  from\n    "sub"\n  offset 0\n  limit 100\n',
    );
    expect(html).toBe(
      '  <hdml-frame name="frame" source="source" offset="0" limit="100">\n    <hdml-field name="F1"></hdml-field>\n    <hdml-filter-by>\n      <hdml-connective operator="none">\n      </hdml-connective>\n    </hdml-filter-by>\n  </hdml-frame>\n',
    );
  });

  it("should stringify frame with two sub-queries", () => {
    const hdom: HDOM = {
      connections: [],
      models: [],
      frames: [
        {
          name: "frame",
          description: null,
          source: "source",
          fields: [
            {
              name: "F1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: [],
          sort_by: [],
          split_by: [],
          limit: 100,
          offset: 0,
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const frame = struct.frames(0)!;
    lvl1 = getFrameSQL(frame, { name: "mid", sql: lvl2 }, 0);
    const html = getFrameHTML(frame, 0);
    expect(lvl1).toBe(
      'with "mid" as (\n  with "sub" as (\n    select\n      "F1" as "F1"\n    from\n      "cash"\n    offset 0\n    limit 100\n  )\n  select\n    "F1" as "F1"\n  from\n    "sub"\n  offset 0\n  limit 100\n)\nselect\n  "F1" as "F1"\nfrom\n  "mid"\noffset 0\nlimit 100\n',
    );
    expect(html).toBe(
      '<hdml-frame name="frame" source="source" offset="0" limit="100">\n  <hdml-field name="F1"></hdml-field>\n  <hdml-filter-by>\n    <hdml-connective operator="none">\n    </hdml-connective>\n  </hdml-filter-by>\n</hdml-frame>\n',
    );
  });

  it("should sort fields while stringifying frame", () => {
    const hdom: HDOM = {
      connections: [],
      models: [],
      frames: [
        {
          name: "frame",
          description: null,
          source: "source",
          fields: [
            {
              name: "F3",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F2",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F2",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: [],
          sort_by: [],
          split_by: [],
          limit: 100,
          offset: 0,
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const frame = struct.frames(0)!;
    const sql = getFrameSQL(frame, { name: "cash", sql: "" });
    const html = getFrameHTML(frame);
    expect(sql).toBe(
      'select\n  "F1" as "F1",\n  "F2" as "F2",\n  "F2" as "F2",\n  "F3" as "F3"\nfrom\n  "cash"\noffset 0\nlimit 100\n',
    );
    expect(html).toBe(
      '<hdml-frame name="frame" source="source" offset="0" limit="100">\n  <hdml-field name="F1"></hdml-field>\n  <hdml-field name="F2"></hdml-field>\n  <hdml-field name="F2"></hdml-field>\n  <hdml-field name="F3"></hdml-field>\n  <hdml-filter-by>\n    <hdml-connective operator="none">\n    </hdml-connective>\n  </hdml-filter-by>\n</hdml-frame>\n',
    );
  });

  it("should stringify frame with filter block", () => {
    const hdom: HDOM = {
      connections: [],
      models: [],
      frames: [
        {
          name: "frame",
          description: null,
          source: "source",
          fields: [
            {
              name: "F3",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F4",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F2",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          filter_by: {
            type: FilterOperatorEnum.And,
            filters: [
              {
                type: FilterTypeEnum.Named,
                options: {
                  name: FilterNameEnum.Equals,
                  field: '"F1"',
                  values: ["1"],
                },
              },
            ],
            children: [],
          },
          group_by: [],
          sort_by: [],
          split_by: [],
          limit: 100,
          offset: 0,
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const frame = struct.frames(0)!;
    const sql = getFrameSQL(frame, { name: "base", sql: "" });
    const html = getFrameHTML(frame);
    expect(sql).toBe(
      'select\n  "F1" as "F1",\n  "F2" as "F2",\n  "F3" as "F3",\n  "F4" as "F4"\nfrom\n  "base"\nwhere\n  1 = 1\n  and "F1" = 1\noffset 0\nlimit 100\n',
    );
    expect(html).toBe(
      '<hdml-frame name="frame" source="source" offset="0" limit="100">\n  <hdml-field name="F1"></hdml-field>\n  <hdml-field name="F2"></hdml-field>\n  <hdml-field name="F3"></hdml-field>\n  <hdml-field name="F4"></hdml-field>\n  <hdml-filter-by>\n    <hdml-connective operator="and">\n      <hdml-filter type="named" name="equals" field="`F1`" values="1"></hdml-filter>\n    </hdml-connective>\n  </hdml-filter-by>\n</hdml-frame>\n',
    );
  });

  it("should stringify frame with group by block", () => {
    const hdom: HDOM = {
      connections: [],
      models: [],
      frames: [
        {
          name: "frame",
          description: null,
          source: "source",
          fields: [
            {
              name: "F3",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F4",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F2",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: [
            {
              name: "F2",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F3",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          sort_by: [],
          split_by: [],
          limit: 100,
          offset: 0,
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const frame = struct.frames(0)!;
    const sql = getFrameSQL(frame, { name: "base", sql: "" });
    const html = getFrameHTML(frame);
    expect(sql).toBe(
      'select\n  "F1" as "F1",\n  "F2" as "F2",\n  "F3" as "F3",\n  "F4" as "F4"\nfrom\n  "base"\ngroup by\n  2, 3\noffset 0\nlimit 100\n',
    );
    expect(html).toBe(
      '<hdml-frame name="frame" source="source" offset="0" limit="100">\n  <hdml-field name="F1"></hdml-field>\n  <hdml-field name="F2"></hdml-field>\n  <hdml-field name="F3"></hdml-field>\n  <hdml-field name="F4"></hdml-field>\n  <hdml-filter-by>\n    <hdml-connective operator="none">\n    </hdml-connective>\n  </hdml-filter-by>\n  <hdml-group-by>\n    <hdml-field name="F2"></hdml-field>\n    <hdml-field name="F3"></hdml-field>\n  </hdml-group-by>\n</hdml-frame>\n',
    );
  });

  it("should stringify frame with sort by block", () => {
    const hdom: HDOM = {
      connections: [],
      models: [],
      frames: [
        {
          name: "frame",
          description: null,
          source: "source",
          fields: [
            {
              name: "F3",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F4",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F2",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: [],
          sort_by: [
            {
              name: "F1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
            {
              name: "F4",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
              key: null,
            },
          ],
          split_by: [],
          limit: 100,
          offset: 0,
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;
    const frame = struct.frames(0)!;
    const sql = getFrameSQL(frame, { name: "base", sql: "" });
    const html = getFrameHTML(frame);
    expect(sql).toBe(
      'select\n  "F1" as "F1",\n  "F2" as "F2",\n  "F3" as "F3",\n  "F4" as "F4"\nfrom\n  "base"\norder by\n  1, 4\noffset 0\nlimit 100\n',
    );
    expect(html).toBe(
      '<hdml-frame name="frame" source="source" offset="0" limit="100">\n  <hdml-field name="F1"></hdml-field>\n  <hdml-field name="F2"></hdml-field>\n  <hdml-field name="F3"></hdml-field>\n  <hdml-field name="F4"></hdml-field>\n  <hdml-filter-by>\n    <hdml-connective operator="none">\n    </hdml-connective>\n  </hdml-filter-by>\n  <hdml-sort-by>\n    <hdml-field name="F1"></hdml-field>\n    <hdml-field name="F4"></hdml-field>\n  </hdml-sort-by>\n</hdml-frame>\n',
    );
  });

  // ---- item 15: the auto-add, its `order by` twin, and split_by
  // (RFC 019/001 section 7.2 + section 7.3, A9, D16)

  // `key` is a required member of `Field` since step 11, so the
  // minimal literal is spelled once here rather than in every case.
  const field = (
    name: string,
    extra: Partial<Field> = {},
  ): Field => ({
    name,
    description: null,
    origin: null,
    clause: null,
    type: { type: DataTypeEnum.Unspecified },
    aggregation: AggregationTypeEnum.None,
    order: OrderTypeEnum.None,
    key: null,
    ...extra,
  });

  // the FlatBuffer round trip IS the fixture -- there is no
  // `FrameStruct` helper in the package.
  const frameOf = (
    fields: Field[],
    groupBy: Field[] = [],
    sortBy: Field[] = [],
    splitBy: Field[] = [],
  ): FrameStruct => {
    const hdom: HDOM = {
      connections: [],
      models: [],
      frames: [
        {
          name: "frame",
          description: null,
          source: "source",
          fields,
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: groupBy,
          sort_by: sortBy,
          split_by: splitBy,
          limit: 100,
          offset: 0,
        },
      ],
    };
    const struct = structurize(
      serialize(hdom),
      StructType.HDOMStruct,
    ) as HDOMStruct;
    return struct.frames(0)!;
  };

  const sqlOf = (frame: FrameStruct): string =>
    getFrameSQL(frame, { name: "base", sql: "" });

  it("auto-adds an unmatched group-by key", () => {
    const sql = sqlOf(frameOf([field("a")], [field("month")]));
    // the clause is PRESENT and names an ordinal. There is no
    // empty-join guard: the empty join is unreachable instead.
    expect(sql).toContain("group by\n");
    expect(sql).not.toContain("group by\n  \n");
    expect(sql).toContain('"month" as "month"');
    expect(sql).toBe(
      'select\n  "a" as "a",\n  "month" as "month"\nfrom\n  "base"\ngroup by\n  2\noffset 0\nlimit 100\n',
    );
  });

  it("gives a partial group-by match every ordinal", () => {
    const sql = sqlOf(
      frameOf([field("a"), field("b")], [field("b"), field("month")]),
    );
    // two keys, two ordinals -- NOT the silent `group by 2`, which
    // grouped by the wrong set under HTTP 200
    expect(sql).toContain("group by\n  2, 3\n");
    expect(sql).not.toContain("group by\n  2\n");
    expect(sql).toBe(
      'select\n  "a" as "a",\n  "b" as "b",\n  "month" as "month"\nfrom\n  "base"\ngroup by\n  2, 3\noffset 0\nlimit 100\n',
    );
  });

  it("auto-adds an unmatched sort-by key", () => {
    const sql = sqlOf(
      frameOf([field("a"), field("b")], [], [field("nope")]),
    );
    expect(sql).toContain("order by\n");
    expect(sql).not.toContain("order by\n  \n");
    expect(sql).toContain('"nope" as "nope"');
    expect(sql).toBe(
      'select\n  "a" as "a",\n  "b" as "b",\n  "nope" as "nope"\nfrom\n  "base"\norder by\n  3\noffset 0\nlimit 100\n',
    );
  });

  it("gives a partial sort-by match every ordinal", () => {
    const sql = sqlOf(
      frameOf(
        [field("a"), field("b")],
        [],
        [field("b"), field("nope")],
      ),
    );
    expect(sql).toContain("order by\n  2, 3\n");
    expect(sql).not.toContain("order by\n  2\n");
    expect(sql).toBe(
      'select\n  "a" as "a",\n  "b" as "b",\n  "nope" as "nope"\nfrom\n  "base"\norder by\n  2, 3\noffset 0\nlimit 100\n',
    );
  });

  it("does not re-add a key already declared", () => {
    const frame = frameOf([field("a")], [field("a")]);
    expect(frame.fieldsLength()).toBe(1);
    const sql = sqlOf(frame);
    expect(sql.match(/as "a"/g)?.length).toBe(1);
    expect(sql).toBe(
      'select\n  "a" as "a"\nfrom\n  "base"\ngroup by\n  1\noffset 0\nlimit 100\n',
    );
  });

  it("adds a twice-named group-by key only once", () => {
    const sql = sqlOf(
      frameOf([field("a")], [field("month"), field("month")]),
    );
    // one select entry, two ordinals both naming it
    expect(sql.match(/as "month"/g)?.length).toBe(1);
    expect(sql).toContain("group by\n  2, 2\n");
    expect(sql).toBe(
      'select\n  "a" as "a",\n  "month" as "month"\nfrom\n  "base"\ngroup by\n  2, 2\noffset 0\nlimit 100\n',
    );
  });

  it("adds a group-and-sort key only once", () => {
    const sql = sqlOf(
      frameOf([field("a")], [field("month")], [field("month")]),
    );
    expect(sql.match(/as "month"/g)?.length).toBe(1);
    expect(sql).toContain("group by\n  2\n");
    expect(sql).toContain("order by\n  2\n");
    expect(sql).toBe(
      'select\n  "a" as "a",\n  "month" as "month"\nfrom\n  "base"\ngroup by\n  2\norder by\n  2\noffset 0\nlimit 100\n',
    );
  });

  it("skips a nameless key, adding no select entry", () => {
    const frame = frameOf([field("a")], [field("")]);
    expect(frame.groupByLength()).toBe(1);
    const sql = sqlOf(frame);
    // the name guard matters: `getFrameFieldSQL` returns "" for a
    // nameless field, so an unguarded push would emit an EMPTY
    // select entry -- `select\n  ,\n  "a" as "a"`
    expect(sql).toContain('select\n  "a" as "a"\nfrom');
    expect(sql).not.toContain(",\n  ,");
    expect(sql).not.toContain("select\n  ,");
    // NOTE: a nameless key gets no ordinal, so this is the one
    // shape that still reaches the empty join. The parser cannot
    // build it -- step 09 drops a nameless field as
    // `missing-field-name`, measured -- so it is unreachable from
    // any document, and reachable only from a hand-built struct.
    expect(sql).toBe(
      'select\n  "a" as "a"\nfrom\n  "base"\ngroup by\n  \noffset 0\nlimit 100\n',
    );
  });

  it("ignores a sort-by key's order in the select", () => {
    const frame = frameOf(
      [field("a")],
      [],
      [field("month", { order: OrderTypeEnum.Descending })],
    );
    const sql = sqlOf(frame);
    // `getFrameFieldSQL` does not read `order()`; only
    // `getFieldHTML` does, so the auto-added entry stays plain
    expect(sql).toContain('"month" as "month"');
    expect(sql).not.toContain("desc");
    expect(getFrameHTML(frame)).toContain('order="desc"');
  });

  it("round-trips split-by in the schema's order", () => {
    const frame = frameOf(
      [field("a")],
      [field("g")],
      [field("t")],
      [field("s", { key: "pk" })],
    );
    const html = getFrameHTML(frame);
    expect(html).toContain("<hdml-split-by>");
    // the SCHEMA's order: group_by -> split_by -> sort_by
    expect(html.indexOf("<hdml-group-by>")).toBeLessThan(
      html.indexOf("<hdml-split-by>"),
    );
    expect(html.indexOf("<hdml-split-by>")).toBeLessThan(
      html.indexOf("<hdml-sort-by>"),
    );
    // `key` rides along for free -- the same `getFieldHTML`
    expect(html).toContain('<hdml-field name="s" key="pk">');
    expect(html).toBe(
      '<hdml-frame name="frame" source="source" offset="0" limit="100">\n  <hdml-field name="a"></hdml-field>\n  <hdml-filter-by>\n    <hdml-connective operator="none">\n    </hdml-connective>\n  </hdml-filter-by>\n  <hdml-group-by>\n    <hdml-field name="g"></hdml-field>\n  </hdml-group-by>\n  <hdml-split-by>\n    <hdml-field name="s" key="pk"></hdml-field>\n  </hdml-split-by>\n  <hdml-sort-by>\n    <hdml-field name="t"></hdml-field>\n  </hdml-sort-by>\n</hdml-frame>\n',
    );
  });

  it("gives split-by no SQL meaning", () => {
    const sql = sqlOf(frameOf([field("a")], [], [], [field("s")]));
    // D16: the round-trip lossiness is in scope, the meaning is not
    expect(sql).not.toContain("split");
    expect(sql).toBe(
      'select\n  "a" as "a"\nfrom\n  "base"\noffset 0\nlimit 100\n',
    );
  });

  it("leaves the HTML round trip identity", () => {
    const frame = frameOf([field("a")], [field("month")]);
    // the auto-add is LOCAL to `getFrameSQL`, so the FlatBuffer is
    // untouched and no stored artifact's hash or Merkle name moves
    expect(frame.fieldsLength()).toBe(1);
    const html = getFrameHTML(frame);
    // two `hdml-field`s: the frame's own, and the group-by key.
    // Three would mean the auto-add had reached `getFrameHTML`.
    expect(html.match(/<hdml-field /g)?.length).toBe(2);
    expect(html).toBe(
      '<hdml-frame name="frame" source="source" offset="0" limit="100">\n  <hdml-field name="a"></hdml-field>\n  <hdml-filter-by>\n    <hdml-connective operator="none">\n    </hdml-connective>\n  </hdml-filter-by>\n  <hdml-group-by>\n    <hdml-field name="month"></hdml-field>\n  </hdml-group-by>\n</hdml-frame>\n',
    );
    // and the SQL DOES carry it
    expect(sqlOf(frame)).toContain('"month" as "month"');
  });
});

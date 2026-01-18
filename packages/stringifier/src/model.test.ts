/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDOM } from "@hdml/types";
import {
  TableTypeEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  TableStruct,
  JoinTypeEnum,
  FilterOperatorEnum,
  FilterTypeEnum,
} from "@hdml/schemas";
import { serialize, deserialize } from "@hdml/buffer";
import {
  getTables,
  getTableSQL,
  getModelSQL,
  getTableHTML,
  getModelHTML,
} from "./model";

describe("The `getTables` function", () => {
  it("should objectify empty model", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [],
        },
      ],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const model = struct.models(0)!;
    const tables = getTables(model, []);
    expect(tables).toEqual([]);
  });

  it("should filter out tables without names", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [
            {
              name: "",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
            {
              name: "",
              description: null,
              type: TableTypeEnum.Query,
              identifier: "select\n\t*\nfrom\n\tsubtable",
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
                },
              ],
            },
            {
              name: "",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
          ],
          joins: [],
        },
      ],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const model = struct.models(0)!;
    const tables = getTables(model, []);
    expect(tables).toEqual([]);
  });

  it("should not sort tables with the same names", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [
            {
              name: "T1",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
            {
              name: "T1",
              description: null,
              type: TableTypeEnum.Query,
              identifier: "select\n\t*\nfrom\n\tsubtable",
              fields: [
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
                },
              ],
            },
            {
              name: "T1",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
          ],
          joins: [],
        },
      ],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const model = struct.models(0)!;
    const tables = getTables(model, []);
    expect(tables[0].fields(0)?.name()).toEqual("F1");
    expect(tables[1].fields(0)?.name()).toEqual("F2");
    expect(tables[2].fields(0)?.name()).toEqual("F3");
  });

  it("should sort tables", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [
            {
              name: "T3",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
            {
              name: "T2",
              description: null,
              type: TableTypeEnum.Query,
              identifier: "select\n\t*\nfrom\n\tsubtable",
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
                },
              ],
            },
            {
              name: "T1",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
          ],
          joins: [],
        },
      ],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const model = struct.models(0)!;
    const tables = getTables(model, []);
    expect(tables[0].name()).toEqual("T1");
    expect(tables[1].name()).toEqual("T2");
    expect(tables[2].name()).toEqual("T3");
  });

  it("should return all tables if joins not specified", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [
            {
              name: "T1",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
            {
              name: "T2",
              description: null,
              type: TableTypeEnum.Query,
              identifier: "select\n\t*\nfrom\n\tsubtable",
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
                },
              ],
            },
            {
              name: "T3",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
          ],
          joins: [],
        },
      ],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const model = struct.models(0)!;
    const tables = getTables(model, []);
    expect(tables.length).toBe(3);
  });

  it("should returns tables that are specified in joins", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [
            {
              name: "T1",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
            {
              name: "T2",
              description: null,
              type: TableTypeEnum.Query,
              identifier: "select\n\t*\nfrom\n\tsubtable",
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
                },
              ],
            },
            {
              name: "T3",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table",
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
                },
              ],
            },
          ],
          joins: [],
        },
      ],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const model = struct.models(0)!;
    const tables = getTables(model, [
      {
        type: JoinTypeEnum.Inner,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F1",
              },
            },
          ],
          children: [],
        },
      },
    ]);
    expect(tables.length).toBe(2);
    expect(tables[0].name()).toEqual("T1");
    expect(tables[1].name()).toEqual("T2");
  });
});

describe("The `getTableSQL` and `getTableHTML` functions", () => {
  const hdom: HDOM = {
    includes: [],
    connections: [],
    models: [
      {
        name: "model",
        description: null,
        tables: [
          {
            name: "table",
            description: null,
            type: TableTypeEnum.Table,
            identifier: '"connection"."schema"."table"',
            fields: [
              {
                name: "field",
                description: null,
                origin: null,
                clause: null,
                type: {
                  type: DataTypeEnum.Unspecified,
                },
                aggregation: AggregationTypeEnum.None,
                order: OrderTypeEnum.None,
              },
            ],
          },
          {
            name: "query",
            description: null,
            type: TableTypeEnum.Query,
            identifier: 'select\n\t*\nfrom\n\t"subtable"',
            fields: [
              {
                name: "field",
                description: null,
                origin: null,
                clause: null,
                type: {
                  type: DataTypeEnum.Unspecified,
                },
                aggregation: AggregationTypeEnum.None,
                order: OrderTypeEnum.None,
              },
            ],
          },
          {
            name: "sorting",
            description: null,
            type: TableTypeEnum.Table,
            identifier: '"connection"."schema"."table"',
            fields: [
              {
                name: "field_b",
                description: null,
                origin: null,
                clause: null,
                type: {
                  type: DataTypeEnum.Unspecified,
                },
                aggregation: AggregationTypeEnum.None,
                order: OrderTypeEnum.None,
              },
              {
                name: "field_a",
                description: null,
                origin: null,
                clause: null,
                type: {
                  type: DataTypeEnum.Unspecified,
                },
                aggregation: AggregationTypeEnum.None,
                order: OrderTypeEnum.None,
              },
              {
                name: "field_c",
                description: null,
                origin: null,
                clause: null,
                type: {
                  type: DataTypeEnum.Unspecified,
                },
                aggregation: AggregationTypeEnum.None,
                order: OrderTypeEnum.None,
              },
              {
                name: "field_c",
                description: null,
                origin: null,
                clause: null,
                type: {
                  type: DataTypeEnum.Unspecified,
                },
                aggregation: AggregationTypeEnum.None,
                order: OrderTypeEnum.None,
              },
              {
                name: null as unknown as string,
                description: null,
                origin: null,
                clause: null,
                type: {
                  type: DataTypeEnum.Unspecified,
                },
                aggregation: AggregationTypeEnum.None,
                order: OrderTypeEnum.None,
              },
            ],
          },
        ],
        joins: [
          {
            type: JoinTypeEnum.Inner,
            description: null,
            left: "table",
            right: "query",
            clause: {
              type: FilterOperatorEnum.None,
              filters: [
                {
                  type: FilterTypeEnum.Keys,
                  options: {
                    left: "field",
                    right: "field",
                  },
                },
              ],
              children: [],
            },
          },
          {
            type: JoinTypeEnum.Left,
            description: null,
            left: "table",
            right: "sorting",
            clause: {
              type: FilterOperatorEnum.None,
              filters: [
                {
                  type: FilterTypeEnum.Keys,
                  options: {
                    left: "field",
                    right: "field_a",
                  },
                },
              ],
              children: [],
            },
          },
        ],
      },
    ],
    frames: [],
  };
  const bytes = serialize(hdom);
  const struct = deserialize(bytes);

  it("should stringify `table`", () => {
    const table = <TableStruct>struct.models(0)?.tables(0);
    const sql = getTableSQL(table);
    const html = getTableHTML(table);
    expect(sql).toBe(
      '"table" as (\n  select\n    "field" as "field"\n  from\n    "connection"."schema"."table"\n)',
    );
    expect(html).toBe(
      '<hdml-table name="table" type="table" identifier="`connection`.`schema`.`table`">\n  <hdml-field name="field"></hdml-field>\n</hdml-table>',
    );
  });

  it("should stringify `query`", () => {
    const table = <TableStruct>struct.models(0)?.tables(1);
    const sql = getTableSQL(table);
    const html = getTableHTML(table);
    expect(sql).toBe(
      '"query" as (\n  with _query as (\n    select\n    \t*\n    from\n    \t"subtable"\n  )\n  select\n    "field" as "field"\n  from\n    _query\n)',
    );
    expect(html).toBe(
      '<hdml-table name="query" type="query" identifier="select\n\t*\nfrom\n\t`subtable`">\n  <hdml-field name="field"></hdml-field>\n</hdml-table>',
    );
  });

  it("should stringify `sorting`", () => {
    const table = <TableStruct>struct.models(0)?.tables(2);
    const sql = getTableSQL(table);
    const html = getTableHTML(table);
    expect(sql).toBe(
      '"sorting" as (\n  select\n    "field_a" as "field_a",\n    "field_b" as "field_b",\n    "field_c" as "field_c",\n    "field_c" as "field_c"\n  from\n    "connection"."schema"."table"\n)',
    );
    expect(html).toBe(
      '<hdml-table name="sorting" type="table" identifier="`connection`.`schema`.`table`">\n  <hdml-field name="field_a"></hdml-field>\n  <hdml-field name="field_b"></hdml-field>\n  <hdml-field name="field_c"></hdml-field>\n  <hdml-field name="field_c"></hdml-field>\n</hdml-table>',
    );
  });
});

describe("The `getModelSQL` and `getModelHTML` function", () => {
  it("should stringify model without joins", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [
            {
              name: "T1",
              description: null,
              type: TableTypeEnum.Table,
              identifier: '"connection"."schema"."table"',
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
                },
              ],
            },
            {
              name: "T2",
              description: null,
              type: TableTypeEnum.Query,
              identifier: 'select\n\t*\nfrom\n\t"subtable"',
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
                },
              ],
            },
            {
              name: "T3",
              description: null,
              type: TableTypeEnum.Table,
              identifier: '"connection"."schema"."table"',
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
                },
              ],
            },
          ],
          joins: [],
        },
      ],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const model = struct.models(0)!;
    const sql = getModelSQL(model);
    const html = getModelHTML(model);
    expect(sql).toEqual(
      '  with\n    "T1" as (\n      select\n        "F1" as "F1"\n      from\n        "connection"."schema"."table"\n    ),\n    "T2" as (\n      with _T2 as (\n        select\n        \t*\n        from\n        \t"subtable"\n      )\n      select\n        "F1" as "F1"\n      from\n        _T2\n    ),\n    "T3" as (\n      select\n        "F1" as "F1"\n      from\n        "connection"."schema"."table"\n    )\n  select\n    "T1"."F1" as "T1_F1",\n    "T2"."F1" as "T2_F1",\n    "T3"."F1" as "T3_F1"\n  from\n    "T1",\n    "T2",\n    "T3"',
    );
    expect(html).toBe(
      '<hdml-model name="model">\n  <hdml-table name="T1" type="table" identifier="`connection`.`schema`.`table`">\n    <hdml-field name="F1"></hdml-field>\n  </hdml-table>\n  <hdml-table name="T2" type="query" identifier="select\n\t*\nfrom\n\t`subtable`">\n    <hdml-field name="F1"></hdml-field>\n  </hdml-table>\n  <hdml-table name="T3" type="table" identifier="`connection`.`schema`.`table`">\n    <hdml-field name="F1"></hdml-field>\n  </hdml-table>\n</hdml-model>\n',
    );
  });

  it("should stringify model with one join", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [
            {
              name: "T1",
              description: null,
              type: TableTypeEnum.Table,
              identifier: `"connection"."schema"."table"`,
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
                },
              ],
            },
            {
              name: "T2",
              description: null,
              type: TableTypeEnum.Query,
              identifier: 'select\n\t*\nfrom\n\t"subtable"',
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
                },
              ],
            },
            {
              name: "T3",
              description: null,
              type: TableTypeEnum.Table,
              identifier: '"connection"."schema"."table"',
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
                },
              ],
            },
          ],
          joins: [
            {
              type: JoinTypeEnum.Inner,
              description: null,
              left: "T1",
              right: "T2",
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "F1",
                      right: "F1",
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const model = struct.models(0)!;
    const sql = getModelSQL(model);
    const html = getModelHTML(model);
    expect(sql).toBe(
      '  with\n    "T1" as (\n      select\n        "F1" as "F1"\n      from\n        "connection"."schema"."table"\n    ),\n    "T2" as (\n      with _T2 as (\n        select\n        \t*\n        from\n        \t"subtable"\n      )\n      select\n        "F1" as "F1"\n      from\n        _T2\n    )\n  select\n    "T1"."F1" as "T1_F1",\n    "T2"."F1" as "T2_F1"\n  from "T1"\n  inner join "T2"\n  on (\n    "T1"."F1" = "T2"."F1"\n  )\n',
    );
    expect(html).toBe(
      '<hdml-model name="model">\n  <hdml-table name="T1" type="table" identifier="`connection`.`schema`.`table`">\n    <hdml-field name="F1"></hdml-field>\n  </hdml-table>\n  <hdml-table name="T2" type="query" identifier="select\n\t*\nfrom\n\t`subtable`">\n    <hdml-field name="F1"></hdml-field>\n  </hdml-table>\n  <hdml-join type="inner" left="T1" right="T2">\n    <hdml-connective operator="none">\n      <hdml-filter type="keys" left="F1" right="F1"></hdml-filter>\n    </hdml-connective>\n  </hdml-join>\n</hdml-model>\n',
    );
  });
});

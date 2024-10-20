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
  JoinTypeEnum,
  FilterTypeEnum,
  FilterOperatorEnum,
  TableStruct,
  JoinStruct,
} from "@hdml/schemas";
import { serialize, deserialize } from "@hdml/buffer";
import { getTableSQL, getDAG, findRoots, sortJoins } from "./model";

describe("The `getTableSQL` function", () => {
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
            identifier: "connection.schema.table",
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
            identifier: "select\n\t*\nfrom\n\tsubtable",
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
            identifier: "connection.schema.table",
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
        joins: [],
      },
    ],
    frames: [],
  };

  it("should stringlify `table`", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const table = <TableStruct>struct.models(0)?.tables(0);
    const sql = getTableSQL(table);
    expect(sql).toBe(
      '"table" as (\n  select\n    "field" as "field"\n  from\n    connection.schema.table\n)',
    );
  });

  it("should stringlify `query`", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const table = <TableStruct>struct.models(0)?.tables(1);
    const sql = getTableSQL(table);
    expect(sql).toBe(
      '"query" as (\n  with _query as (\n    select\n    \t*\n    from\n    \tsubtable\n  )\n  select\n    "field" as "field"\n  from\n    _query\n)',
    );
  });

  it("should stringlify `sorting`", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const table = <TableStruct>struct.models(0)?.tables(2);
    const sql = getTableSQL(table);
    expect(sql).toBe(
      '"sorting" as (\n  select\n    "field_a" as "field_a",\n    "field_b" as "field_b",\n    "field_c" as "field_c",\n    "field_c" as "field_c"\n  from\n    connection.schema.table\n)',
    );
  });
});

describe("The `sortJoins` function", () => {
  it("should sort case 3", () => {
    /**
     *     j1
     *    /  \
     *   j2  j3
     */
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [
            {
              name: "table1",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table1",
              fields: [],
            },
            {
              name: "table2",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table2",
              fields: [],
            },
            {
              name: "table3",
              description: null,
              type: TableTypeEnum.Table,
              identifier: "connection.schema.table3",
              fields: [],
            },
          ],
          joins: [
            {
              left: "table1",
              right: "table2",
              type: JoinTypeEnum.Cross,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "table1",
              right: "table3",
              type: JoinTypeEnum.Cross,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    let joins: JoinStruct[] = [];
    for (let i = 0; i < struct.models(0)!.joinsLength(); i++) {
      joins.push(struct.models(0)!.joins(i)!);
    }
    joins = sortJoins(joins);
    expect(joins[0].left()).toBe("table1");
    expect(joins[0].right()).toBe("table2");
    expect(joins[0].type()).toBe(JoinTypeEnum.Cross);

    expect(joins[1].left()).toBe("table1");
    expect(joins[1].right()).toBe("table3");
    expect(joins[1].type()).toBe(JoinTypeEnum.Cross);
  });
});

describe("The `getDAG` and `findRoots` functions", () => {
  it("should find `j1` for case 1", () => {
    /**
     *   j1
     */
    const dag = getDAG([
      { left: "j1", right: "", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1"]);
  });

  it("should find `j1` and `j2` for case 2", () => {
    /**
     *   j1  j2
     */
    const dag = getDAG([
      { left: "j1", right: "", type: JoinTypeEnum.Full },
      { left: "j2", right: "", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1", "j2"]);
  });

  it("should find `j1` for case 3", () => {
    /**
     *     j1
     *    /  \
     *   j2  j3
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1"]);
  });

  it("should find `j1` for case 4", () => {
    /**
     *      j1
     *     /  \
     *    j2  j3
     *   /
     *  j4
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1"]);
  });

  it("should find `j1` for case 5", () => {
    /**
     *      j1
     *     /  \
     *    j2  j3
     *   /      \
     *  j4      j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1"]);
  });

  it("should find `j6` for case 6", () => {
    /**
     *      j6
     *      |
     *      j1
     *     /  \
     *    j2  j3
     *   /      \
     *  j4      j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
      { left: "j6", right: "j1", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j6"]);
  });

  it("should find `j6` for case 7", () => {
    /**
     *      j6
     *      |
     *      j1
     *     /  \
     *    j2  j3
     *   /  \   \
     *  j4  j6   j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
      { left: "j6", right: "j1", type: JoinTypeEnum.Full },
      { left: "j2", right: "j6", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j6_out"]);
  });

  it("should find `j6` for case 8", () => {
    /**
     *      j6
     *      |
     *      j1
     *     /  \
     *    j2  j3
     *   /  \/  \
     *  j4  j6   j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
      { left: "j6", right: "j1", type: JoinTypeEnum.Full },
      { left: "j2", right: "j6", type: JoinTypeEnum.Full },
      { left: "j3", right: "j6", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j6_out"]);
  });

  it("should find `j6` and `j7` for case 9", () => {
    /**
     *    j6
     *      \
     *  j7  j1
     *   \ /  \
     *    j2  j3
     *   /  \   \
     *  j4  j6   j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
      { left: "j6", right: "j1", type: JoinTypeEnum.Full },
      { left: "j2", right: "j6", type: JoinTypeEnum.Full },
      { left: "j7", right: "j2", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j6_out", "j7"]);
  });

  it("should find `j6` and `j7` for case 10", () => {
    /**
     *    j6 j7
     *      \/
     *  j7  j1
     *   \ /  \
     *    j2  j3
     *   /  \   \
     *  j4  j6   j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
      { left: "j6", right: "j1", type: JoinTypeEnum.Full },
      { left: "j2", right: "j6", type: JoinTypeEnum.Full },
      { left: "j7", right: "j2", type: JoinTypeEnum.Full },
      { left: "j7", right: "j1", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j7", "j6_out"]);
  });

  it("should find `j6` and `j7` for case 11", () => {
    /**
     *    j6 j7
     *      \/
     *  j7  j1
     *   \ /  \
     *    j2  j3
     *   /  \/  \
     *  j4  j6   j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
      { left: "j6", right: "j1", type: JoinTypeEnum.Full },
      { left: "j2", right: "j6", type: JoinTypeEnum.Full },
      { left: "j7", right: "j2", type: JoinTypeEnum.Full },
      { left: "j7", right: "j1", type: JoinTypeEnum.Full },
      { left: "j3", right: "j6", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j7", "j6_out"]);
  });

  it("should find `j6` and `j5` for case 12", () => {
    /**
     *         j5
     *         /
     *    j6 j7
     *      \/
     *  j7  j1
     *   \ /  \
     *    j2  j3
     *   /  \/  \
     *  j4  j6   j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
      { left: "j6", right: "j1", type: JoinTypeEnum.Full },
      { left: "j2", right: "j6", type: JoinTypeEnum.Full },
      { left: "j7", right: "j2", type: JoinTypeEnum.Full },
      { left: "j7", right: "j1", type: JoinTypeEnum.Full },
      { left: "j3", right: "j6", type: JoinTypeEnum.Full },
      { left: "j5", right: "j7", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j5_out", "j6_out"]);
  });

  it("should find `j6`, `j8`, `j9` and `j5` for case 13", () => {
    /**
     *   j9    j5
     *    \    /
     *    j6 j7
     *      \/
     *  j7  j1  j8
     *   \ /  \ /
     *    j2  j3
     *   /  \/  \
     *  j4  j6   j5
     */
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
      { left: "j3", right: "j5", type: JoinTypeEnum.Full },
      { left: "j6", right: "j1", type: JoinTypeEnum.Full },
      { left: "j2", right: "j6", type: JoinTypeEnum.Full },
      { left: "j7", right: "j2", type: JoinTypeEnum.Full },
      { left: "j7", right: "j1", type: JoinTypeEnum.Full },
      { left: "j3", right: "j6", type: JoinTypeEnum.Full },
      { left: "j5", right: "j7", type: JoinTypeEnum.Full },
      { left: "j8", right: "j3", type: JoinTypeEnum.Full },
      { left: "j9", right: "j6", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j5_out", "j6_out", "j8", "j9"]);
  });
});

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
import { Join } from "@hdml/types";
import { serialize, deserialize } from "@hdml/buffer";
import {
  getJoins,
  getTableSQL,
  getDAG,
  findRoots,
  sortJoins,
} from "./model";

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

// Following join structures are described in joins related testd:
//
// ===================================================================
// Case 1
// ===================================================================
//
//     (T1)
//
// ===================================================================
// Case 2
// ===================================================================
//
//  (T1)  (T2)
//
// ===================================================================
// Case 3
// ===================================================================
//
//     (T1)
//     /  \
//  (T2)  (T3)
//
// ===================================================================
// Case 4
// ===================================================================
//
//        (T1)
//        /  \
//     (T2)  (T3)
//     /
//  (T4)
//
// ===================================================================
// Case 5
// ===================================================================
//
//        (T1)
//        /  \
//     (T2)  (T3)
//     /        \
//  (T4)        (T5)
//
// ===================================================================
// Case 6
// ===================================================================
//
//     (T6)
//        \
//        (T1)
//        /  \
//     (T2)  (T3)
//     /        \
//  (T4)        (T5)
//
// ===================================================================
// Case 7
// ===================================================================
//
//     (T6)
//        \
//        (T1)
//        /  \
//     (T2)  (T3)
//     /  \     \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 8
// ===================================================================
//
//     (T6)
//        \
//        (T1)
//        /  \
//     (T2)  (T3)
//     /  \  /  \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 9
// ===================================================================
//
//     (T6)
//        \
//  (T7)  (T1)
//     \  /  \
//     (T2)  (T3)
//     /  \     \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 10
// ===================================================================
//
//     (T6)  (T7)
//        \  /
//  (T7)  (T1)
//     \  /  \
//     (T2)  (T3)
//     /  \     \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 11
// ===================================================================
//
//     (T6)  (T7)
//        \  /
//  (T7)  (T1)
//     \  /  \
//     (T2)  (T3)
//     /  \  /  \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 12
// ===================================================================
//
//              (T5)
//              /
//     (T6)  (T7)
//        \  /
//  (T7)  (T1)
//     \  /  \
//     (T2)  (T3)
//     /  \  /  \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 13
// ===================================================================
//
//  (T9)        (T5)
//     \        /
//     (T6)  (T7)
//        \  /
//  (T7)  (T1)  (T8)
//     \  /  \  /
//     (T2)  (T3)
//     /  \  /  \
//  (T4)  (T6)  (T5)
//

let case1: Join[];
let case2: Join[];
let case3: Join[];
let case4: Join[];
let case5: Join[];
let case6: Join[];
let case7: Join[];
let case8: Join[];
let case9: Join[];
let case10: Join[];
let case11: Join[];
let case12: Join[];
let case13: Join[];

describe("The `getJoins` function", () => {
  it("should objectify case 1", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "table1",
              right: "",
              type: JoinTypeEnum.Left,
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
    case1 = getJoins(struct.models(0)!);
    expect(case1).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 2", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "",
              type: JoinTypeEnum.Left,
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
    case2 = getJoins(struct.models(0)!);
    expect(case2).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 3", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
    case3 = getJoins(struct.models(0)!);
    expect(case3).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 4", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
    case4 = getJoins(struct.models(0)!);
    expect(case4).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 5", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
    case5 = getJoins(struct.models(0)!);
    expect(case5).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 6", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
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
    case6 = getJoins(struct.models(0)!);
    expect(case6).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 7", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
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
    case7 = getJoins(struct.models(0)!);
    expect(case7).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 8", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T6",
              type: JoinTypeEnum.Left,
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
    case8 = getJoins(struct.models(0)!);
    expect(case8).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 9", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
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
    case9 = getJoins(struct.models(0)!);
    expect(case9).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 10", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T1",
              type: JoinTypeEnum.Left,
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
    case10 = getJoins(struct.models(0)!);
    expect(case10).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 11", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T6",
              type: JoinTypeEnum.Left,
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
    case11 = getJoins(struct.models(0)!);
    expect(case11).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 12", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T5",
              right: "T7",
              type: JoinTypeEnum.Left,
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
    case12 = getJoins(struct.models(0)!);
    expect(case12).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 13", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
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
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
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
              left: "T7",
              right: "T1",
              type: JoinTypeEnum.Left,
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
              left: "T3",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T5",
              right: "T7",
              type: JoinTypeEnum.Left,
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
              left: "T9",
              right: "T6",
              type: JoinTypeEnum.Left,
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
              left: "T8",
              right: "T3",
              type: JoinTypeEnum.Left,
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
    case13 = getJoins(struct.models(0)!);
    expect(case13).toEqual(hdom.models[0].joins);
  });
});

describe("The `sortJoins` function", () => {
  it("should sort case 3", () => {
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
    const dag = getDAG([
      { left: "j1", right: "", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1"]);
  });

  it("should find `j1` and `j2` for case 2", () => {
    const dag = getDAG([
      { left: "j1", right: "", type: JoinTypeEnum.Full },
      { left: "j2", right: "", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1", "j2"]);
  });

  it("should find `j1` for case 3", () => {
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1"]);
  });

  it("should find `j1` for case 4", () => {
    const dag = getDAG([
      { left: "j1", right: "j2", type: JoinTypeEnum.Full },
      { left: "j1", right: "j3", type: JoinTypeEnum.Full },
      { left: "j2", right: "j4", type: JoinTypeEnum.Full },
    ]);
    const roots = findRoots(dag);
    expect(roots).toEqual(["j1"]);
  });

  it("should find `j1` for case 5", () => {
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

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDOM } from "@hdml/types";
import {
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  FilterOperatorEnum,
  FilterTypeEnum,
  FilterNameEnum,
} from "@hdml/schemas";
import { serialize, deserialize } from "@hdml/buffer";
import { getFrameSQL } from "./frame";

let lvl1: string = "";
let lvl2: string = "";
let lvl3: string = "";

describe("The `getFrameSQL` function", () => {
  it("should stringify frame with cached source", () => {
    const hdom: HDOM = {
      includes: [],
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
    const struct = deserialize(bytes);
    const frame = struct.frames(0)!;
    lvl3 = getFrameSQL(frame, { name: "cash", sql: "" }, 2);
    expect(lvl3).toBe(
      '    select\n      "F1" as "F1"\n    from\n      "cash"\n    offset 0\n    limit 100\n',
    );
  });

  it("should stringify frame with sub-query", () => {
    const hdom: HDOM = {
      includes: [],
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
    const struct = deserialize(bytes);
    const frame = struct.frames(0)!;
    lvl2 = getFrameSQL(frame, { name: "sub", sql: lvl3 }, 1);
    expect(lvl2).toBe(
      '  with "sub" as (\n    select\n      "F1" as "F1"\n    from\n      "cash"\n    offset 0\n    limit 100\n  )\n  select\n    "F1" as "F1"\n  from\n    "sub"\n  offset 0\n  limit 100\n',
    );
  });

  it("should stringify frame with two sub-queries", () => {
    const hdom: HDOM = {
      includes: [],
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
    const struct = deserialize(bytes);
    const frame = struct.frames(0)!;
    lvl1 = getFrameSQL(frame, { name: "mid", sql: lvl2 }, 0);
    expect(lvl1).toBe(
      'with "mid" as (\n  with "sub" as (\n    select\n      "F1" as "F1"\n    from\n      "cash"\n    offset 0\n    limit 100\n  )\n  select\n    "F1" as "F1"\n  from\n    "sub"\n  offset 0\n  limit 100\n)\nselect\n  "F1" as "F1"\nfrom\n  "mid"\noffset 0\nlimit 100\n',
    );
  });

  it("should sort fields while stringifying frame", () => {
    const hdom: HDOM = {
      includes: [],
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
    const struct = deserialize(bytes);
    const frame = struct.frames(0)!;
    const sql = getFrameSQL(frame, { name: "cash", sql: "" });
    expect(sql).toBe(
      'select\n  "F1" as "F1",\n  "F2" as "F2",\n  "F2" as "F2",\n  "F3" as "F3"\nfrom\n  "cash"\noffset 0\nlimit 100\n',
    );
  });

  it("should stringify frame with filter block", () => {
    const hdom: HDOM = {
      includes: [],
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
    const struct = deserialize(bytes);
    const frame = struct.frames(0)!;
    const sql = getFrameSQL(frame, { name: "base", sql: "" });
    expect(sql).toBe(
      'select\n  "F1" as "F1",\n  "F2" as "F2",\n  "F3" as "F3",\n  "F4" as "F4"\nfrom\n  "base"\nwhere\n  1 = 1\n  and "F1" = 1\noffset 0\nlimit 100\n',
    );
  });

  it("should stringify frame with group by block", () => {
    const hdom: HDOM = {
      includes: [],
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
    const struct = deserialize(bytes);
    const frame = struct.frames(0)!;
    const sql = getFrameSQL(frame, { name: "base", sql: "" });
    expect(sql).toBe(
      'select\n  "F1" as "F1",\n  "F2" as "F2",\n  "F3" as "F3",\n  "F4" as "F4"\nfrom\n  "base"\ngroup by\n  2, 3\noffset 0\nlimit 100\n',
    );
  });

  it("should stringify frame with sort by block", () => {
    const hdom: HDOM = {
      includes: [],
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
            },
          ],
          split_by: [],
          limit: 100,
          offset: 0,
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const frame = struct.frames(0)!;
    const sql = getFrameSQL(frame, { name: "base", sql: "" });
    expect(sql).toBe(
      'select\n  "F1" as "F1",\n  "F2" as "F2",\n  "F3" as "F3",\n  "F4" as "F4"\nfrom\n  "base"\norder by\n  1, 4\noffset 0\nlimit 100\n',
    );
  });
});

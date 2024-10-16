/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  FieldStruct,
  TableTypeEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  FilterOperatorEnum,
  DecimalBitWidthEnum,
  DateUnitEnum,
  TimeUnitEnum,
  TimeZoneEnum,
} from "@hdml/schemas";
import { HDOM } from "@hdml/types";
import { serialize, deserialize } from "@hdml/buffer";
import { getTableFieldSQL, getFrameFieldSQL } from "./field";

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
              name: "simple_field",
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
              name: "origin_field",
              description: null,
              origin: "origin",
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "clause_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "int8_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Int8,
                options: {
                  nullable: true,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "int16_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Int16,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "int32_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Int32,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "int64_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Int64,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "float32_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Float32,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "float64_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Float64,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "decimal_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Decimal,
                options: {
                  nullable: false,
                  bit_width: DecimalBitWidthEnum._256,
                  precision: 18,
                  scale: 0,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "date_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Date,
                options: {
                  nullable: false,
                  unit: DateUnitEnum.Millisecond,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "time_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Time,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.UTC,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "binary_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Binary,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "utf8_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Utf8,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "count_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Utf8,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.Count,
              order: OrderTypeEnum.None,
            },
            {
              name: "count_distinct_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Utf8,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.CountDistinct,
              order: OrderTypeEnum.None,
            },
            {
              name: "approx_distinct_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Utf8,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.CountDistinctApprox,
              order: OrderTypeEnum.None,
            },
            {
              name: "min_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Int16,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.Min,
              order: OrderTypeEnum.None,
            },
            {
              name: "max_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Int16,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.Max,
              order: OrderTypeEnum.None,
            },
            {
              name: "sum_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Int16,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.Sum,
              order: OrderTypeEnum.None,
            },
            {
              name: "avg_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Int16,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.Avg,
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
  frames: [
    {
      name: "frame",
      description: null,
      source: "model",
      offset: 0,
      limit: 100,
      fields: [
        {
          name: "simple_field",
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
          name: "origin_field",
          description: null,
          origin: "origin",
          clause: null,
          type: {
            type: DataTypeEnum.Unspecified,
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "clause_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Unspecified,
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "int8_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Int8,
            options: {
              nullable: true,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "int16_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Int16,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "int32_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Int32,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "int64_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Int64,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "float32_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Float32,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "float64_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Float64,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "decimal_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Decimal,
            options: {
              nullable: false,
              bit_width: DecimalBitWidthEnum._256,
              precision: 18,
              scale: 0,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "date_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Date,
            options: {
              nullable: false,
              unit: DateUnitEnum.Millisecond,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "time_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Time,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.UTC,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "binary_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Binary,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "utf8_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Utf8,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "count_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Utf8,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.Count,
          order: OrderTypeEnum.None,
        },
        {
          name: "count_distinct_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Utf8,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.CountDistinct,
          order: OrderTypeEnum.None,
        },
        {
          name: "approx_distinct_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Utf8,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.CountDistinctApprox,
          order: OrderTypeEnum.None,
        },
        {
          name: "min_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Int16,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.Min,
          order: OrderTypeEnum.None,
        },
        {
          name: "max_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Int16,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.Max,
          order: OrderTypeEnum.None,
        },
        {
          name: "sum_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Int16,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.Sum,
          order: OrderTypeEnum.None,
        },
        {
          name: "avg_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Int16,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.Avg,
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
      filter_by: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      group_by: [],
      split_by: [],
      sort_by: [],
    },
  ],
};

describe("Field functions", () => {
  it("must stringlify `simple_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(0);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe('"simple_field" as "simple_field"');
  });

  it("must stringlify `simple_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(0);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe('"simple_field" as "simple_field"');
  });

  it("must stringlify `origin_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(1);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe('"origin" as "origin_field"');
  });

  it("must stringlify `origin_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(1);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe('"origin" as "origin_field"');
  });

  it("must stringlify `clause_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(2);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe('clause("field") as "clause_field"');
  });

  it("must stringlify `clause_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(2);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe('clause("field") as "clause_field"');
  });

  it("must stringlify `int8_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(3);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as tinyint) as "int8_field"',
    );
  });

  it("must stringlify `int8_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(3);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as tinyint) as "int8_field"',
    );
  });

  it("must stringlify `int16_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(4);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "int16_field"',
    );
  });

  it("must stringlify `int16_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(4);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "int16_field"',
    );
  });

  it("must stringlify `int32_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(5);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as integer) as "int32_field"',
    );
  });

  it("must stringlify `int32_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(5);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as integer) as "int32_field"',
    );
  });

  it("must stringlify `int64_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(6);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as bigint) as "int64_field"',
    );
  });

  it("must stringlify `int64_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(6);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as bigint) as "int64_field"',
    );
  });

  it("must stringlify `float32_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(7);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as real) as "float32_field"',
    );
  });

  it("must stringlify `float32_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(7);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as real) as "float32_field"',
    );
  });

  it("must stringlify `float64_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(8);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as double) as "float64_field"',
    );
  });

  it("must stringlify `float64_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(8);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as double) as "float64_field"',
    );
  });

  it("must stringlify `decimal_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(9);
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as decimal(18, 0))' +
        ' as "decimal_field"',
    );
  });

  it("must stringlify `decimal_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(9);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as decimal(18, 0))' +
        ' as "decimal_field"',
    );
  });

  it("must stringlify `date_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(10)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as date) as "date_field"',
    );
  });

  it("must stringlify `date_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(10);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as date) as "date_field"',
    );
  });

  it("must stringlify `time_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(11)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time) as "time_field"',
    );
  });

  it("must stringlify `time_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(11);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time) as "time_field"',
    );
  });

  it("must stringlify `timestamp_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(12)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp) as "timestamp_field"',
    );
  });

  it("must stringlify `timestamp_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(12);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp) as "timestamp_field"',
    );
  });

  it("must stringlify `binary_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(13)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varbinary) as "binary_field"',
    );
  });

  it("must stringlify `binary_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(13);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varbinary) as "binary_field"',
    );
  });

  it("must stringlify `utf8_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(14)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) as "utf8_field"',
    );
  });

  it("must stringlify `utf8_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(14);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) as "utf8_field"',
    );
  });

  it("must stringlify `count_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(15)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) as "count_field"',
    );
  });

  it("must stringlify `count_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(15);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'count(try_cast(clause("field") as varchar)) as "count_field"',
    );
  });

  it("must stringlify `count_distinct_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(16)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) ' +
        'as "count_distinct_field"',
    );
  });

  it("must stringlify `count_distinct_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(16);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'count(distinct try_cast(clause("field") as varchar)) ' +
        'as "count_distinct_field"',
    );
  });

  it("must stringlify `approx_distinct_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(17)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) ' +
        'as "approx_distinct_field"',
    );
  });

  it("must stringlify `approx_distinct_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(17);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'approx_distinct(try_cast(clause("field") as varchar)) ' +
        'as "approx_distinct_field"',
    );
  });

  it("must stringlify `min_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(18)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "min_field"',
    );
  });

  it("must stringlify `min_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(18);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'min(try_cast(clause("field") as smallint)) as "min_field"',
    );
  });

  it("must stringlify `max_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(19)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "max_field"',
    );
  });

  it("must stringlify `max_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(19);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'max(try_cast(clause("field") as smallint)) as "max_field"',
    );
  });

  it("must stringlify `sum_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(20)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "sum_field"',
    );
  });

  it("must stringlify `sum_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(20);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'sum(try_cast(clause("field") as smallint)) as "sum_field"',
    );
  });

  it("must stringlify `avg_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(21)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "avg_field"',
    );
  });

  it("must stringlify `avg_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(21);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe(
      'avg(try_cast(clause("field") as smallint)) as "avg_field"',
    );
  });

  it("must stringlify `niname_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(22)
    );
    const sql = getTableFieldSQL(field);
    expect(sql).toBe("");
  });

  it("must stringlify `niname_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(22);
    const sql = getFrameFieldSQL(field);
    expect(sql).toBe("");
  });
});

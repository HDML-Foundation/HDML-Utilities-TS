/* eslint-disable max-len */

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
import {
  getTableFieldSQL,
  getFrameFieldSQL,
  getFieldHTML,
} from "./field";

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
            {
              name: "time_millisecond_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Time,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Millisecond,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "time_microsecond_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Time,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Microsecond,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "time_nanosecond_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Time,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Nanosecond,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_millisecond_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Millisecond,
                  timezone: TimeZoneEnum.UTC,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_microsecond_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Microsecond,
                  timezone: TimeZoneEnum.UTC,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_nanosecond_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Nanosecond,
                  timezone: TimeZoneEnum.UTC,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_01_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_01,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_02_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_02,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_03_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_03,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_04_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_04,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_05_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_05,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_06_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_06,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_07_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_07,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_08_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_08,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_09_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_09,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_10_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_10,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_11_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_11,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_m_12_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_m_12,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_01_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_01,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_02_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_02,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_03_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_03,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_04_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_04,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_05_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_05,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_06_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_06,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_07_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_07,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_08_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_08,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_09_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_09,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_10_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_10,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_11_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_11,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_12_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_12,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_13_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_13,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "timestamp_gmt_p_14_field",
              description: null,
              origin: "origin",
              clause: 'clause("field")',
              type: {
                type: DataTypeEnum.Timestamp,
                options: {
                  nullable: false,
                  unit: TimeUnitEnum.Second,
                  timezone: TimeZoneEnum.GMT_p_14,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
            {
              name: "asc_field",
              description: null,
              origin: "field",
              clause: null,
              type: {
                type: DataTypeEnum.Int8,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.Ascending,
            },
            {
              name: "desc_field",
              description: null,
              origin: "field",
              clause: null,
              type: {
                type: DataTypeEnum.Int8,
                options: {
                  nullable: false,
                },
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.Descending,
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
        {
          name: "time_millisecond_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Time,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Millisecond,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "time_microsecond_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Time,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Microsecond,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "time_nanosecond_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Time,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Nanosecond,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_millisecond_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Millisecond,
              timezone: TimeZoneEnum.UTC,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_microsecond_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Microsecond,
              timezone: TimeZoneEnum.UTC,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_nanosecond_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Nanosecond,
              timezone: TimeZoneEnum.UTC,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_01_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_01,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_02_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_02,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_03_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_03,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_04_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_04,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_05_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_05,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_06_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_06,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_07_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_07,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_08_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_08,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_09_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_09,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_10_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_10,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_11_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_11,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_m_12_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_m_12,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_01_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_01,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_02_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_02,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_03_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_03,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_04_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_04,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_05_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_05,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_06_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_06,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_07_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_07,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_08_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_08,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_09_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_09,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_10_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_10,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_11_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_11,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_12_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_12,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_13_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_13,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "timestamp_gmt_p_14_field",
          description: null,
          origin: "origin",
          clause: 'clause("field")',
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Second,
              timezone: TimeZoneEnum.GMT_p_14,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "asc_field",
          description: null,
          origin: "field",
          clause: null,
          type: {
            type: DataTypeEnum.Int8,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.Ascending,
        },
        {
          name: "desc_field",
          description: null,
          origin: "field",
          clause: null,
          type: {
            type: DataTypeEnum.Int8,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.Descending,
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
  it("must stringify `simple_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(0);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe('"simple_field" as "simple_field"');
    expect(html).toBe(
      '<hdml-field name="simple_field"></hdml-field>',
    );
  });

  it("must stringify `simple_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(0);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe('"simple_field" as "simple_field"');
    expect(html).toBe(
      '<hdml-field name="simple_field"></hdml-field>',
    );
  });

  it("must stringify `origin_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(1);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe('"origin" as "origin_field"');
    expect(html).toBe(
      '<hdml-field name="origin_field" origin="origin"></hdml-field>',
    );
  });

  it("must stringify `origin_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(1);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe('"origin" as "origin_field"');
    expect(html).toBe(
      '<hdml-field name="origin_field" origin="origin"></hdml-field>',
    );
  });

  it("must stringify `clause_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(2);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe('clause("field") as "clause_field"');
    expect(html).toBe(
      '<hdml-field name="clause_field" origin="origin" clause="clause(`field`)"></hdml-field>',
    );
  });

  it("must stringify `clause_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(2);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe('clause("field") as "clause_field"');
    expect(html).toBe(
      '<hdml-field name="clause_field" origin="origin" clause="clause(`field`)"></hdml-field>',
    );
  });

  it("must stringify `int8_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(3);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as tinyint) as "int8_field"',
    );
    expect(html).toBe(
      '<hdml-field name="int8_field" origin="origin" clause="clause(`field`)" type="int-8"></hdml-field>',
    );
  });

  it("must stringify `int8_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(3);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as tinyint) as "int8_field"',
    );
    expect(html).toBe(
      '<hdml-field name="int8_field" origin="origin" clause="clause(`field`)" type="int-8"></hdml-field>',
    );
  });

  it("must stringify `int16_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(4);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "int16_field"',
    );
    expect(html).toBe(
      '<hdml-field name="int16_field" origin="origin" clause="clause(`field`)" type="int-16"></hdml-field>',
    );
  });

  it("must stringify `int16_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(4);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "int16_field"',
    );
    expect(html).toBe(
      '<hdml-field name="int16_field" origin="origin" clause="clause(`field`)" type="int-16"></hdml-field>',
    );
  });

  it("must stringify `int32_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(5);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as integer) as "int32_field"',
    );
    expect(html).toBe(
      '<hdml-field name="int32_field" origin="origin" clause="clause(`field`)" type="int-32"></hdml-field>',
    );
  });

  it("must stringify `int32_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(5);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as integer) as "int32_field"',
    );
    expect(html).toBe(
      '<hdml-field name="int32_field" origin="origin" clause="clause(`field`)" type="int-32"></hdml-field>',
    );
  });

  it("must stringify `int64_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(6);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as bigint) as "int64_field"',
    );
    expect(html).toBe(
      '<hdml-field name="int64_field" origin="origin" clause="clause(`field`)" type="int-64"></hdml-field>',
    );
  });

  it("must stringify `int64_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(6);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as bigint) as "int64_field"',
    );
    expect(html).toBe(
      '<hdml-field name="int64_field" origin="origin" clause="clause(`field`)" type="int-64"></hdml-field>',
    );
  });

  it("must stringify `float32_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(7);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as real) as "float32_field"',
    );
    expect(html).toBe(
      '<hdml-field name="float32_field" origin="origin" clause="clause(`field`)" type="float-32"></hdml-field>',
    );
  });

  it("must stringify `float32_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(7);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as real) as "float32_field"',
    );
    expect(html).toBe(
      '<hdml-field name="float32_field" origin="origin" clause="clause(`field`)" type="float-32"></hdml-field>',
    );
  });

  it("must stringify `float64_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(8);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as double) as "float64_field"',
    );
    expect(html).toBe(
      '<hdml-field name="float64_field" origin="origin" clause="clause(`field`)" type="float-64"></hdml-field>',
    );
  });

  it("must stringify `float64_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(8);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as double) as "float64_field"',
    );
    expect(html).toBe(
      '<hdml-field name="float64_field" origin="origin" clause="clause(`field`)" type="float-64"></hdml-field>',
    );
  });

  it("must stringify `decimal_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.models(0)?.tables(0)?.fields(9);
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as decimal(18, 0))' +
        ' as "decimal_field"',
    );
    expect(html).toBe(
      '<hdml-field name="decimal_field" origin="origin" clause="clause(`field`)" type="decimal" scale="0" precision="18"></hdml-field>',
    );
  });

  it("must stringify `decimal_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(9);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as decimal(18, 0))' +
        ' as "decimal_field"',
    );
    expect(html).toBe(
      '<hdml-field name="decimal_field" origin="origin" clause="clause(`field`)" type="decimal" scale="0" precision="18"></hdml-field>',
    );
  });

  it("must stringify `date_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(10)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as date) as "date_field"',
    );
    expect(html).toBe(
      '<hdml-field name="date_field" origin="origin" clause="clause(`field`)" type="date"></hdml-field>',
    );
  });

  it("must stringify `date_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(10);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as date) as "date_field"',
    );
    expect(html).toBe(
      '<hdml-field name="date_field" origin="origin" clause="clause(`field`)" type="date"></hdml-field>',
    );
  });

  it("must stringify `time_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(11)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time(0)) as "time_field"',
    );
    expect(html).toBe(
      '<hdml-field name="time_field" origin="origin" clause="clause(`field`)" type="time" unit="second"></hdml-field>',
    );
  });

  it("must stringify `time_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(11);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time(0)) as "time_field"',
    );
    expect(html).toBe(
      '<hdml-field name="time_field" origin="origin" clause="clause(`field`)" type="time" unit="second"></hdml-field>',
    );
  });

  it("must stringify `timestamp_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(12)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone ' +
        "'UTC' as \"timestamp_field\"",
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="UTC"></hdml-field>',
    );
  });

  it("must stringify `timestamp_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(12);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone ' +
        "'UTC' as \"timestamp_field\"",
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="UTC"></hdml-field>',
    );
  });

  it("must stringify `binary_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(13)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varbinary) as "binary_field"',
    );
    expect(html).toBe(
      '<hdml-field name="binary_field" origin="origin" clause="clause(`field`)" type="binary"></hdml-field>',
    );
  });

  it("must stringify `binary_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(13);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varbinary) as "binary_field"',
    );
    expect(html).toBe(
      '<hdml-field name="binary_field" origin="origin" clause="clause(`field`)" type="binary"></hdml-field>',
    );
  });

  it("must stringify `utf8_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(14)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) as "utf8_field"',
    );
    expect(html).toBe(
      '<hdml-field name="utf8_field" origin="origin" clause="clause(`field`)" type="utf-8"></hdml-field>',
    );
  });

  it("must stringify `utf8_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(14);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) as "utf8_field"',
    );
    expect(html).toBe(
      '<hdml-field name="utf8_field" origin="origin" clause="clause(`field`)" type="utf-8"></hdml-field>',
    );
  });

  it("must stringify `count_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(15)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) as "count_field"',
    );
    expect(html).toBe(
      '<hdml-field name="count_field" origin="origin" clause="clause(`field`)" type="utf-8" aggregation="count"></hdml-field>',
    );
  });

  it("must stringify `count_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(15);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'count(try_cast(clause("field") as varchar)) as "count_field"',
    );
    expect(html).toBe(
      '<hdml-field name="count_field" origin="origin" clause="clause(`field`)" type="utf-8" aggregation="count"></hdml-field>',
    );
  });

  it("must stringify `count_distinct_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(16)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) ' +
        'as "count_distinct_field"',
    );
    expect(html).toBe(
      '<hdml-field name="count_distinct_field" origin="origin" clause="clause(`field`)" type="utf-8" aggregation="countDistinct"></hdml-field>',
    );
  });

  it("must stringify `count_distinct_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(16);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'count(distinct try_cast(clause("field") as varchar)) ' +
        'as "count_distinct_field"',
    );
    expect(html).toBe(
      '<hdml-field name="count_distinct_field" origin="origin" clause="clause(`field`)" type="utf-8" aggregation="countDistinct"></hdml-field>',
    );
  });

  it("must stringify `approx_distinct_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(17)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as varchar) ' +
        'as "approx_distinct_field"',
    );
    expect(html).toBe(
      '<hdml-field name="approx_distinct_field" origin="origin" clause="clause(`field`)" type="utf-8" aggregation="countDistinctApprox"></hdml-field>',
    );
  });

  it("must stringify `approx_distinct_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(17);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'approx_distinct(try_cast(clause("field") as varchar)) ' +
        'as "approx_distinct_field"',
    );
    expect(html).toBe(
      '<hdml-field name="approx_distinct_field" origin="origin" clause="clause(`field`)" type="utf-8" aggregation="countDistinctApprox"></hdml-field>',
    );
  });

  it("must stringify `min_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(18)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "min_field"',
    );
    expect(html).toBe(
      '<hdml-field name="min_field" origin="origin" clause="clause(`field`)" type="int-16" aggregation="min"></hdml-field>',
    );
  });

  it("must stringify `min_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(18);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'min(try_cast(clause("field") as smallint)) as "min_field"',
    );
    expect(html).toBe(
      '<hdml-field name="min_field" origin="origin" clause="clause(`field`)" type="int-16" aggregation="min"></hdml-field>',
    );
  });

  it("must stringify `max_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(19)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "max_field"',
    );
    expect(html).toBe(
      '<hdml-field name="max_field" origin="origin" clause="clause(`field`)" type="int-16" aggregation="max"></hdml-field>',
    );
  });

  it("must stringify `max_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(19);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'max(try_cast(clause("field") as smallint)) as "max_field"',
    );
    expect(html).toBe(
      '<hdml-field name="max_field" origin="origin" clause="clause(`field`)" type="int-16" aggregation="max"></hdml-field>',
    );
  });

  it("must stringify `sum_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(20)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "sum_field"',
    );
    expect(html).toBe(
      '<hdml-field name="sum_field" origin="origin" clause="clause(`field`)" type="int-16" aggregation="sum"></hdml-field>',
    );
  });

  it("must stringify `sum_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(20);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'sum(try_cast(clause("field") as smallint)) as "sum_field"',
    );
    expect(html).toBe(
      '<hdml-field name="sum_field" origin="origin" clause="clause(`field`)" type="int-16" aggregation="sum"></hdml-field>',
    );
  });

  it("must stringify `avg_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(21)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as smallint) as "avg_field"',
    );
    expect(html).toBe(
      '<hdml-field name="avg_field" origin="origin" clause="clause(`field`)" type="int-16" aggregation="avg"></hdml-field>',
    );
  });

  it("must stringify `avg_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(21);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'avg(try_cast(clause("field") as smallint)) as "avg_field"',
    );
    expect(html).toBe(
      '<hdml-field name="avg_field" origin="origin" clause="clause(`field`)" type="int-16" aggregation="avg"></hdml-field>',
    );
  });

  it("must stringify `noname_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(22)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe("");
    expect(html).toBe("");
  });

  it("must stringify `noname_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(22);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe("");
    expect(html).toBe("");
  });

  it("must stringify `time_millisecond_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(23)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time(3)) as "time_millisecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="time_millisecond_field" origin="origin" clause="clause(`field`)" type="time" unit="millisecond"></hdml-field>',
    );
  });

  it("must stringify `time_millisecond_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(23);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time(3)) as "time_millisecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="time_millisecond_field" origin="origin" clause="clause(`field`)" type="time" unit="millisecond"></hdml-field>',
    );
  });

  it("must stringify `time_microsecond_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(24)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time(6)) as "time_microsecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="time_microsecond_field" origin="origin" clause="clause(`field`)" type="time" unit="microsecond"></hdml-field>',
    );
  });

  it("must stringify `time_microsecond_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(24);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time(6)) as "time_microsecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="time_microsecond_field" origin="origin" clause="clause(`field`)" type="time" unit="microsecond"></hdml-field>',
    );
  });

  it("must stringify `time_nanosecond_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(25)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time(9)) as "time_nanosecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="time_nanosecond_field" origin="origin" clause="clause(`field`)" type="time" unit="nanosecond"></hdml-field>',
    );
  });

  it("must stringify `time_nanosecond_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(25);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as time(9)) ' +
        'as "time_nanosecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="time_nanosecond_field" origin="origin" clause="clause(`field`)" type="time" unit="nanosecond"></hdml-field>',
    );
  });

  it("must stringify `timestamp_millisecond_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(26)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(3)) at time zone \'UTC\' as "timestamp_millisecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_millisecond_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="millisecond" timezone="UTC"></hdml-field>',
    );
  });

  it("must stringify `timestamp_millisecond_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(26);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(3)) at time zone \'UTC\' as "timestamp_millisecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_millisecond_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="millisecond" timezone="UTC"></hdml-field>',
    );
  });

  it("must stringify `timestamp_microsecond_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(27)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(6)) at time zone \'UTC\' as "timestamp_microsecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_microsecond_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="microsecond" timezone="UTC"></hdml-field>',
    );
  });

  it("must stringify `timestamp_microsecond_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(27);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(6)) at time zone \'UTC\' as "timestamp_microsecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_microsecond_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="microsecond" timezone="UTC"></hdml-field>',
    );
  });

  it("must stringify `timestamp_nanosecond_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(28)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(9)) at time zone \'UTC\' as "timestamp_nanosecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_nanosecond_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="nanosecond" timezone="UTC"></hdml-field>',
    );
  });

  it("must stringify `timestamp_nanosecond_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(28);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(9)) at time zone \'UTC\' as "timestamp_nanosecond_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_nanosecond_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="nanosecond" timezone="UTC"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(29)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT\' as "timestamp_gmt_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(29);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT\' as "timestamp_gmt_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_01_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(30)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-01\' as "timestamp_gmt_m_01_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_01_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-01"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_01_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(30);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-01\' as "timestamp_gmt_m_01_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_01_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-01"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_02_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(31)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-02\' as "timestamp_gmt_m_02_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_02_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-02"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_02_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(31);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-02\' as "timestamp_gmt_m_02_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_02_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-02"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_03_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(32)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-03\' as "timestamp_gmt_m_03_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_03_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-03"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_03_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(32);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-03\' as "timestamp_gmt_m_03_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_03_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-03"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_04_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(33)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-04\' as "timestamp_gmt_m_04_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_04_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-04"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_04_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(33);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-04\' as "timestamp_gmt_m_04_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_04_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-04"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_05_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(34)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-05\' as "timestamp_gmt_m_05_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_05_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-05"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_05_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(34);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-05\' as "timestamp_gmt_m_05_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_05_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-05"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_06_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(35)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-06\' as "timestamp_gmt_m_06_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_06_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-06"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_06_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(35);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-06\' as "timestamp_gmt_m_06_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_06_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-06"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_07_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(36)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-07\' as "timestamp_gmt_m_07_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_07_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-07"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_07_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(36);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-07\' as "timestamp_gmt_m_07_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_07_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-07"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_08_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(37)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-08\' as "timestamp_gmt_m_08_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_08_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-08"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_08_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(37);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-08\' as "timestamp_gmt_m_08_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_08_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-08"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_09_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(38)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-09\' as "timestamp_gmt_m_09_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_09_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-09"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_09_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(38);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-09\' as "timestamp_gmt_m_09_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_09_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-09"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_10_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(39)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-10\' as "timestamp_gmt_m_10_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_10_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-10"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_10_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(39);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-10\' as "timestamp_gmt_m_10_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_10_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-10"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_11_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(40)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-11\' as "timestamp_gmt_m_11_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_11_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-11"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_11_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(40);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-11\' as "timestamp_gmt_m_11_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_11_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-11"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_12_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(41)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-12\' as "timestamp_gmt_m_12_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_12_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-12"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_m_12_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(41);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT-12\' as "timestamp_gmt_m_12_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_m_12_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT-12"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_01_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(42)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+01\' as "timestamp_gmt_p_01_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_01_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+01"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_01_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(42);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+01\' as "timestamp_gmt_p_01_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_01_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+01"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_02_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(43)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+02\' as "timestamp_gmt_p_02_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_02_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+02"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_02_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(43);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+02\' as "timestamp_gmt_p_02_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_02_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+02"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_03_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(44)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+03\' as "timestamp_gmt_p_03_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_03_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+03"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_03_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(44);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+03\' as "timestamp_gmt_p_03_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_03_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+03"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_04_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(45)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+04\' as "timestamp_gmt_p_04_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_04_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+04"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_04_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(45);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+04\' as "timestamp_gmt_p_04_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_04_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+04"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_05_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(46)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+05\' as "timestamp_gmt_p_05_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_05_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+05"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_05_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(46);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+05\' as "timestamp_gmt_p_05_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_05_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+05"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_06_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(47)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+06\' as "timestamp_gmt_p_06_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_06_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+06"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_06_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(47);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+06\' as "timestamp_gmt_p_06_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_06_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+06"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_07_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(48)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+07\' as "timestamp_gmt_p_07_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_07_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+07"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_07_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(48);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+07\' as "timestamp_gmt_p_07_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_07_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+07"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_08_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(49)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+08\' as "timestamp_gmt_p_08_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_08_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+08"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_08_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(49);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+08\' as "timestamp_gmt_p_08_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_08_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+08"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_09_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(50)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+09\' as "timestamp_gmt_p_09_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_09_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+09"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_09_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(50);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+09\' as "timestamp_gmt_p_09_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_09_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+09"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_10_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(51)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+10\' as "timestamp_gmt_p_10_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_10_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+10"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_10_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(51);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+10\' as "timestamp_gmt_p_10_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_10_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+10"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_11_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(52)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+11\' as "timestamp_gmt_p_11_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_11_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+11"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_11_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(52);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+11\' as "timestamp_gmt_p_11_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_11_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+11"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_12_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(53)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+12\' as "timestamp_gmt_p_12_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_12_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+12"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_12_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(53);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+12\' as "timestamp_gmt_p_12_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_12_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+12"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_13_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(54)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+13\' as "timestamp_gmt_p_13_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_13_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+13"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_13_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(54);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+13\' as "timestamp_gmt_p_13_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_13_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+13"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_14_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(55)
    );
    const sql = getTableFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+14\' as "timestamp_gmt_p_14_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_14_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+14"></hdml-field>',
    );
  });

  it("must stringify `timestamp_gmt_p_14_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(55);
    const sql = getFrameFieldSQL(field);
    const html = getFieldHTML(field);
    expect(sql).toBe(
      'try_cast(clause("field") as timestamp(0)) at time zone \'GMT+14\' as "timestamp_gmt_p_14_field"',
    );
    expect(html).toBe(
      '<hdml-field name="timestamp_gmt_p_14_field" origin="origin" clause="clause(`field`)" type="timestamp" unit="second" timezone="GMT+14"></hdml-field>',
    );
  });

  it("must stringify `asc_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(56)
    );
    const html = getFieldHTML(field);
    expect(html).toBe(
      '<hdml-field name="asc_field" origin="field" type="int-8" order="asc"></hdml-field>',
    );
  });

  it("must stringify `asc_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(56);
    const html = getFieldHTML(field);
    expect(html).toBe(
      '<hdml-field name="asc_field" origin="field" type="int-8" order="asc"></hdml-field>',
    );
  });

  it("must stringify `desc_field` table field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>(
      struct.models(0)?.tables(0)?.fields(57)
    );
    const html = getFieldHTML(field);
    expect(html).toBe(
      '<hdml-field name="desc_field" origin="field" type="int-8" order="desc"></hdml-field>',
    );
  });

  it("must stringify `desc_field` frame field", () => {
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const field = <FieldStruct>struct.frames(0)?.fields(57);
    const html = getFieldHTML(field);
    expect(html).toBe(
      '<hdml-field name="desc_field" origin="field" type="int-8" order="desc"></hdml-field>',
    );
  });
});

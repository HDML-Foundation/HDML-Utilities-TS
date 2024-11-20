/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  DecimalBitWidthEnum,
  DateUnitEnum,
  TimeUnitEnum,
  TimeZoneEnum,
} from "@hdml/schemas";
import {
  Field,
  FIELD_ATTRS_LIST,
  AGGREGATION_VALUES,
  ORDER_VALUES,
  FIELD_TYPE_VALUES,
  BITWIDTH_VALUES,
  DT_UNIT_VALUES,
  TIMEZONE_VALUES,
} from "@hdml/types";
import { Token } from "parse5";

export function getFieldData(attrs: Token.Attribute[]): null | Field {
  let name: null | string = null;
  let description: null | string = null;
  let origin: null | string = null;
  let clause: null | string = null;
  let type: null | string = null;
  let scale: null | string = null;
  let precision: null | string = null;
  let bitwidth: DecimalBitWidthEnum = DecimalBitWidthEnum._128;
  let unit: TimeUnitEnum = TimeUnitEnum.Millisecond;
  let timezone: TimeZoneEnum = TimeZoneEnum.UTC;
  let nullable: null | string = null;
  let aggregation: AggregationTypeEnum = AggregationTypeEnum.None;
  let order: OrderTypeEnum = OrderTypeEnum.None;

  attrs.forEach((attr) => {
    switch (attr.name as FIELD_ATTRS_LIST) {
      case FIELD_ATTRS_LIST.NAME:
        name = attr.value;
        break;
      case FIELD_ATTRS_LIST.DESCRIPTION:
        description = attr.value;
        break;
      case FIELD_ATTRS_LIST.ORIGIN:
        origin = attr.value;
        break;
      case FIELD_ATTRS_LIST.CLAUSE:
        clause = attr.value;
        break;
      case FIELD_ATTRS_LIST.TYPE:
        type = attr.value;
        break;
      case FIELD_ATTRS_LIST.SCALE:
        scale = attr.value;
        break;
      case FIELD_ATTRS_LIST.PRECISION:
        precision = attr.value;
        break;
      case FIELD_ATTRS_LIST.BITWIDTH:
        switch (attr.value as BITWIDTH_VALUES) {
          case BITWIDTH_VALUES._128:
            bitwidth = DecimalBitWidthEnum._128;
            break;
          case BITWIDTH_VALUES._256:
            bitwidth = DecimalBitWidthEnum._256;
            break;
        }
        break;
      case FIELD_ATTRS_LIST.UNIT:
        switch (attr.value as DT_UNIT_VALUES) {
          case DT_UNIT_VALUES.SECOND:
            unit = TimeUnitEnum.Second;
            break;
          case DT_UNIT_VALUES.MILLISECOND:
            unit = TimeUnitEnum.Millisecond;
            break;
          case DT_UNIT_VALUES.MICROSECOND:
            unit = TimeUnitEnum.Microsecond;
            break;
          case DT_UNIT_VALUES.NANOSECOND:
            unit = TimeUnitEnum.Nanosecond;
            break;
        }
        break;
      case FIELD_ATTRS_LIST.TIMEZONE:
        switch (attr.value as TIMEZONE_VALUES) {
          case TIMEZONE_VALUES.UTC:
            timezone = TimeZoneEnum.UTC;
            break;
          case TIMEZONE_VALUES.GMT:
            timezone = TimeZoneEnum.GMT;
            break;
          case TIMEZONE_VALUES.GMT_m_12:
            timezone = TimeZoneEnum.GMT_m_12;
            break;
          case TIMEZONE_VALUES.GMT_m_11:
            timezone = TimeZoneEnum.GMT_m_11;
            break;
          case TIMEZONE_VALUES.GMT_m_10:
            timezone = TimeZoneEnum.GMT_m_10;
            break;
          case TIMEZONE_VALUES.GMT_m_09:
            timezone = TimeZoneEnum.GMT_m_09;
            break;
          case TIMEZONE_VALUES.GMT_m_08:
            timezone = TimeZoneEnum.GMT_m_08;
            break;
          case TIMEZONE_VALUES.GMT_m_07:
            timezone = TimeZoneEnum.GMT_m_07;
            break;
          case TIMEZONE_VALUES.GMT_m_06:
            timezone = TimeZoneEnum.GMT_m_06;
            break;
          case TIMEZONE_VALUES.GMT_m_05:
            timezone = TimeZoneEnum.GMT_m_05;
            break;
          case TIMEZONE_VALUES.GMT_m_04:
            timezone = TimeZoneEnum.GMT_m_04;
            break;
          case TIMEZONE_VALUES.GMT_m_03:
            timezone = TimeZoneEnum.GMT_m_03;
            break;
          case TIMEZONE_VALUES.GMT_m_02:
            timezone = TimeZoneEnum.GMT_m_02;
            break;
          case TIMEZONE_VALUES.GMT_m_01:
            timezone = TimeZoneEnum.GMT_m_01;
            break;
          case TIMEZONE_VALUES.GMT_p_01:
            timezone = TimeZoneEnum.GMT_p_01;
            break;
          case TIMEZONE_VALUES.GMT_p_02:
            timezone = TimeZoneEnum.GMT_p_02;
            break;
          case TIMEZONE_VALUES.GMT_p_03:
            timezone = TimeZoneEnum.GMT_p_03;
            break;
          case TIMEZONE_VALUES.GMT_p_04:
            timezone = TimeZoneEnum.GMT_p_04;
            break;
          case TIMEZONE_VALUES.GMT_p_05:
            timezone = TimeZoneEnum.GMT_p_05;
            break;
          case TIMEZONE_VALUES.GMT_p_06:
            timezone = TimeZoneEnum.GMT_p_06;
            break;
          case TIMEZONE_VALUES.GMT_p_07:
            timezone = TimeZoneEnum.GMT_p_07;
            break;
          case TIMEZONE_VALUES.GMT_p_08:
            timezone = TimeZoneEnum.GMT_p_08;
            break;
          case TIMEZONE_VALUES.GMT_p_09:
            timezone = TimeZoneEnum.GMT_p_09;
            break;
          case TIMEZONE_VALUES.GMT_p_10:
            timezone = TimeZoneEnum.GMT_p_10;
            break;
          case TIMEZONE_VALUES.GMT_p_11:
            timezone = TimeZoneEnum.GMT_p_11;
            break;
          case TIMEZONE_VALUES.GMT_p_12:
            timezone = TimeZoneEnum.GMT_p_12;
            break;
          case TIMEZONE_VALUES.GMT_p_13:
            timezone = TimeZoneEnum.GMT_p_13;
            break;
          case TIMEZONE_VALUES.GMT_p_14:
            timezone = TimeZoneEnum.GMT_p_14;
            break;
        }
        break;
      case FIELD_ATTRS_LIST.NULLABLE:
        nullable = attr.value;
        break;
      case FIELD_ATTRS_LIST.AGGREGATION:
        switch (attr.value as AGGREGATION_VALUES) {
          case AGGREGATION_VALUES.AVG:
            aggregation = AggregationTypeEnum.Avg;
            break;
          case AGGREGATION_VALUES.COUNT:
            aggregation = AggregationTypeEnum.Count;
            break;
          case AGGREGATION_VALUES.COUNT_DISTINCT:
            aggregation = AggregationTypeEnum.CountDistinct;
            break;
          case AGGREGATION_VALUES.COUNT_DISTINCT_APPROX:
            aggregation = AggregationTypeEnum.CountDistinctApprox;
            break;
          case AGGREGATION_VALUES.MAX:
            aggregation = AggregationTypeEnum.Max;
            break;
          case AGGREGATION_VALUES.MIN:
            aggregation = AggregationTypeEnum.Min;
            break;
          case AGGREGATION_VALUES.SUM:
            aggregation = AggregationTypeEnum.Sum;
            break;
        }
        break;
      case FIELD_ATTRS_LIST.ORDER:
        switch (attr.value as ORDER_VALUES) {
          case ORDER_VALUES.ASC:
            order = OrderTypeEnum.Ascending;
            break;
          case ORDER_VALUES.DESC:
            order = OrderTypeEnum.Descending;
            break;
        }
        break;
    }
  });

  if (!name) {
    return null;
  }

  const data: Field = {
    name,
    description: description || null,
    origin: origin || null,
    clause: clause || null,
    type: {
      type: DataTypeEnum.Unspecified,
    },
    aggregation,
    order,
  };

  if (type) {
    switch (type) {
      case FIELD_TYPE_VALUES.INT8:
        data.type = getCommonDataType(DataTypeEnum.Int8, nullable);
        break;
      case FIELD_TYPE_VALUES.INT16:
        data.type = getCommonDataType(DataTypeEnum.Int16, nullable);
        break;
      case FIELD_TYPE_VALUES.INT32:
        data.type = getCommonDataType(DataTypeEnum.Int32, nullable);
        break;
      case FIELD_TYPE_VALUES.INT64:
        data.type = getCommonDataType(DataTypeEnum.Int64, nullable);
        break;
      case FIELD_TYPE_VALUES.FLOAT32:
        data.type = getCommonDataType(DataTypeEnum.Float32, nullable);
        break;
      case FIELD_TYPE_VALUES.FLOAT64:
        data.type = getCommonDataType(DataTypeEnum.Float64, nullable);
        break;
      case FIELD_TYPE_VALUES.BINARY:
        data.type = getCommonDataType(DataTypeEnum.Binary, nullable);
        break;
      case FIELD_TYPE_VALUES.UTF8:
        data.type = getCommonDataType(DataTypeEnum.Utf8, nullable);
        break;
      case FIELD_TYPE_VALUES.DECIMAL:
        data.type = {
          type: DataTypeEnum.Decimal,
          options: {
            nullable: nullable === "true",
            precision: precision ? parseInt(precision) : 18,
            scale: scale ? parseInt(scale) : 0,
            bit_width: bitwidth,
          },
        };
        break;
      case FIELD_TYPE_VALUES.DATE:
        data.type = {
          type: DataTypeEnum.Date,
          options: {
            nullable: nullable === "true",
            unit: unit as unknown as DateUnitEnum,
          },
        };
        break;
      case FIELD_TYPE_VALUES.TIME:
        data.type = {
          type: DataTypeEnum.Time,
          options: {
            nullable: nullable === "true",
            unit,
          },
        };
        break;
      case FIELD_TYPE_VALUES.TIMESTAMP:
        data.type = {
          type: DataTypeEnum.Timestamp,
          options: {
            nullable: nullable === "true",
            timezone,
            unit,
          },
        };
        break;
    }
  }

  return data;
}

function getCommonDataType(
  type:
    | DataTypeEnum.Int8
    | DataTypeEnum.Int16
    | DataTypeEnum.Int32
    | DataTypeEnum.Int64
    | DataTypeEnum.Float32
    | DataTypeEnum.Float64
    | DataTypeEnum.Binary
    | DataTypeEnum.Utf8,
  nullable: null | string,
) {
  return {
    type,
    options: {
      nullable: nullable === "true",
    },
  };
}

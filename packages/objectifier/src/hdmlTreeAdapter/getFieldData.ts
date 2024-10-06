/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  IField,
  DataType,
  AggregationType,
  OrderType,
  DecimalBitWidth,
  DateUnit,
  TimeUnit,
  TimeZone,
} from "@hdml/schemas";
import { Token } from "parse5";
import { FIELD_ATTRS_LIST } from "../enums/FIELD_ATTRS_LIST";
import { AGGREGATION_VALUES } from "../enums/AGGREGATION_VALUES";
import { ORDER_VALUES } from "../enums/ORDER_VALUES";
import { FIELD_TYPE_VALUES } from "../enums/FIELD_TYPE_VALUES";
import { BITWIDTH_VALUES } from "../enums/BITWIDTH_VALUES";
import { DT_UNIT_VALUES } from "../enums/DT_UNIT_VALUES";
import { TIMEZONE_VALUES } from "../enums/TIMEZONE_VALUES";

export function getFieldData(
  attrs: Token.Attribute[],
): null | IField {
  let name: null | string = null;
  let description: null | string = null;
  let origin: null | string = null;
  let clause: null | string = null;
  let type: null | string = null;
  let scale: null | string = null;
  let precision: null | string = null;
  let bitwidth: DecimalBitWidth = DecimalBitWidth._128;
  let unit: TimeUnit = TimeUnit.Millisecond;
  let timezone: TimeZone = TimeZone.UTC;
  let nullable: null | string = null;
  let aggregation: AggregationType = AggregationType.None;
  let order: OrderType = OrderType.None;

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
            bitwidth = DecimalBitWidth._128;
            break;
          case BITWIDTH_VALUES._256:
            bitwidth = DecimalBitWidth._256;
            break;
        }
        break;
      case FIELD_ATTRS_LIST.UNIT:
        switch (attr.value as DT_UNIT_VALUES) {
          case DT_UNIT_VALUES.SECOND:
            unit = TimeUnit.Second;
            break;
          case DT_UNIT_VALUES.MILLISECOND:
            unit = TimeUnit.Millisecond;
            break;
          case DT_UNIT_VALUES.MICROSECOND:
            unit = TimeUnit.Microsecond;
            break;
          case DT_UNIT_VALUES.NANOSECOND:
            unit = TimeUnit.Nanosecond;
            break;
        }
        break;
      case FIELD_ATTRS_LIST.TIMEZONE:
        switch (attr.value as TIMEZONE_VALUES) {
          case TIMEZONE_VALUES.UTC:
            timezone = TimeZone.UTC;
            break;
          case TIMEZONE_VALUES.GMT:
            timezone = TimeZone.GMT;
            break;
          case TIMEZONE_VALUES.GMT_m_12:
            timezone = TimeZone.GMT_m_12;
            break;
          case TIMEZONE_VALUES.GMT_m_11:
            timezone = TimeZone.GMT_m_11;
            break;
          case TIMEZONE_VALUES.GMT_m_10:
            timezone = TimeZone.GMT_m_10;
            break;
          case TIMEZONE_VALUES.GMT_m_09:
            timezone = TimeZone.GMT_m_09;
            break;
          case TIMEZONE_VALUES.GMT_m_08:
            timezone = TimeZone.GMT_m_08;
            break;
          case TIMEZONE_VALUES.GMT_m_07:
            timezone = TimeZone.GMT_m_07;
            break;
          case TIMEZONE_VALUES.GMT_m_06:
            timezone = TimeZone.GMT_m_06;
            break;
          case TIMEZONE_VALUES.GMT_m_05:
            timezone = TimeZone.GMT_m_05;
            break;
          case TIMEZONE_VALUES.GMT_m_04:
            timezone = TimeZone.GMT_m_04;
            break;
          case TIMEZONE_VALUES.GMT_m_03:
            timezone = TimeZone.GMT_m_03;
            break;
          case TIMEZONE_VALUES.GMT_m_02:
            timezone = TimeZone.GMT_m_02;
            break;
          case TIMEZONE_VALUES.GMT_m_01:
            timezone = TimeZone.GMT_m_01;
            break;
          case TIMEZONE_VALUES.GMT_p_01:
            timezone = TimeZone.GMT_p_01;
            break;
          case TIMEZONE_VALUES.GMT_p_02:
            timezone = TimeZone.GMT_p_02;
            break;
          case TIMEZONE_VALUES.GMT_p_03:
            timezone = TimeZone.GMT_p_03;
            break;
          case TIMEZONE_VALUES.GMT_p_04:
            timezone = TimeZone.GMT_p_04;
            break;
          case TIMEZONE_VALUES.GMT_p_05:
            timezone = TimeZone.GMT_p_05;
            break;
          case TIMEZONE_VALUES.GMT_p_06:
            timezone = TimeZone.GMT_p_06;
            break;
          case TIMEZONE_VALUES.GMT_p_07:
            timezone = TimeZone.GMT_p_07;
            break;
          case TIMEZONE_VALUES.GMT_p_08:
            timezone = TimeZone.GMT_p_08;
            break;
          case TIMEZONE_VALUES.GMT_p_09:
            timezone = TimeZone.GMT_p_09;
            break;
          case TIMEZONE_VALUES.GMT_p_10:
            timezone = TimeZone.GMT_p_10;
            break;
          case TIMEZONE_VALUES.GMT_p_11:
            timezone = TimeZone.GMT_p_11;
            break;
          case TIMEZONE_VALUES.GMT_p_12:
            timezone = TimeZone.GMT_p_12;
            break;
          case TIMEZONE_VALUES.GMT_p_13:
            timezone = TimeZone.GMT_p_13;
            break;
          case TIMEZONE_VALUES.GMT_p_14:
            timezone = TimeZone.GMT_p_14;
            break;
        }
        break;
      case FIELD_ATTRS_LIST.NULLABLE:
        nullable = attr.value;
        break;
      case FIELD_ATTRS_LIST.AGGREGATION:
        switch (attr.value as AGGREGATION_VALUES) {
          case AGGREGATION_VALUES.AVG:
            aggregation = AggregationType.Avg;
            break;
          case AGGREGATION_VALUES.COUNT:
            aggregation = AggregationType.Count;
            break;
          case AGGREGATION_VALUES.COUNT_DISTINCT:
            aggregation = AggregationType.CountDistinct;
            break;
          case AGGREGATION_VALUES.COUNT_DISTINCT_APPROX:
            aggregation = AggregationType.CountDistinctApprox;
            break;
          case AGGREGATION_VALUES.MAX:
            aggregation = AggregationType.Max;
            break;
          case AGGREGATION_VALUES.MIN:
            aggregation = AggregationType.Min;
            break;
          case AGGREGATION_VALUES.SUM:
            aggregation = AggregationType.Sum;
            break;
        }
        break;
      case FIELD_ATTRS_LIST.ORDER:
        switch (attr.value as ORDER_VALUES) {
          case ORDER_VALUES.ASC:
            order = OrderType.Ascending;
            break;
          case ORDER_VALUES.DESC:
            order = OrderType.Descending;
            break;
        }
        break;
    }
  });

  if (!name) {
    return null;
  }

  const data: Partial<IField> & { name: string } = {
    name,
    description: description || undefined,
    origin: origin || undefined,
    clause: clause || undefined,
    aggregation,
    order,
  };

  // let dataType: unknown = null;
  if (type) {
    switch (type) {
      case FIELD_TYPE_VALUES.INT8:
        data.type = getCommonDataType(DataType.Int8, nullable);
        break;
      case FIELD_TYPE_VALUES.INT16:
        data.type = getCommonDataType(DataType.Int16, nullable);
        break;
      case FIELD_TYPE_VALUES.INT32:
        data.type = getCommonDataType(DataType.Int32, nullable);
        break;
      case FIELD_TYPE_VALUES.INT64:
        data.type = getCommonDataType(DataType.Int64, nullable);
        break;
      case FIELD_TYPE_VALUES.FLOAT32:
        data.type = getCommonDataType(DataType.Float32, nullable);
        break;
      case FIELD_TYPE_VALUES.FLOAT64:
        data.type = getCommonDataType(DataType.Float64, nullable);
        break;
      case FIELD_TYPE_VALUES.BINARY:
        data.type = getCommonDataType(DataType.Binary, nullable);
        break;
      case FIELD_TYPE_VALUES.UTF8:
        data.type = getCommonDataType(DataType.Utf8, nullable);
        break;
      case FIELD_TYPE_VALUES.DECIMAL:
        data.type = {
          type: DataType.Decimal,
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
          type: DataType.Date,
          options: {
            nullable: nullable === "true",
            unit: unit as unknown as DateUnit,
          },
        };
        break;
      case FIELD_TYPE_VALUES.TIME:
        data.type = {
          type: DataType.Time,
          options: {
            nullable: nullable === "true",
            unit,
          },
        };
        break;
      case FIELD_TYPE_VALUES.TIMESTAMP:
        data.type = {
          type: DataType.Timestamp,
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
    | DataType.Int8
    | DataType.Int16
    | DataType.Int32
    | DataType.Int64
    | DataType.Float32
    | DataType.Float64
    | DataType.Binary
    | DataType.Utf8,
  nullable: null | string,
) {
  return {
    type,
    options: {
      nullable: nullable === "true",
    },
  };
}

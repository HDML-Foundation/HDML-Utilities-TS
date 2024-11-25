/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  FieldStruct,
  FieldTypeStruct,
  DataTypeEnum,
  AggregationTypeEnum,
  DecimalParametersStruct,
  DateParametersStruct,
  TimeParametersStruct,
  TimestampParametersStruct,
  TimeUnitEnum,
  TimeZoneEnum,
  OrderTypeEnum,
} from "@hdml/schemas";
import {
  HDML_TAG_NAMES,
  FIELD_ATTRS_LIST,
  FIELD_TYPE_VALUES,
  ORDER_VALUES,
  AGGREGATION_VALUES,
  DT_UNIT_VALUES,
  TIMEZONE_VALUES,
} from "@hdml/types";

export function getTableFieldSQL(field: FieldStruct): string {
  const type = field.type();
  const name = field.name();
  const origin = field.origin();
  const clause = field.clause();

  if (!name) {
    return "";
  } else {
    if (!type || type.type() === DataTypeEnum.Unspecified) {
      return getNamedFieldSQL(
        name,
        getPlainClauseSQL(name, origin, clause),
      );
    } else {
      return getNamedFieldSQL(
        name,
        getCastedClauseSQL(
          getPlainClauseSQL(name, origin, clause),
          type,
        ),
      );
    }
  }
}

export function getFrameFieldSQL(field: FieldStruct): string {
  const type = field.type();
  const name = field.name();
  const origin = field.origin();
  const clause = field.clause();
  const aggregation = field.aggregation();

  if (!name) {
    return "";
  } else {
    if (!type || type.type() === DataTypeEnum.Unspecified) {
      return getNamedFieldSQL(
        name,
        getGroupedClauseSQL(
          getPlainClauseSQL(name, origin, clause),
          aggregation,
        ),
      );
    } else {
      return getNamedFieldSQL(
        name,
        getGroupedClauseSQL(
          getCastedClauseSQL(
            getPlainClauseSQL(name, origin, clause),
            type,
          ),
          aggregation,
        ),
      );
    }
  }
}

export function getNamedFieldSQL(
  name: string,
  clause: string,
): string {
  return `${clause} as "${name}"`;
}

export function getPlainClauseSQL(
  name: string,
  origin: null | string,
  clause: null | string,
): string {
  return clause ? clause : `"${origin || name}"`;
}

export function getGroupedClauseSQL(
  clause: string,
  agg: AggregationTypeEnum,
): string {
  switch (agg) {
    case AggregationTypeEnum.Count:
      clause = `count(${clause})`;
      break;
    case AggregationTypeEnum.CountDistinct:
      clause = `count(distinct ${clause})`;
      break;
    case AggregationTypeEnum.CountDistinctApprox:
      clause = `approx_distinct(${clause})`;
      break;
    case AggregationTypeEnum.Min:
      clause = `min(${clause})`;
      break;
    case AggregationTypeEnum.Max:
      clause = `max(${clause})`;
      break;
    case AggregationTypeEnum.Sum:
      clause = `sum(${clause})`;
      break;
    case AggregationTypeEnum.Avg:
      clause = `avg(${clause})`;
      break;
    case AggregationTypeEnum.None:
      break;
  }
  return clause;
}

export function getCastedClauseSQL(
  clause: string,
  type: FieldTypeStruct,
): string {
  let sql = "";
  let options:
    | DecimalParametersStruct
    | DateParametersStruct
    | TimeParametersStruct
    | TimestampParametersStruct;

  switch (type.type()) {
    case DataTypeEnum.Int8:
      sql = `try_cast(${clause} as tinyint)`;
      break;
    case DataTypeEnum.Int16:
      sql = `try_cast(${clause} as smallint)`;
      break;
    case DataTypeEnum.Int32:
      sql = `try_cast(${clause} as integer)`;
      break;
    case DataTypeEnum.Int64:
      sql = `try_cast(${clause} as bigint)`;
      break;
    case DataTypeEnum.Float32:
      sql = `try_cast(${clause} as real)`;
      break;
    case DataTypeEnum.Float64:
      sql = `try_cast(${clause} as double)`;
      break;
    case DataTypeEnum.Decimal:
      options = type.options(
        new DecimalParametersStruct(),
      ) as DecimalParametersStruct;
      sql =
        `try_cast(${clause} as ` +
        `decimal(${options.precision()}, ` +
        `${options.scale()}))`;
      break;
    case DataTypeEnum.Date:
      options = type.options(
        new DateParametersStruct(),
      ) as DateParametersStruct;
      sql = `try_cast(${clause} as date)`;
      break;
    case DataTypeEnum.Time:
      options = type.options(
        new TimeParametersStruct(),
      ) as TimeParametersStruct;
      switch (options.unit()) {
        case TimeUnitEnum.Second:
          sql = `try_cast(${clause} as time(0))`;
          break;
        case TimeUnitEnum.Millisecond:
          sql = `try_cast(${clause} as time(3))`;
          break;
        case TimeUnitEnum.Microsecond:
          sql = `try_cast(${clause} as time(6))`;
          break;
        case TimeUnitEnum.Nanosecond:
          sql = `try_cast(${clause} as time(9))`;
          break;
      }
      break;
    case DataTypeEnum.Timestamp:
      options = type.options(
        new TimestampParametersStruct(),
      ) as TimestampParametersStruct;
      switch (options.unit()) {
        case TimeUnitEnum.Second:
          sql = `try_cast(${clause} as timestamp(0))`;
          break;
        case TimeUnitEnum.Millisecond:
          sql = `try_cast(${clause} as timestamp(3))`;
          break;
        case TimeUnitEnum.Microsecond:
          sql = `try_cast(${clause} as timestamp(6))`;
          break;
        case TimeUnitEnum.Nanosecond:
          sql = `try_cast(${clause} as timestamp(9))`;
          break;
      }
      switch ((<TimestampParametersStruct>options).timezone()) {
        case TimeZoneEnum.UTC:
          sql = `${sql} at time zone 'UTC'`;
          break;
        case TimeZoneEnum.GMT:
          sql = `${sql} at time zone 'GMT'`;
          break;
        case TimeZoneEnum.GMT_m_01:
          sql = `${sql} at time zone 'GMT-01'`;
          break;
        case TimeZoneEnum.GMT_m_02:
          sql = `${sql} at time zone 'GMT-02'`;
          break;
        case TimeZoneEnum.GMT_m_03:
          sql = `${sql} at time zone 'GMT-03'`;
          break;
        case TimeZoneEnum.GMT_m_04:
          sql = `${sql} at time zone 'GMT-04'`;
          break;
        case TimeZoneEnum.GMT_m_05:
          sql = `${sql} at time zone 'GMT-05'`;
          break;
        case TimeZoneEnum.GMT_m_06:
          sql = `${sql} at time zone 'GMT-06'`;
          break;
        case TimeZoneEnum.GMT_m_07:
          sql = `${sql} at time zone 'GMT-07'`;
          break;
        case TimeZoneEnum.GMT_m_08:
          sql = `${sql} at time zone 'GMT-08'`;
          break;
        case TimeZoneEnum.GMT_m_09:
          sql = `${sql} at time zone 'GMT-09'`;
          break;
        case TimeZoneEnum.GMT_m_10:
          sql = `${sql} at time zone 'GMT-10'`;
          break;
        case TimeZoneEnum.GMT_m_11:
          sql = `${sql} at time zone 'GMT-11'`;
          break;
        case TimeZoneEnum.GMT_m_12:
          sql = `${sql} at time zone 'GMT-12'`;
          break;
        case TimeZoneEnum.GMT_p_01:
          sql = `${sql} at time zone 'GMT+01'`;
          break;
        case TimeZoneEnum.GMT_p_02:
          sql = `${sql} at time zone 'GMT+02'`;
          break;
        case TimeZoneEnum.GMT_p_03:
          sql = `${sql} at time zone 'GMT+03'`;
          break;
        case TimeZoneEnum.GMT_p_04:
          sql = `${sql} at time zone 'GMT+04'`;
          break;
        case TimeZoneEnum.GMT_p_05:
          sql = `${sql} at time zone 'GMT+05'`;
          break;
        case TimeZoneEnum.GMT_p_06:
          sql = `${sql} at time zone 'GMT+06'`;
          break;
        case TimeZoneEnum.GMT_p_07:
          sql = `${sql} at time zone 'GMT+07'`;
          break;
        case TimeZoneEnum.GMT_p_08:
          sql = `${sql} at time zone 'GMT+08'`;
          break;
        case TimeZoneEnum.GMT_p_09:
          sql = `${sql} at time zone 'GMT+09'`;
          break;
        case TimeZoneEnum.GMT_p_10:
          sql = `${sql} at time zone 'GMT+10'`;
          break;
        case TimeZoneEnum.GMT_p_11:
          sql = `${sql} at time zone 'GMT+11'`;
          break;
        case TimeZoneEnum.GMT_p_12:
          sql = `${sql} at time zone 'GMT+12'`;
          break;
        case TimeZoneEnum.GMT_p_13:
          sql = `${sql} at time zone 'GMT+13'`;
          break;
        case TimeZoneEnum.GMT_p_14:
          sql = `${sql} at time zone 'GMT+14'`;
          break;
      }
      break;
    case DataTypeEnum.Binary:
      sql = `try_cast(${clause} as varbinary)`;
      break;
    case DataTypeEnum.Utf8:
      sql = `try_cast(${clause} as varchar)`;
      break;
  }
  return sql;
}

export function getFieldHTML(field: FieldStruct): string {
  if (field.name() === null) {
    return "";
  } else {
    let result =
      `<${HDML_TAG_NAMES.FIELD} ` +
      `${FIELD_ATTRS_LIST.NAME}="${field.name()}"`;

    if (field.origin() !== null) {
      result =
        result + ` ${FIELD_ATTRS_LIST.ORIGIN}="${field.origin()}"`;
    }

    if (field.clause() !== null) {
      result =
        result +
        ` ${FIELD_ATTRS_LIST.CLAUSE}=` +
        `"${field.clause()!.replaceAll('"', "`")}"`;
    }

    if (field.type() !== null) {
      result = result + getFieldTypeHTML(field.type()!);
    }

    result = result + getFieldAggregationHTML(field.aggregation());
    result = result + getFieldOrderHTML(field.order());
    result = result + `></${HDML_TAG_NAMES.FIELD}>`;

    return result;
  }
}

export function getFieldTypeHTML(type: FieldTypeStruct): string {
  let dt = "";
  let options:
    | DecimalParametersStruct
    | DateParametersStruct
    | TimeParametersStruct
    | TimestampParametersStruct;

  switch (type.type()) {
    case DataTypeEnum.Int8:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.INT8}"`;
      break;

    case DataTypeEnum.Int16:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.INT16}"`;
      break;

    case DataTypeEnum.Int32:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.INT32}"`;
      break;

    case DataTypeEnum.Int64:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.INT64}"`;
      break;

    case DataTypeEnum.Float32:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.FLOAT32}"`;
      break;

    case DataTypeEnum.Float64:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.FLOAT64}"`;
      break;

    case DataTypeEnum.Decimal:
      options = type.options(
        new DecimalParametersStruct(),
      ) as DecimalParametersStruct;
      dt =
        ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.DECIMAL}"` +
        ` ${FIELD_ATTRS_LIST.SCALE}="${options.scale()}"` +
        ` ${FIELD_ATTRS_LIST.PRECISION}="${options.precision()}"`;
      break;

    case DataTypeEnum.Date:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.DATE}"`;
      break;

    case DataTypeEnum.Time:
      options = type.options(
        new TimeParametersStruct(),
      ) as TimeParametersStruct;
      switch (options.unit()) {
        case TimeUnitEnum.Second:
          dt =
            ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.TIME}" ` +
            `${FIELD_ATTRS_LIST.UNIT}="${DT_UNIT_VALUES.SECOND}"`;
          break;
        case TimeUnitEnum.Millisecond:
          dt =
            ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.TIME}" ` +
            `${FIELD_ATTRS_LIST.UNIT}=` +
            `"${DT_UNIT_VALUES.MILLISECOND}"`;
          break;
        case TimeUnitEnum.Microsecond:
          dt =
            ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.TIME}" ` +
            `${FIELD_ATTRS_LIST.UNIT}=` +
            `"${DT_UNIT_VALUES.MICROSECOND}"`;
          break;
        case TimeUnitEnum.Nanosecond:
          dt =
            ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.TIME}" ` +
            `${FIELD_ATTRS_LIST.UNIT}="${DT_UNIT_VALUES.NANOSECOND}"`;
          break;
      }
      break;

    case DataTypeEnum.Timestamp:
      options = type.options(
        new TimestampParametersStruct(),
      ) as TimestampParametersStruct;
      switch (options.unit()) {
        case TimeUnitEnum.Second:
          dt =
            ` ${FIELD_ATTRS_LIST.TYPE}=` +
            `"${FIELD_TYPE_VALUES.TIMESTAMP}" ` +
            `${FIELD_ATTRS_LIST.UNIT}="${DT_UNIT_VALUES.SECOND}"`;
          break;
        case TimeUnitEnum.Millisecond:
          dt =
            ` ${FIELD_ATTRS_LIST.TYPE}=` +
            `"${FIELD_TYPE_VALUES.TIMESTAMP}" ` +
            `${FIELD_ATTRS_LIST.UNIT}=` +
            `"${DT_UNIT_VALUES.MILLISECOND}"`;
          break;
        case TimeUnitEnum.Microsecond:
          dt =
            ` ${FIELD_ATTRS_LIST.TYPE}=` +
            `"${FIELD_TYPE_VALUES.TIMESTAMP}" ` +
            `${FIELD_ATTRS_LIST.UNIT}=` +
            `"${DT_UNIT_VALUES.MICROSECOND}"`;
          break;
        case TimeUnitEnum.Nanosecond:
          dt =
            ` ${FIELD_ATTRS_LIST.TYPE}=` +
            `"${FIELD_TYPE_VALUES.TIMESTAMP}" ` +
            `${FIELD_ATTRS_LIST.UNIT}="${DT_UNIT_VALUES.NANOSECOND}"`;
          break;
      }
      switch ((<TimestampParametersStruct>options).timezone()) {
        case TimeZoneEnum.UTC:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.UTC}"`;
          break;
        case TimeZoneEnum.GMT:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT}"`;
          break;
        case TimeZoneEnum.GMT_m_01:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_01}"`;
          break;
        case TimeZoneEnum.GMT_m_02:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_02}"`;
          break;
        case TimeZoneEnum.GMT_m_03:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_03}"`;
          break;
        case TimeZoneEnum.GMT_m_04:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_04}"`;
          break;
        case TimeZoneEnum.GMT_m_05:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_05}"`;
          break;
        case TimeZoneEnum.GMT_m_06:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_06}"`;
          break;
        case TimeZoneEnum.GMT_m_07:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_07}"`;
          break;
        case TimeZoneEnum.GMT_m_08:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_08}"`;
          break;
        case TimeZoneEnum.GMT_m_09:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_09}"`;
          break;
        case TimeZoneEnum.GMT_m_10:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_10}"`;
          break;
        case TimeZoneEnum.GMT_m_11:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_11}"`;
          break;
        case TimeZoneEnum.GMT_m_12:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_m_12}"`;
          break;
        case TimeZoneEnum.GMT_p_01:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_01}"`;
          break;
        case TimeZoneEnum.GMT_p_02:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_02}"`;
          break;
        case TimeZoneEnum.GMT_p_03:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_03}"`;
          break;
        case TimeZoneEnum.GMT_p_04:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_04}"`;
          break;
        case TimeZoneEnum.GMT_p_05:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_05}"`;
          break;
        case TimeZoneEnum.GMT_p_06:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_06}"`;
          break;
        case TimeZoneEnum.GMT_p_07:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_07}"`;
          break;
        case TimeZoneEnum.GMT_p_08:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_08}"`;
          break;
        case TimeZoneEnum.GMT_p_09:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_09}"`;
          break;
        case TimeZoneEnum.GMT_p_10:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_10}"`;
          break;
        case TimeZoneEnum.GMT_p_11:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_11}"`;
          break;
        case TimeZoneEnum.GMT_p_12:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_12}"`;
          break;
        case TimeZoneEnum.GMT_p_13:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_13}"`;
          break;
        case TimeZoneEnum.GMT_p_14:
          dt =
            `${dt} ${FIELD_ATTRS_LIST.TIMEZONE}=` +
            `"${TIMEZONE_VALUES.GMT_p_14}"`;
          break;
      }
      break;

    case DataTypeEnum.Binary:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.BINARY}"`;
      break;

    case DataTypeEnum.Utf8:
      dt = ` ${FIELD_ATTRS_LIST.TYPE}="${FIELD_TYPE_VALUES.UTF8}"`;
      break;
  }

  return dt;
}

export function getFieldAggregationHTML(
  agg: AggregationTypeEnum,
): string {
  switch (agg) {
    case AggregationTypeEnum.Count:
      return (
        ` ${FIELD_ATTRS_LIST.AGGREGATION}=` +
        `"${AGGREGATION_VALUES.COUNT}"`
      );
    case AggregationTypeEnum.CountDistinct:
      return (
        ` ${FIELD_ATTRS_LIST.AGGREGATION}=` +
        `"${AGGREGATION_VALUES.COUNT_DISTINCT}"`
      );
    case AggregationTypeEnum.CountDistinctApprox:
      return (
        ` ${FIELD_ATTRS_LIST.AGGREGATION}=` +
        `"${AGGREGATION_VALUES.COUNT_DISTINCT_APPROX}"`
      );
    case AggregationTypeEnum.Min:
      return (
        ` ${FIELD_ATTRS_LIST.AGGREGATION}=` +
        `"${AGGREGATION_VALUES.MIN}"`
      );
    case AggregationTypeEnum.Max:
      return (
        ` ${FIELD_ATTRS_LIST.AGGREGATION}=` +
        `"${AGGREGATION_VALUES.MAX}"`
      );
    case AggregationTypeEnum.Sum:
      return (
        ` ${FIELD_ATTRS_LIST.AGGREGATION}=` +
        `"${AGGREGATION_VALUES.SUM}"`
      );
    case AggregationTypeEnum.Avg:
      return (
        ` ${FIELD_ATTRS_LIST.AGGREGATION}=` +
        `"${AGGREGATION_VALUES.AVG}"`
      );
    case AggregationTypeEnum.None:
      return "";
  }
}

export function getFieldOrderHTML(sort: OrderTypeEnum): string {
  switch (sort) {
    case OrderTypeEnum.Ascending:
      return ` ${FIELD_ATTRS_LIST.ORDER}="${ORDER_VALUES.ASC}"`;

    case OrderTypeEnum.Descending:
      return ` ${FIELD_ATTRS_LIST.ORDER}="${ORDER_VALUES.DESC}"`;

    case OrderTypeEnum.None:
      return "";
  }
}

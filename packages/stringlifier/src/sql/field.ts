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
} from "@hdml/schemas";

export function getTableFieldSQL(field: FieldStruct): string {
  const type = field.type();
  const name = field.name();
  const origin = field.origin();
  const clause = field.clause();

  if (!name) {
    return "";
  } else {
    if (!type || type.type() === DataTypeEnum.Unspecified) {
      return getNamedField(
        name,
        getPlainClause(name, origin, clause),
      );
    } else {
      return getNamedField(
        name,
        getCastedClause(getPlainClause(name, origin, clause), type),
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
      return getNamedField(
        name,
        getGroupedClause(
          getPlainClause(name, origin, clause),
          aggregation,
        ),
      );
    } else {
      return getNamedField(
        name,
        getGroupedClause(
          getCastedClause(getPlainClause(name, origin, clause), type),
          aggregation,
        ),
      );
    }
  }
}

export function getNamedField(name: string, clause: string): string {
  return `${clause} as "${name}"`;
}

export function getPlainClause(
  name: string,
  origin: null | string,
  clause: null | string,
): string {
  return clause ? clause : `"${origin || name}"`;
}

export function getGroupedClause(
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

export function getCastedClause(
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

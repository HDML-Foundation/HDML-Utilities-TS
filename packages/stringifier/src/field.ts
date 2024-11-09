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
    let result = `<hdml-field name="${field.name()}"`;

    if (field.origin() !== null) {
      result = result + ` origin="${field.origin()}"`;
    }

    if (field.clause() !== null) {
      result =
        result + ` clause="${field.clause()!.replaceAll('"', "`")}"`;
    }

    if (field.type() !== null) {
      result = result + getFieldTypeHTML(field.type()!);
    }

    result = result + getFieldAggregationHTML(field.aggregation());
    result = result + getFieldOrderHTML(field.order());
    result = result + "></hdml-field>";

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

  // TODO (buntarb): attributes and values must be used from the enums
  // but first we need to move these enums from `parser` to `types`
  // package.
  switch (type.type()) {
    case DataTypeEnum.Int8:
      dt = ` type="int-8"`;
      break;

    case DataTypeEnum.Int16:
      dt = ` type="int-16"`;
      break;

    case DataTypeEnum.Int32:
      dt = ` type="int-32"`;
      break;

    case DataTypeEnum.Int64:
      dt = ` type="int-64"`;
      break;

    case DataTypeEnum.Float32:
      dt = ` type="float-32"`;
      break;

    case DataTypeEnum.Float64:
      dt = ` type="float-64"`;
      break;

    case DataTypeEnum.Decimal:
      options = type.options(
        new DecimalParametersStruct(),
      ) as DecimalParametersStruct;
      dt =
        ` type="decimal"` +
        ` scale="${options.scale()}"` +
        ` precision="${options.precision()}"`;
      break;

    case DataTypeEnum.Date:
      dt = ` type="date"`;
      break;

    case DataTypeEnum.Time:
      options = type.options(
        new TimeParametersStruct(),
      ) as TimeParametersStruct;
      switch (options.unit()) {
        case TimeUnitEnum.Second:
          dt = ` type="time" unit="second"`;
          break;
        case TimeUnitEnum.Millisecond:
          dt = ` type="time" unit="millisecond"`;
          break;
        case TimeUnitEnum.Microsecond:
          dt = ` type="time" unit="microsecond"`;
          break;
        case TimeUnitEnum.Nanosecond:
          dt = ` type="time" unit="nanosecond"`;
          break;
      }
      break;

    case DataTypeEnum.Timestamp:
      options = type.options(
        new TimestampParametersStruct(),
      ) as TimestampParametersStruct;
      switch (options.unit()) {
        case TimeUnitEnum.Second:
          dt = ` type="timestamp" unit="second"`;
          break;
        case TimeUnitEnum.Millisecond:
          dt = ` type="timestamp" unit="millisecond"`;
          break;
        case TimeUnitEnum.Microsecond:
          dt = ` type="timestamp" unit="microsecond"`;
          break;
        case TimeUnitEnum.Nanosecond:
          dt = ` type="timestamp" unit="nanosecond"`;
          break;
      }
      switch ((<TimestampParametersStruct>options).timezone()) {
        case TimeZoneEnum.UTC:
          dt = `${dt} timezone="UTC"`;
          break;
        case TimeZoneEnum.GMT:
          dt = `${dt} timezone="GMT"`;
          break;
        case TimeZoneEnum.GMT_m_01:
          dt = `${dt} timezone="GMT-01"`;
          break;
        case TimeZoneEnum.GMT_m_02:
          dt = `${dt} timezone="GMT-02"`;
          break;
        case TimeZoneEnum.GMT_m_03:
          dt = `${dt} timezone="GMT-03"`;
          break;
        case TimeZoneEnum.GMT_m_04:
          dt = `${dt} timezone="GMT-04"`;
          break;
        case TimeZoneEnum.GMT_m_05:
          dt = `${dt} timezone="GMT-05"`;
          break;
        case TimeZoneEnum.GMT_m_06:
          dt = `${dt} timezone="GMT-06"`;
          break;
        case TimeZoneEnum.GMT_m_07:
          dt = `${dt} timezone="GMT-07"`;
          break;
        case TimeZoneEnum.GMT_m_08:
          dt = `${dt} timezone="GMT-08"`;
          break;
        case TimeZoneEnum.GMT_m_09:
          dt = `${dt} timezone="GMT-09"`;
          break;
        case TimeZoneEnum.GMT_m_10:
          dt = `${dt} timezone="GMT-10"`;
          break;
        case TimeZoneEnum.GMT_m_11:
          dt = `${dt} timezone="GMT-11"`;
          break;
        case TimeZoneEnum.GMT_m_12:
          dt = `${dt} timezone="GMT-12"`;
          break;
        case TimeZoneEnum.GMT_p_01:
          dt = `${dt} timezone="GMT+01"`;
          break;
        case TimeZoneEnum.GMT_p_02:
          dt = `${dt} timezone="GMT+02"`;
          break;
        case TimeZoneEnum.GMT_p_03:
          dt = `${dt} timezone="GMT+03"`;
          break;
        case TimeZoneEnum.GMT_p_04:
          dt = `${dt} timezone="GMT+04"`;
          break;
        case TimeZoneEnum.GMT_p_05:
          dt = `${dt} timezone="GMT+05"`;
          break;
        case TimeZoneEnum.GMT_p_06:
          dt = `${dt} timezone="GMT+06"`;
          break;
        case TimeZoneEnum.GMT_p_07:
          dt = `${dt} timezone="GMT+07"`;
          break;
        case TimeZoneEnum.GMT_p_08:
          dt = `${dt} timezone="GMT+08"`;
          break;
        case TimeZoneEnum.GMT_p_09:
          dt = `${dt} timezone="GMT+09"`;
          break;
        case TimeZoneEnum.GMT_p_10:
          dt = `${dt} timezone="GMT+10"`;
          break;
        case TimeZoneEnum.GMT_p_11:
          dt = `${dt} timezone="GMT+11"`;
          break;
        case TimeZoneEnum.GMT_p_12:
          dt = `${dt} timezone="GMT+12"`;
          break;
        case TimeZoneEnum.GMT_p_13:
          dt = `${dt} timezone="GMT+13"`;
          break;
        case TimeZoneEnum.GMT_p_14:
          dt = `${dt} timezone="GMT+14"`;
          break;
      }
      break;

    case DataTypeEnum.Binary:
      dt = ` type="binary"`;
      break;

    case DataTypeEnum.Utf8:
      dt = ` type="utf-8"`;
      break;
  }

  return dt;
}

export function getFieldAggregationHTML(
  agg: AggregationTypeEnum,
): string {
  switch (agg) {
    case AggregationTypeEnum.Count:
      return ` aggregation="count"`;
    case AggregationTypeEnum.CountDistinct:
      return ` aggregation="countDistinct"`;
    case AggregationTypeEnum.CountDistinctApprox:
      return ` aggregation="countDistinctApprox"`;
    case AggregationTypeEnum.Min:
      return ` aggregation="min"`;
    case AggregationTypeEnum.Max:
      return ` aggregation="max"`;
    case AggregationTypeEnum.Sum:
      return ` aggregation="sum"`;
    case AggregationTypeEnum.Avg:
      return ` aggregation="avg"`;
    case AggregationTypeEnum.None:
      return "";
  }
}

export function getFieldOrderHTML(sort: OrderTypeEnum): string {
  switch (sort) {
    case OrderTypeEnum.Ascending:
      return ` order="asc"`;

    case OrderTypeEnum.Descending:
      return ` order="desc"`;

    case OrderTypeEnum.None:
      return "";
  }
}

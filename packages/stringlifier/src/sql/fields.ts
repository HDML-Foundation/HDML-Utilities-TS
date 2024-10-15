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
} from "@hdml/schemas";

export function getTableFieldSQL(field: FieldStruct): string {
  const type = field.type();
  const name = field.name();
  const origin = field.origin();
  const clause = field.clause();

  if (!name) {
    return "";
  } else {
    if (!type) {
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
    if (!type) {
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
  let options: DecimalParametersStruct;

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
        `decimal(${options.scale()}, ` +
        `${options.precision()}))`;
      break;
    case DataTypeEnum.Date:
      sql = `try_cast(${clause} as date)`;
      break;
    case DataTypeEnum.Time:
      sql = `try_cast(${clause} as time)`;
      break;
    case DataTypeEnum.Timestamp:
      sql = `try_cast(${clause} as timestamp)`;
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

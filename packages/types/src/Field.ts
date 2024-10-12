/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  DecimalBitWidthEnum,
  DateUnitEnum,
  TimeUnitEnum,
  TimeZoneEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
} from "@hdml/schemas";

/**
 * The `CommonParameters` interface defines the common parameters
 * for various data types. It includes properties that are shared
 * across different types, such as integers, floating-point numbers,
 * binary data, and UTF-8 strings.
 *
 * ## Properties:
 *
 * - `nullable` (boolean): Indicates whether the data type can
 *   accept `null` values. If `true`, the data type can be null;
 *   if `false`, it cannot.
 *
 * ## Example:
 *
 * ```ts
 * const commonParams: CommonParameters = {
 *   nullable: true
 * };
 * ```
 *
 * In this example, `commonParams` specifies that the data type
 * can accept null values.
 */
export type CommonParameters = {
  nullable: boolean;
};

/**
 * The `DecimalParameters` interface defines the parameters for
 * decimal data types. It includes properties for specifying whether
 * the decimal can be null, as well as details about its precision
 * and scale.
 *
 * ## Properties:
 *
 * - `nullable` (boolean): Indicates whether the decimal type can
 *   accept `null` values. If `true`, the decimal can be null;
 *   if `false`, it cannot.
 *
 * - `scale` (number): The number of digits to the right of the
 *   decimal point. This defines the scale of the decimal number.
 *
 * - `precision` (number): The total number of significant digits
 *   (both to the left and right of the decimal point) that the
 *   decimal type can hold.
 *
 * - `bit_width` (DecimalBitWidthEnum): The bit width of the decimal
 *   type, specifying the amount of storage allocated for the decimal
 *   number.
 *
 * ## Example:
 *
 * ```ts
 * const decimalParams: DecimalParameters = {
 *   nullable: false,
 *   scale: 2,
 *   precision: 10,
 *   bit_width: DecimalBitWidthEnum._128
 * };
 * ```
 *
 * In this example, `decimalParams` specifies a decimal type with
 * no null values allowed, a scale of 2, a precision of 10, and
 * a bit width of 128 bits.
 */
export type DecimalParameters = {
  nullable: boolean;
  scale: number;
  precision: number;
  bit_width: DecimalBitWidthEnum;
};

/**
 * The `DateParameters` interface defines the parameters for
 * date data types. It includes properties for specifying whether
 * the date can be null and the unit of time used to represent
 * the date.
 *
 * ## Properties:
 *
 * - `nullable` (boolean): Indicates whether the date type can
 *   accept `null` values. If `true`, the date can be null;
 *   if `false`, it cannot.
 *
 * - `unit` (DateUnitEnum): The unit of time used to represent the
 *   date (seconds or millisecond).
 *
 * ## Example:
 *
 * ```ts
 * const dateParams: DateParameters = {
 *   nullable: true,
 *   unit: DateUnitEnum.Second
 * };
 * ```
 *
 * In this example, `dateParams` specifies a date type that can
 * accept null values and uses the seconds as the unit of time.
 */
export type DateParameters = {
  nullable: boolean;
  unit: DateUnitEnum;
};

/**
 * The `TimeParameters` interface defines the parameters for
 * time data types. It includes properties for specifying whether
 * the time can be null and the unit of time used to represent
 * the time value.
 *
 * ## Properties:
 *
 * - `nullable` (boolean): Indicates whether the time type can
 *   accept `null` values. If `true`, the time can be null;
 *   if `false`, it cannot.
 *
 * - `unit` (TimeUnitEnum): The unit of time used to represent the
 *   time value, such as seconds, milliseconds, microseconds, or
 *   nanosecond.
 *
 * ## Example:
 *
 * ```ts
 * const timeParams: TimeParameters = {
 *   nullable: false,
 *   unit: TimeUnitEnum.Milliseconds
 * };
 * ```
 *
 * In this example, `timeParams` specifies a time type that cannot
 * be null and uses milliseconds as the unit of time.
 */
export type TimeParameters = {
  nullable: boolean;
  unit: TimeUnitEnum;
};

/**
 * The `TimestampParameters` interface defines the parameters for
 * timestamp data types. It includes properties for specifying whether
 * the timestamp can be null, the unit of time used, and the time
 * zone associated with the timestamp.
 *
 * ## Properties:
 *
 * - `nullable` (boolean): Indicates whether the timestamp type can
 *   accept `null` values. If `true`, the timestamp can be null;
 *   if `false`, it cannot.
 *
 * - `unit` (TimeUnitEnum): The unit of time used to represent the
 *   timestamp, such as seconds, milliseconds, or microseconds.
 *
 * - `TimeZoneEnum` (TimeZoneEnum): The time zone associated with the
 *   timestamp, defining how the timestamp should be interpreted
 *   relative to the global time zones.
 *
 * ## Example:
 *
 * ```ts
 * const timestampParams: TimestampParameters = {
 *   nullable: false,
 *   unit: TimeUnitEnum.Milliseconds,
 *   TimeZoneEnum: TimeZoneEnum.UTC
 * };
 * ```
 *
 * In this example, `timestampParams` specifies a timestamp type
 * that cannot be null, uses milliseconds as the unit of time, and
 * is set to the UTC time zone.
 */

export type TimestampParameters = {
  nullable: boolean;
  unit: TimeUnitEnum;
  TimeZoneEnum: TimeZoneEnum;
};

/**
 * The `FieldType` type defines the various possible data types for
 * fields in a data structure. It specifies the type of data and
 * associated parameters for each type.
 *
 * ## Types:
 *
 * - **Primitive Types**: Includes integer types (`Int8`, `Int16`,
 *   `Int32`, `Int64`), floating-point types (`Float32`, `Float64`),
 *   binary data (`Binary`), and UTF-8 strings (`Utf8`). Uses
 *   `CommonParameters`.
 *
 * - **Decimal**: For decimal numbers. Uses `DecimalParameters`.
 *
 * - **Date**: For dates. Uses `DateParameters`.
 *
 * - **Time**: For time values. Uses `TimeParameters`.
 *
 * - **Timestamp**: For timestamp values. Uses `TimestampParameters`.
 *
 * ## Example:
 *
 * ```ts
 * const field: FieldType = {
 *   type: DataTypeEnum.Decimal,
 *   options: {
 *     nullable: true,
 *     scale: 2,
 *     precision: 10,
 *     bit_width: DecimalBitWidthEnum._128
 *   }
 * };
 * ```
 *
 * In this example, `field` specifies a decimal type with parameters
 * including nullability, scale, precision, and bit width.
 */
export type FieldType =
  | {
      type: DataTypeEnum.Unspecified;
    }
  | {
      type:
        | DataTypeEnum.Int8
        | DataTypeEnum.Int16
        | DataTypeEnum.Int32
        | DataTypeEnum.Int64
        | DataTypeEnum.Float32
        | DataTypeEnum.Float64
        | DataTypeEnum.Binary
        | DataTypeEnum.Utf8;
      options: CommonParameters;
    }
  | {
      type: DataTypeEnum.Decimal;
      options: DecimalParameters;
    }
  | {
      type: DataTypeEnum.Date;
      options: DateParameters;
    }
  | {
      type: DataTypeEnum.Time;
      options: TimeParameters;
    }
  | {
      type: DataTypeEnum.Timestamp;
      options: TimestampParameters;
    };

/**
 * The `Field` interface represents a field in a data structure.
 * It includes details about the field's name, description, origin,
 * clause, type, aggregation, and ordering.
 *
 * ## Properties:
 *
 * - `name` (string): The name of the field in the HDML context.
 *
 * - `description` (string): A description of the field. This provides
 *   additional information about the field's purpose or usage.
 *
 * - `origin` (string): The name of the original field in the database
 *   if used within the scope of hdml-table, or in the parent
 *   structure if used within the scope of an hdml-frame. If omitted,
 *   it is assumed to be the same as the HDML field name.
 *
 * - `clause` (string): An SQL clause defining the field. It takes
 *   precedence over the origin attribute. For example,
 *   ```clause="concat(`table_catalog`, '-', `table_schema`)"```.
 *
 * - `type` (FieldType): The data type of the field. It defines the
 *   kind of data the field can hold, such as integer, decimal, date,
 *   time, or timestamp, along with its associated parameters.
 *
 * - `aggregation` (AggregationTypeEnum): Specifies an aggregation
 *   function for the field. Supported functions include: None, Count,
 *   CountDistinct, CountDistinctApprox, Sum, Avg, Min, Max.
 *
 * - `order` (OrderTypeEnum): The order type for sorting the field,
 *   such as Ascending, Descending, or None.
 *
 * ## Example:
 *
 * ```ts
 * const field: Field = {
 *   name: "total_sales",
 *   description: "Total sales amount for the period",
 *   origin: "sales_amount",
 *   clause: undefined,
 *   type: {
 *     type: DataTypeEnum.Float64,
 *     options: {
 *       nullable: false
 *     }
 *   },
 *   aggregation: AggregationTypeEnum.Sum,
 *   order: OrderTypeEnum.Descending
 * };
 * ```
 *
 * In this example, `field` specifies a field for total sales, with
 * details including its name, description, data type, aggregation
 * type, and ordering.
 */
export interface Field {
  name: string;
  description: null | string;
  origin: null | string;
  clause: null | string;
  type: FieldType;
  aggregation: AggregationTypeEnum;
  order: OrderTypeEnum;
}

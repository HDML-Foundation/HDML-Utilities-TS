/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  DateParametersStruct,
  DecimalParametersStruct,
  TimeParametersStruct,
  TimestampParametersStruct,
  CommonParametersStruct,
  FieldTypeStruct,
  FieldStruct,
} from "@hdml/schemas";
import {
  DateParameters,
  DecimalParameters,
  TimeParameters,
  Field,
  TimestampParameters,
  CommonParameters,
  FieldType,
} from "@hdml/types";

/**
 * Converts a FlatBuffers `FieldStruct` to a TypeScript `Field`
 * object.
 *
 * This function deserializes a FlatBuffers `FieldStruct` structure
 * into a TypeScript `Field` interface object. The field includes
 * details about name, description, origin, clause, type,
 * aggregation, and ordering.
 *
 * @param fieldStruct The FlatBuffers `FieldStruct` object to convert.
 *
 * @returns The converted `Field` object.
 *
 * @example
 * ```ts
 * const fieldStruct: FieldStruct = ...;
 * const field = objectifyField(fieldStruct);
 * ```
 */
export function objectifyField(fieldStruct: FieldStruct): Field {
  const name = fieldStruct.name() || "";
  const description = fieldStruct.description();
  const origin = fieldStruct.origin();
  const clause = fieldStruct.clause();
  const aggregation =
    fieldStruct.aggregation() ?? AggregationTypeEnum.None;
  const order = fieldStruct.order() ?? OrderTypeEnum.None;

  const typeStruct = fieldStruct.type();
  let type: FieldType;
  if (!typeStruct) {
    type = {
      type: DataTypeEnum.Unspecified,
    };
  } else {
    type = objectifyFieldType(typeStruct);
  }

  return {
    name,
    description,
    origin,
    clause,
    type,
    aggregation,
    order,
  };
}

/**
 * Converts a FlatBuffers `FieldTypeStruct` to a TypeScript
 * `FieldType` object.
 *
 * @param typeStruct The FlatBuffers `FieldTypeStruct` object to
 * convert.
 *
 * @returns The converted `FieldType` object.
 */
function objectifyFieldType(typeStruct: FieldTypeStruct): FieldType {
  const dataType = typeStruct.type();

  switch (dataType) {
    case DataTypeEnum.Decimal: {
      const params = typeStruct.options(
        new DecimalParametersStruct(),
      ) as unknown as DecimalParametersStruct;
      if (!params) {
        throw new Error("Decimal parameters struct is invalid");
      }
      const decimalParams: DecimalParameters = {
        nullable: params.nullable(),
        scale: params.scale(),
        precision: params.precision(),
        bit_width: params.bitWidth(),
      };
      return {
        type: dataType,
        options: decimalParams,
      };
    }

    case DataTypeEnum.Date: {
      const params = typeStruct.options(
        new DateParametersStruct(),
      ) as unknown as DateParametersStruct;
      if (!params) {
        throw new Error("Date parameters struct is invalid");
      }
      const dateParams: DateParameters = {
        nullable: params.nullable(),
        unit: params.unit(),
      };
      return {
        type: dataType,
        options: dateParams,
      };
    }

    case DataTypeEnum.Time: {
      const params = typeStruct.options(
        new TimeParametersStruct(),
      ) as unknown as TimeParametersStruct;
      if (!params) {
        throw new Error("Time parameters struct is invalid");
      }
      const timeParams: TimeParameters = {
        nullable: params.nullable(),
        unit: params.unit(),
      };
      return {
        type: dataType,
        options: timeParams,
      };
    }

    case DataTypeEnum.Timestamp: {
      const params = typeStruct.options(
        new TimestampParametersStruct(),
      ) as unknown as TimestampParametersStruct;
      if (!params) {
        throw new Error("Timestamp parameters struct is invalid");
      }
      const timestampParams: TimestampParameters = {
        nullable: params.nullable(),
        unit: params.unit(),
        timezone: params.timezone(),
      };
      return {
        type: dataType,
        options: timestampParams,
      };
    }

    case DataTypeEnum.Binary:
    case DataTypeEnum.Float32:
    case DataTypeEnum.Float64:
    case DataTypeEnum.Int16:
    case DataTypeEnum.Int32:
    case DataTypeEnum.Int64:
    case DataTypeEnum.Int8:
    case DataTypeEnum.Utf8: {
      const params = typeStruct.options(
        new CommonParametersStruct(),
      ) as unknown as CommonParametersStruct;
      if (!params) {
        throw new Error("Common parameters struct is invalid");
      }
      const commonParams: CommonParameters = {
        nullable: params.nullable(),
      };
      return {
        type: dataType,
        options: commonParams,
      };
    }

    case DataTypeEnum.Unspecified:
    default: {
      return {
        type: DataTypeEnum.Unspecified,
      };
    }
  }
}

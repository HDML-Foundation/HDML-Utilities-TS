/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
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
  UnspecifiedParametersStruct,
} from "@hdml/schemas";
import {
  DateParameters,
  DecimalParameters,
  TimeParameters,
  Field,
  TimestampParameters,
  CommonParameters,
} from "@hdml/types";

/**
 * Converts a TypeScript `Field` object into a FlatBuffers
 * `FieldStruct` structure.
 *
 * This function takes a TypeScript `Field` object, serializes it
 * into a FlatBuffers `FieldStruct` structure, and returns the offset
 * of the serialized structure within the FlatBuffers `Builder`. This
 * allows the `FieldStruct` structure to be efficiently transferred or
 * stored in binary format.
 *
 * The `Field` object consists of various properties such as name,
 * description, origin, and clause, as well as a type that determines
 * the structure's underlying data type (e.g., Decimal, Date, Time).
 * Each data type may have its own set of parameters, which are also
 * serialized into corresponding FlatBuffers parameter structures.
 *
 * @param builder - The FlatBuffers `Builder` instance used to
 * construct the binary buffer.
 *
 * @param field - The TypeScript `Field` object to convert. This
 * object contains metadata such as `name`, `description`, `origin`,
 * `clause`, `type`, `aggregation`, and `order`. The `type` property
 * is crucial, as it defines the underlying data type and associated
 * parameters.
 *
 * @returns The offset of the serialized `FieldStruct` structure
 * within the FlatBuffers `Builder`. This offset can be used to
 * reference the serialized data within the final FlatBuffer.
 *
 * @example
 * ```typescript
 * const builder = new flatbuffers.Builder();
 * const field: Field = {
 *   name: "age",
 *   type: {
 *     type: DataTypeEnum.Int32,
 *     options: { nullable: false }
 *   },
 *   aggregation: AggregationTypeEnum.None,
 *   order: OrderTypeEnum.Ascending
 * };
 * const offset = bufferifyField(builder, field);
 * builder.finish(offset);
 * ```
 */
export function bufferifyField(
  builder: Builder,
  field: Field,
): number {
  const nameOffset = builder.createString(field.name);
  const descriptionOffset = field.description
    ? builder.createString(field.description)
    : 0;
  const originOffset = field.origin
    ? builder.createString(field.origin)
    : 0;
  const clauseOffset = field.clause
    ? builder.createString(field.clause)
    : 0;

  let typeOffset = 0;
  let optionsOffset = 0;
  if (field.type) {
    switch (field.type.type) {
      case DataTypeEnum.Decimal:
        optionsOffset = createDecimalOptions(
          builder,
          field.type.options,
        );
        typeOffset = createFieldType(
          builder,
          field.type.type,
          optionsOffset,
        );
        break;
      case DataTypeEnum.Date:
        optionsOffset = createDateOptions(
          builder,
          field.type.options,
        );
        typeOffset = createFieldType(
          builder,
          field.type.type,
          optionsOffset,
        );
        break;
      case DataTypeEnum.Time:
        optionsOffset = createTimeOptions(
          builder,
          field.type.options,
        );
        typeOffset = createFieldType(
          builder,
          field.type.type,
          optionsOffset,
        );
        break;
      case DataTypeEnum.Timestamp:
        optionsOffset = createTimestampOptions(
          builder,
          field.type.options,
        );
        typeOffset = createFieldType(
          builder,
          field.type.type,
          optionsOffset,
        );
        break;
      case DataTypeEnum.Binary:
      case DataTypeEnum.Float32:
      case DataTypeEnum.Float64:
      case DataTypeEnum.Int16:
      case DataTypeEnum.Int32:
      case DataTypeEnum.Int64:
      case DataTypeEnum.Int8:
      case DataTypeEnum.Utf8:
        optionsOffset = createCommonParameters(
          builder,
          field.type.options,
        );
        typeOffset = createFieldType(
          builder,
          field.type.type,
          optionsOffset,
        );
        break;
      case DataTypeEnum.Unspecified:
      default:
        optionsOffset = createUnspecifiedParameters(builder);
        typeOffset = createFieldType(
          builder,
          field.type.type,
          optionsOffset,
        );
    }
  }

  const aggregation = field.aggregation ?? AggregationTypeEnum.None;
  const order = field.order ?? OrderTypeEnum.None;

  return createField(
    builder,
    nameOffset,
    descriptionOffset,
    originOffset,
    clauseOffset,
    typeOffset,
    aggregation,
    order,
  );
}

/**
 * Helper function to create a FlatBuffers FieldTypeStruct structure.
 *
 * @param builder The FlatBuffers builder instance.
 *
 * @param type The DataTypeEnum enum value.
 *
 * @param optionsOffset The offset for the options structure.
 *
 * @returns The FlatBuffers offset for the FieldTypeStruct structure.
 */
function createFieldType(
  builder: Builder,
  type: DataTypeEnum,
  optionsOffset: number,
): number {
  FieldTypeStruct.startFieldTypeStruct(builder);
  FieldTypeStruct.addType(builder, type);
  FieldTypeStruct.addOptions(builder, optionsOffset);
  return FieldTypeStruct.endFieldTypeStruct(builder);
}

/**
 * Helper function to create a FlatBuffers
 * UnspecifiedParametersStruct.
 *
 * @param builder The FlatBuffers builder instance.
 *
 * @returns The FlatBuffers offset for the
 * UnspecifiedParametersStruct.
 */
function createUnspecifiedParameters(builder: Builder): number {
  const p =
    UnspecifiedParametersStruct.createUnspecifiedParametersStruct(
      builder,
    );
  return p;
}

/**
 * Helper function to create a FlatBuffers CommonParametersStruct.
 *
 * @param builder The FlatBuffers builder instance.
 *
 * @param params The CommonParametersStruct object.
 *
 * @returns The FlatBuffers offset for the CommonParametersStruct.
 */
function createCommonParameters(
  builder: Builder,
  params: CommonParameters,
): number {
  return CommonParametersStruct.createCommonParametersStruct(
    builder,
    params.nullable,
  );
}

/**
 * Helper function to create a FlatBuffers DecimalParametersStruct.
 *
 * @param builder The FlatBuffers builder instance.
 *
 * @param params The DecimalParametersStruct object.
 *
 * @returns The FlatBuffers offset for the DecimalParametersStruct.
 */
function createDecimalOptions(
  builder: Builder,
  params: DecimalParameters,
): number {
  return DecimalParametersStruct.createDecimalParametersStruct(
    builder,
    params.nullable,
    params.scale,
    params.precision,
    params.bit_width,
  );
}

/**
 * Helper function to create a FlatBuffers DateParametersStruct.
 *
 * @param builder The FlatBuffers builder instance.
 *
 * @param params The DateParametersStruct object.
 *
 * @returns The FlatBuffers offset for the DateParametersStruct.
 */
function createDateOptions(
  builder: Builder,
  params: DateParameters,
): number {
  return DateParametersStruct.createDateParametersStruct(
    builder,
    params.nullable,
    params.unit,
  );
}

/**
 * Helper function to create a FlatBuffers TimeParametersStruct.
 *
 * @param builder The FlatBuffers builder instance.
 *
 * @param params The TimeParameters object.
 *
 * @returns The FlatBuffers offset for the TimeParametersStruct.
 */
function createTimeOptions(
  builder: Builder,
  params: TimeParameters,
): number {
  return TimeParametersStruct.createTimeParametersStruct(
    builder,
    params.nullable,
    params.unit,
  );
}
/**
 * Helper function to create a FlatBuffers TimeParametersStruct.
 *
 * @param builder The FlatBuffers builder instance.
 *
 * @param params The TimeParameters object.
 *
 * @returns The FlatBuffers offset for the TimeParametersStruct.
 */
function createTimestampOptions(
  builder: Builder,
  params: TimestampParameters,
): number {
  return TimestampParametersStruct.createTimestampParametersStruct(
    builder,
    params.nullable,
    params.unit,
    params.timezone,
  );
}

/**
 * Helper function to create a FlatBuffers FieldStruct structure.
 *
 * @param builder The FlatBuffers builder instance.
 *
 * @param nameOffset The offset for the name string.
 *
 * @param descriptionOffset The offset for the description string.
 *
 * @param originOffset The offset for the origin string.
 *
 * @param clauseOffset The offset for the clause string.
 *
 * @param typeOffset The offset for the FieldTypeStruct structure.
 *
 * @param aggregation The aggregation type.
 *
 * @param order The order type.
 *
 * @returns The FlatBuffers offset for the FieldStruct structure.
 */
function createField(
  builder: Builder,
  nameOffset: number,
  descriptionOffset: number,
  originOffset: number,
  clauseOffset: number,
  typeOffset: number,
  aggregation: AggregationTypeEnum,
  order: OrderTypeEnum,
): number {
  FieldStruct.startFieldStruct(builder);
  FieldStruct.addName(builder, nameOffset);
  FieldStruct.addDescription(builder, descriptionOffset);
  FieldStruct.addOrigin(builder, originOffset);
  FieldStruct.addClause(builder, clauseOffset);
  FieldStruct.addType(builder, typeOffset);
  FieldStruct.addAggregation(builder, aggregation);
  FieldStruct.addOrder(builder, order);
  return FieldStruct.endFieldStruct(builder);
}

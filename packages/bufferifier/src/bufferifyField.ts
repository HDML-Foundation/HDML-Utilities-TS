/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import {
  // enums
  DataType,
  AggregationType,
  OrderType,
  // interfaces
  IDateParameters,
  IDecimalParameters,
  ITimeParameters,
  IField,
  ITimestampParameters,
  ICommonParameters,
  // structures
  DateParameters,
  DecimalParameters,
  TimeParameters,
  TimestampParameters,
  CommonParameters,
  FieldType,
  Field,
} from "@hdml/schemas";

/**
 * Converts a TypeScript `IField` object into a FlatBuffers `Field`
 * structure.
 *
 * This function takes a TypeScript `IField` object, serializes it
 * into a FlatBuffers `Field` structure, and returns the offset of the
 * serialized structure within the FlatBuffers `Builder`. This allows
 * the `Field` structure to be efficiently transferred or stored in
 * binary format.
 *
 * The `IField` object consists of various properties such as name,
 * description, origin, and clause, as well as a type that determines
 * the structure's underlying data type (e.g., Decimal, Date, Time).
 * Each data type may have its own set of parameters, which are also
 * serialized into corresponding FlatBuffers parameter structures.
 *
 * @param builder - The FlatBuffers `Builder` instance used to
 *                  construct the binary buffer.
 * @param field - The TypeScript `IField` object to convert. This
 *                object contains metadata such as `name`,
 *                `description`, `origin`, `clause`, `type`,
 *                `aggregation`, and `order`. The `type` property is
 *                crucial, as it defines the underlying data type and
 *                associated parameters.
 *
 * @returns The offset of the serialized `Field` structure within the
 *          FlatBuffers `Builder`. This offset can be used to
 *          reference the serialized data within the final FlatBuffer.
 *
 * @example
 * ```typescript
 * const builder = new flatbuffers.Builder();
 * const field: IField = {
 *   name: "age",
 *   type: {
 *     type: DataType.Int32,
 *     options: { nullable: false }
 *   },
 *   aggregation: AggregationType.None,
 *   order: OrderType.Ascending
 * };
 * const offset = bufferifyField(builder, field);
 * builder.finish(offset);
 * ```
 */
export function bufferifyField(
  builder: Builder,
  field: IField,
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
      case DataType.Decimal:
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
      case DataType.Date:
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
      case DataType.Time:
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
      case DataType.Timestamp:
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
      case DataType.Binary:
      case DataType.Float32:
      case DataType.Float64:
      case DataType.Int16:
      case DataType.Int32:
      case DataType.Int64:
      case DataType.Int8:
      case DataType.Utf8:
      default:
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
    }
  }

  const aggregation = field.aggregation ?? AggregationType.None;
  const order = field.order ?? OrderType.None;

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
 * Helper function to create a FlatBuffers FieldType structure.
 * @param builder The FlatBuffers builder instance.
 * @param type The DataType enum value.
 * @param optionsOffset The offset for the options structure.
 * @returns The FlatBuffers offset for the FieldType structure.
 */
function createFieldType(
  builder: Builder,
  type: DataType,
  optionsOffset: number,
): number {
  FieldType.startFieldType(builder);
  FieldType.addType(builder, type);
  FieldType.addOptions(builder, optionsOffset);
  return FieldType.endFieldType(builder);
}

/**
 * Helper function to create a FlatBuffers CommonParameters.
 * @param builder The FlatBuffers builder instance.
 * @param params The CommonParameters object.
 * @returns The FlatBuffers offset for the CommonParameters.
 */
function createCommonParameters(
  builder: Builder,
  params: ICommonParameters,
): number {
  return CommonParameters.createCommonParameters(
    builder,
    params.nullable,
  );
}

/**
 * Helper function to create a FlatBuffers DecimalParameters.
 * @param builder The FlatBuffers builder instance.
 * @param params The DecimalParameters object.
 * @returns The FlatBuffers offset for the DecimalParameters.
 */
function createDecimalOptions(
  builder: Builder,
  params: IDecimalParameters,
): number {
  return DecimalParameters.createDecimalParameters(
    builder,
    params.nullable,
    params.scale,
    params.precision,
    params.bit_width,
  );
}

/**
 * Helper function to create a FlatBuffers DateParameters.
 * @param builder The FlatBuffers builder instance.
 * @param params The DateParameters object.
 * @returns The FlatBuffers offset for the DateParameters.
 */
function createDateOptions(
  builder: Builder,
  params: IDateParameters,
): number {
  return DateParameters.createDateParameters(
    builder,
    params.nullable,
    params.unit,
  );
}

/**
 * Helper function to create a FlatBuffers TimeParameters.
 * @param builder The FlatBuffers builder instance.
 * @param params The ITimeParameters object.
 * @returns The FlatBuffers offset for the TimeParameters.
 */
function createTimeOptions(
  builder: Builder,
  params: ITimeParameters,
): number {
  return TimeParameters.createTimeParameters(
    builder,
    params.nullable,
    params.unit,
  );
}
/**
 * Helper function to create a FlatBuffers TimeParameters.
 * @param builder The FlatBuffers builder instance.
 * @param params The ITimeParameters object.
 * @returns The FlatBuffers offset for the TimeParameters.
 */
function createTimestampOptions(
  builder: Builder,
  params: ITimestampParameters,
): number {
  return TimestampParameters.createTimestampParameters(
    builder,
    params.nullable,
    params.unit,
    params.timezone,
  );
}

/**
 * Helper function to create a FlatBuffers Field structure.
 * @param builder The FlatBuffers builder instance.
 * @param nameOffset The offset for the name string.
 * @param descriptionOffset The offset for the description string.
 * @param originOffset The offset for the origin string.
 * @param clauseOffset The offset for the clause string.
 * @param typeOffset The offset for the FieldType structure.
 * @param aggregation The aggregation type.
 * @param order The order type.
 * @returns The FlatBuffers offset for the Field structure.
 */
function createField(
  builder: Builder,
  nameOffset: number,
  descriptionOffset: number,
  originOffset: number,
  clauseOffset: number,
  typeOffset: number,
  aggregation: AggregationType,
  order: OrderType,
): number {
  Field.startField(builder);
  Field.addName(builder, nameOffset);
  Field.addDescription(builder, descriptionOffset);
  Field.addOrigin(builder, originOffset);
  Field.addClause(builder, clauseOffset);
  Field.addType(builder, typeOffset);
  Field.addAggregation(builder, aggregation);
  Field.addOrder(builder, order);
  return Field.endField(builder);
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import { Builder } from "flatbuffers";
import {
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  DecimalBitWidthEnum,
  TimeUnitEnum,
  DateUnitEnum,
  TimeZoneEnum,
  FieldStruct,
} from "@hdml/schemas";
import { Field } from "@hdml/types";
import { bufferifyField } from "../bufferify/bufferifyField";
import { objectifyField } from "./objectifyField";

describe("The `objectifyField` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder();
  });

  it("should objectify a Field with common parameters", () => {
    const field: Field = {
      name: "testField",
      type: {
        type: DataTypeEnum.Int32,
        options: {
          nullable: true,
        },
      },
      origin: null,
      clause: null,
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      description: null,
    };

    const offset = bufferifyField(builder, field);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fieldStruct = FieldStruct.getRootAsFieldStruct(byteBuffer);
    const objectified = objectifyField(fieldStruct);

    expect(objectified).toEqual(field);
  });

  it("should objectify a Field with Decimal parameters", () => {
    const field: Field = {
      name: "decimalField",
      type: {
        type: DataTypeEnum.Decimal,
        options: {
          nullable: false,
          scale: 2,
          precision: 10,
          bit_width: DecimalBitWidthEnum._128,
        },
      },
      origin: null,
      clause: null,
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      description: null,
    };

    const offset = bufferifyField(builder, field);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fieldStruct = FieldStruct.getRootAsFieldStruct(byteBuffer);
    const objectified = objectifyField(fieldStruct);

    expect(objectified).toEqual(field);
  });

  it("should objectify a Field with Date parameters", () => {
    const field: Field = {
      name: "dateField",
      type: {
        type: DataTypeEnum.Date,
        options: {
          nullable: true,
          unit: DateUnitEnum.Millisecond,
        },
      },
      origin: null,
      clause: null,
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      description: null,
    };

    const offset = bufferifyField(builder, field);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fieldStruct = FieldStruct.getRootAsFieldStruct(byteBuffer);
    const objectified = objectifyField(fieldStruct);

    expect(objectified).toEqual(field);
  });

  it("should objectify a Field with Time parameters", () => {
    const field: Field = {
      name: "timeField",
      type: {
        type: DataTypeEnum.Time,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Nanosecond,
        },
      },
      origin: null,
      clause: null,
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      description: "description",
    };

    const offset = bufferifyField(builder, field);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fieldStruct = FieldStruct.getRootAsFieldStruct(byteBuffer);
    const objectified = objectifyField(fieldStruct);

    expect(objectified).toEqual(field);
  });

  it("should objectify a Field with Timestamp parameters", () => {
    const field: Field = {
      name: "timestampField",
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: true,
          unit: TimeUnitEnum.Second,
          timezone: TimeZoneEnum.UTC,
        },
      },
      origin: null,
      clause: null,
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      description: "description",
    };

    const offset = bufferifyField(builder, field);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fieldStruct = FieldStruct.getRootAsFieldStruct(byteBuffer);
    const objectified = objectifyField(fieldStruct);

    expect(objectified).toEqual(field);
  });
});

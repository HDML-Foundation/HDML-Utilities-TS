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
  DecimalBitWidth,
  TimeUnit,
  DateUnit,
  TimeZone,
  // ifaces
  IField,
} from "@hdml/schemas";
import { bufferifyField } from "./bufferifyField";

describe("The `bufferifyField` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder();
  });

  it("should serialize a simple Field with common parameters", () => {
    const field: IField = {
      name: "testField",
      type: {
        type: DataType.Int32,
        options: {
          nullable: true,
        },
      },
      aggregation: AggregationType.None,
      order: OrderType.None,
    };

    const offset = bufferifyField(builder, field);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a Field with Decimal parameters", () => {
    const field: IField = {
      name: "decimalField",
      type: {
        type: DataType.Decimal,
        options: {
          nullable: false,
          scale: 2,
          precision: 10,
          bit_width: DecimalBitWidth._128,
        },
      },
    };

    const offset = bufferifyField(builder, field);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a Field with Date parameters", () => {
    const field: IField = {
      name: "dateField",
      type: {
        type: DataType.Date,
        options: {
          nullable: true,
          unit: DateUnit.Millisecond,
        },
      },
    };

    const offset = bufferifyField(builder, field);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a Field with Time parameters", () => {
    const field: IField = {
      name: "timeField",
      type: {
        type: DataType.Time,
        options: {
          nullable: false,
          unit: TimeUnit.Nanosecond,
        },
      },
    };

    const offset = bufferifyField(builder, field);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a Field with Timestamp parameters", () => {
    const field: IField = {
      name: "timestampField",
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: true,
          unit: TimeUnit.Second,
          timezone: TimeZone.UTC,
        },
      },
    };

    const offset = bufferifyField(builder, field);
    expect(offset).toBeGreaterThan(0);
  });
});

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
  DecimalBitWidthEnum,
  TimeUnitEnum,
  DateUnitEnum,
  TimeZoneEnum,
} from "@hdml/schemas";
import { Field } from "@hdml/types";
import { bufferifyField } from "./bufferifyField";

describe("The `bufferifyField` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder();
  });

  it("should serialize a simple Field with common parameters", () => {
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
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a Field with Decimal parameters", () => {
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
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a Field with Date parameters", () => {
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
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a Field with Time parameters", () => {
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
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a Field with Timestamp parameters", () => {
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
    expect(offset).toBeGreaterThan(0);
  });
});

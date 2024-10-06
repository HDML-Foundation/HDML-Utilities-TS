/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import {
  AggregationType,
  DataType,
  DateUnit,
  DecimalBitWidth,
  IField,
  OrderType,
  TimeUnit,
  TimeZone,
} from "@hdml/schemas";
import { getFieldData } from "./getFieldData";
import { FIELD_ATTRS_LIST } from "../enums/FIELD_ATTRS_LIST";
import { AGGREGATION_VALUES } from "../enums/AGGREGATION_VALUES";
import { ORDER_VALUES } from "../enums/ORDER_VALUES";
import { FIELD_TYPE_VALUES } from "../enums/FIELD_TYPE_VALUES";
import { BITWIDTH_VALUES } from "../enums/BITWIDTH_VALUES";
import { DT_UNIT_VALUES } from "../enums/DT_UNIT_VALUES";
import { TIMEZONE_VALUES } from "../enums/TIMEZONE_VALUES";

describe("The `getFieldData` function", () => {
  it("shoud return `null` if empty attributes passed", () => {
    expect(getFieldData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getFieldData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `null` if `name` attribute is missed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "true" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
    ]) as IField;

    expect(data).toBeNull();
  });

  it("shoud return `IField` object if `name` attribute passed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
    });
  });

  it("shoud return `IField` object if `description` attribute passed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      description: "description",
      aggregation: AggregationType.None,
      order: OrderType.None,
    });
  });

  it("shoud return `IField` object if `origin` attribute passed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      description: "description",
      origin: "origin",
      aggregation: AggregationType.None,
      order: OrderType.None,
    });
  });

  it("shoud return `IField` object if `clause` attribute passed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      description: "description",
      origin: "origin",
      clause: "clause",
      aggregation: AggregationType.None,
      order: OrderType.None,
    });
  });

  it("shoud return `IField` object if `aggregation` attribute passed", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: "invalid",
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationType.None);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.AVG,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationType.Avg);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.COUNT,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationType.Count);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.COUNT_DISTINCT,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationType.CountDistinct);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.COUNT_DISTINCT_APPROX,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(
      AggregationType.CountDistinctApprox,
    );

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.MAX,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationType.Max);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.MIN,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationType.Min);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.SUM,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationType.Sum);
  });

  it("shoud return `IField` object if `aggregation` attribute passed", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.ORDER,
        value: "invalid",
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.order).toEqual(OrderType.None);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.ORDER,
        value: ORDER_VALUES.ASC,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.order).toEqual(OrderType.Ascending);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.ORDER,
        value: ORDER_VALUES.DESC,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data.order).toEqual(OrderType.Descending);
  });

  it("shoud return `IField` object for invalid type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: "int-12" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: "int-12" },
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "any" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: "int-12" },
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "true" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
    });
  });

  it("shoud return `IField` object for `Int-8` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT8 },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Int8,
        options: {
          nullable: false,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT8 },
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "any" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Int8,
        options: {
          nullable: false,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT8 },
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "true" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Int8,
        options: {
          nullable: true,
        },
      },
    });
  });

  it("shoud return `IField` object for `Int-16` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT16 },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Int16,
        options: {
          nullable: false,
        },
      },
    });
  });

  it("shoud return `IField` object for `Int-32` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT32 },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Int32,
        options: {
          nullable: false,
        },
      },
    });
  });

  it("shoud return `IField` object for `Int-64` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT64 },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Int64,
        options: {
          nullable: false,
        },
      },
    });
  });

  it("shoud return `IField` object for `Float-32` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.FLOAT32,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Float32,
        options: {
          nullable: false,
        },
      },
    });
  });

  it("shoud return `IField` object for `Float-64` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.FLOAT64,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Float64,
        options: {
          nullable: false,
        },
      },
    });
  });

  it("shoud return `IField` object for `Binary` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.BINARY,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Binary,
        options: {
          nullable: false,
        },
      },
    });
  });

  it("shoud return `IField` object for `UTF8` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.UTF8 },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Utf8,
        options: {
          nullable: false,
        },
      },
    });
  });

  it("shoud return `IField` object for `Decimal` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.DECIMAL,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 0,
          bit_width: DecimalBitWidth._128,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.DECIMAL,
      },
      {
        name: FIELD_ATTRS_LIST.PRECISION,
        value: "24",
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Decimal,
        options: {
          nullable: false,
          precision: 24,
          scale: 0,
          bit_width: DecimalBitWidth._128,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.DECIMAL,
      },
      {
        name: FIELD_ATTRS_LIST.SCALE,
        value: "5",
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 5,
          bit_width: DecimalBitWidth._128,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.DECIMAL,
      },
      {
        name: FIELD_ATTRS_LIST.BITWIDTH,
        value: BITWIDTH_VALUES._128,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 0,
          bit_width: DecimalBitWidth._128,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.DECIMAL,
      },
      {
        name: FIELD_ATTRS_LIST.BITWIDTH,
        value: BITWIDTH_VALUES._256,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 0,
          bit_width: DecimalBitWidth._256,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.DECIMAL,
      },
      {
        name: FIELD_ATTRS_LIST.BITWIDTH,
        value: "invalid",
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 0,
          bit_width: DecimalBitWidth._128,
        },
      },
    });
  });

  it("shoud return `IField` object for `Date` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.DATE },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Date,
        options: {
          nullable: false,
          unit: DateUnit.Millisecond,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.DATE },
      { name: FIELD_ATTRS_LIST.UNIT, value: "invalid" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Date,
        options: {
          nullable: false,
          unit: DateUnit.Millisecond,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.DATE },
      { name: FIELD_ATTRS_LIST.UNIT, value: DT_UNIT_VALUES.SECOND },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Date,
        options: {
          nullable: false,
          unit: DateUnit.Second,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.DATE },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.MILLISECOND,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Date,
        options: {
          nullable: false,
          unit: DateUnit.Millisecond,
        },
      },
    });
  });

  it("shoud return `IField` object for `Time` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Time,
        options: {
          nullable: false,
          unit: TimeUnit.Millisecond,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      { name: FIELD_ATTRS_LIST.UNIT, value: "invalid" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Time,
        options: {
          nullable: false,
          unit: TimeUnit.Millisecond,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      { name: FIELD_ATTRS_LIST.UNIT, value: DT_UNIT_VALUES.SECOND },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Time,
        options: {
          nullable: false,
          unit: TimeUnit.Second,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.MILLISECOND,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Time,
        options: {
          nullable: false,
          unit: TimeUnit.Millisecond,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.MICROSECOND,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Time,
        options: {
          nullable: false,
          unit: TimeUnit.Microsecond,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.NANOSECOND,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Time,
        options: {
          nullable: false,
          unit: TimeUnit.Nanosecond,
        },
      },
    });
  });

  it("shoud return `IField` object for `Timestamp` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Millisecond,
          timezone: TimeZone.UTC,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      { name: FIELD_ATTRS_LIST.UNIT, value: "invalid" },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Millisecond,
          timezone: TimeZone.UTC,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      { name: FIELD_ATTRS_LIST.UNIT, value: DT_UNIT_VALUES.SECOND },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Second,
          timezone: TimeZone.UTC,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.MILLISECOND,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Millisecond,
          timezone: TimeZone.UTC,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.MICROSECOND,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Microsecond,
          timezone: TimeZone.UTC,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.NANOSECOND,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Nanosecond,
          timezone: TimeZone.UTC,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.NANOSECOND,
      },
      {
        name: FIELD_ATTRS_LIST.TIMEZONE,
        value: "invalid",
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Nanosecond,
          timezone: TimeZone.UTC,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.NANOSECOND,
      },
      {
        name: FIELD_ATTRS_LIST.TIMEZONE,
        value: TIMEZONE_VALUES.UTC,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Nanosecond,
          timezone: TimeZone.UTC,
        },
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.NANOSECOND,
      },
      {
        name: FIELD_ATTRS_LIST.TIMEZONE,
        value: TIMEZONE_VALUES.GMT,
      },
    ]) as IField;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationType.None,
      order: OrderType.None,
      type: {
        type: DataType.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnit.Nanosecond,
          timezone: TimeZone.GMT,
        },
      },
    });

    type SKey = keyof typeof TIMEZONE_VALUES;
    type NKey = keyof typeof TimeZone;
    for (let i = 1; i <= 14; i++) {
      let id: string;
      let skey: SKey;
      let nkey: NKey;
      if (i < 10) {
        id = `0${i}`;
      } else {
        id = `${i}`;
      }
      if (i <= 12) {
        skey = `GMT_m_${id}` as SKey;
        nkey = `GMT_m_${id}` as NKey;
        data = getFieldData([
          { name: FIELD_ATTRS_LIST.NAME, value: "name" },
          {
            name: FIELD_ATTRS_LIST.TYPE,
            value: FIELD_TYPE_VALUES.TIMESTAMP,
          },
          {
            name: FIELD_ATTRS_LIST.UNIT,
            value: DT_UNIT_VALUES.NANOSECOND,
          },
          {
            name: FIELD_ATTRS_LIST.TIMEZONE,
            value: TIMEZONE_VALUES[skey],
          },
        ]) as IField;

        expect(data).not.toBeNull();
        expect(data).toEqual({
          name: "name",
          aggregation: AggregationType.None,
          order: OrderType.None,
          type: {
            type: DataType.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnit.Nanosecond,
              timezone: TimeZone[nkey],
            },
          },
        });
      }
      skey = `GMT_p_${id}` as SKey;
      nkey = `GMT_p_${id}` as NKey;
      data = getFieldData([
        { name: FIELD_ATTRS_LIST.NAME, value: "name" },
        {
          name: FIELD_ATTRS_LIST.TYPE,
          value: FIELD_TYPE_VALUES.TIMESTAMP,
        },
        {
          name: FIELD_ATTRS_LIST.UNIT,
          value: DT_UNIT_VALUES.NANOSECOND,
        },
        {
          name: FIELD_ATTRS_LIST.TIMEZONE,
          value: TIMEZONE_VALUES[skey] as TIMEZONE_VALUES,
        },
      ]) as IField;

      expect(data).not.toBeNull();
      expect(data).toEqual({
        name: "name",
        aggregation: AggregationType.None,
        order: OrderType.None,
        type: {
          type: DataType.Timestamp,
          options: {
            nullable: false,
            unit: TimeUnit.Nanosecond,
            timezone: TimeZone[nkey],
          },
        },
      });
    }
  });
});

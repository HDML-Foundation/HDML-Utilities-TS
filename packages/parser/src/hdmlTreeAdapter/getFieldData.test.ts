/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import {
  AggregationTypeEnum,
  DataTypeEnum,
  DateUnitEnum,
  DecimalBitWidthEnum,
  OrderTypeEnum,
  TimeUnitEnum,
  TimeZoneEnum,
} from "@hdml/schemas";
import { Field } from "@hdml/types";
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
    ]) as Field;

    expect(data).toBeNull();
  });

  it("shoud return `Field` object if `name` attribute passed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      clause: null,
      description: null,
      origin: null,
      type: {
        type: DataTypeEnum.Unspecified,
      },
    });
  });

  it("shoud return `Field` object if `description` attribute passed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      description: "description",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      clause: null,
      origin: null,
      type: {
        type: DataTypeEnum.Unspecified,
      },
    });
  });

  it("shoud return `Field` object if `origin` attribute passed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      description: "description",
      origin: "origin",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      clause: null,
      type: {
        type: DataTypeEnum.Unspecified,
      },
    });
  });

  it("shoud return `Field` object if `clause` attribute passed", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      description: "description",
      origin: "origin",
      clause: "clause",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Unspecified,
      },
    });
  });

  it("shoud return `Field` object if `aggregation` attribute passed", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: "invalid",
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationTypeEnum.None);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.AVG,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationTypeEnum.Avg);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.COUNT,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationTypeEnum.Count);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.COUNT_DISTINCT,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(
      AggregationTypeEnum.CountDistinct,
    );

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.COUNT_DISTINCT_APPROX,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(
      AggregationTypeEnum.CountDistinctApprox,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationTypeEnum.Max);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.MIN,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationTypeEnum.Min);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.DESCRIPTION, value: "description" },
      { name: FIELD_ATTRS_LIST.ORIGIN, value: "origin" },
      { name: FIELD_ATTRS_LIST.CLAUSE, value: "clause" },
      {
        name: FIELD_ATTRS_LIST.AGGREGATION,
        value: AGGREGATION_VALUES.SUM,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.aggregation).toEqual(AggregationTypeEnum.Sum);
  });

  it("shoud return `Field` object if `aggregation` attribute passed", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.ORDER,
        value: "invalid",
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.order).toEqual(OrderTypeEnum.None);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.ORDER,
        value: ORDER_VALUES.ASC,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.order).toEqual(OrderTypeEnum.Ascending);

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.ORDER,
        value: ORDER_VALUES.DESC,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data.order).toEqual(OrderTypeEnum.Descending);
  });

  it("shoud return `Field` object for invalid type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: "int-12" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      clause: null,
      description: null,
      origin: null,
      type: {
        type: DataTypeEnum.Unspecified,
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: "int-12" },
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "any" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      clause: null,
      description: null,
      origin: null,
      type: {
        type: DataTypeEnum.Unspecified,
      },
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: "int-12" },
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "true" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      clause: null,
      description: null,
      origin: null,
      type: {
        type: DataTypeEnum.Unspecified,
      },
    });
  });

  it("shoud return `Field` object for `Int-8` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT8 },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Int8,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT8 },
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "any" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Int8,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT8 },
      { name: FIELD_ATTRS_LIST.NULLABLE, value: "true" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Int8,
        options: {
          nullable: true,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Int-16` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT16 },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Int16,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Int-32` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT32 },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Int32,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Int-64` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.INT64 },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Int64,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Float-32` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.FLOAT32,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Float32,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Float-64` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.FLOAT64,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Float64,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Binary` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.BINARY,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Binary,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `UTF8` type", () => {
    const data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.UTF8 },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Utf8,
        options: {
          nullable: false,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Decimal` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.DECIMAL,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 0,
          bit_width: DecimalBitWidthEnum._128,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Decimal,
        options: {
          nullable: false,
          precision: 24,
          scale: 0,
          bit_width: DecimalBitWidthEnum._128,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 5,
          bit_width: DecimalBitWidthEnum._128,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 0,
          bit_width: DecimalBitWidthEnum._128,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 0,
          bit_width: DecimalBitWidthEnum._256,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Decimal,
        options: {
          nullable: false,
          precision: 18,
          scale: 0,
          bit_width: DecimalBitWidthEnum._128,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Date` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.DATE },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Date,
        options: {
          nullable: false,
          unit: DateUnitEnum.Millisecond,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.DATE },
      { name: FIELD_ATTRS_LIST.UNIT, value: "invalid" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Date,
        options: {
          nullable: false,
          unit: DateUnitEnum.Millisecond,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.DATE },
      { name: FIELD_ATTRS_LIST.UNIT, value: DT_UNIT_VALUES.SECOND },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Date,
        options: {
          nullable: false,
          unit: DateUnitEnum.Second,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.DATE },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.MILLISECOND,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Date,
        options: {
          nullable: false,
          unit: DateUnitEnum.Millisecond,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Time` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Time,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Millisecond,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      { name: FIELD_ATTRS_LIST.UNIT, value: "invalid" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Time,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Millisecond,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      { name: FIELD_ATTRS_LIST.UNIT, value: DT_UNIT_VALUES.SECOND },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Time,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Second,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.MILLISECOND,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Time,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Millisecond,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.MICROSECOND,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Time,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Microsecond,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      { name: FIELD_ATTRS_LIST.TYPE, value: FIELD_TYPE_VALUES.TIME },
      {
        name: FIELD_ATTRS_LIST.UNIT,
        value: DT_UNIT_VALUES.NANOSECOND,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Time,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Nanosecond,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });
  });

  it("shoud return `Field` object for `Timestamp` type", () => {
    let data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Millisecond,
          timezone: TimeZoneEnum.UTC,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      { name: FIELD_ATTRS_LIST.UNIT, value: "invalid" },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Millisecond,
          timezone: TimeZoneEnum.UTC,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    data = getFieldData([
      { name: FIELD_ATTRS_LIST.NAME, value: "name" },
      {
        name: FIELD_ATTRS_LIST.TYPE,
        value: FIELD_TYPE_VALUES.TIMESTAMP,
      },
      { name: FIELD_ATTRS_LIST.UNIT, value: DT_UNIT_VALUES.SECOND },
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Second,
          timezone: TimeZoneEnum.UTC,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Millisecond,
          timezone: TimeZoneEnum.UTC,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Microsecond,
          timezone: TimeZoneEnum.UTC,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Nanosecond,
          timezone: TimeZoneEnum.UTC,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Nanosecond,
          timezone: TimeZoneEnum.UTC,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Nanosecond,
          timezone: TimeZoneEnum.UTC,
        },
      },
      clause: null,
      description: null,
      origin: null,
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
    ]) as Field;

    expect(data).not.toBeNull();
    expect(data).toEqual({
      name: "name",
      aggregation: AggregationTypeEnum.None,
      order: OrderTypeEnum.None,
      type: {
        type: DataTypeEnum.Timestamp,
        options: {
          nullable: false,
          unit: TimeUnitEnum.Nanosecond,
          timezone: TimeZoneEnum.GMT,
        },
      },
      clause: null,
      description: null,
      origin: null,
    });

    type SKey = keyof typeof TIMEZONE_VALUES;
    type NKey = keyof typeof TimeZoneEnum;
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
        ]) as Field;

        expect(data).not.toBeNull();
        expect(data).toEqual({
          name: "name",
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
          type: {
            type: DataTypeEnum.Timestamp,
            options: {
              nullable: false,
              unit: TimeUnitEnum.Nanosecond,
              timezone: TimeZoneEnum[nkey],
            },
          },
          clause: null,
          description: null,
          origin: null,
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
      ]) as Field;

      expect(data).not.toBeNull();
      expect(data).toEqual({
        name: "name",
        aggregation: AggregationTypeEnum.None,
        order: OrderTypeEnum.None,
        type: {
          type: DataTypeEnum.Timestamp,
          options: {
            nullable: false,
            unit: TimeUnitEnum.Nanosecond,
            timezone: TimeZoneEnum[nkey],
          },
        },
        clause: null,
        description: null,
        origin: null,
      });
    }
  });
});

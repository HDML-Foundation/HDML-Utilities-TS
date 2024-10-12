/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { Builder } from "flatbuffers";
import {
  FilterOperatorEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
} from "@hdml/schemas";
import { Frame } from "@hdml/types";
import { bufferifyFrame } from "./bufferifyFrame";
import { bufferifyField } from "./bufferifyField";
import { bufferifyFilterClause } from "./bufferifyFilterClause";

// Mocking dependencies
jest.mock("./bufferifyField");
jest.mock("./bufferifyFilterClause");

describe("The `bufferifyFrame` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);

    // Reset mocks
    (bufferifyField as jest.Mock).mockClear();
    (bufferifyFilterClause as jest.Mock).mockClear();
  });

  it("should correctly serialize a basic Frame", () => {
    const frame: Frame = {
      name: "test_frame",
      description: null,
      source: "test_model",
      offset: 0,
      limit: 100,
      fields: [
        {
          name: "field1",
          description: null,
          origin: null,
          clause: null,
          type: {
            type: DataTypeEnum.Unspecified,
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
      ],
      filter_by: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      group_by: [],
      split_by: [],
      sort_by: [],
    };

    // Mocking the dependencies
    (bufferifyField as jest.Mock).mockReturnValueOnce(100);
    (bufferifyFilterClause as jest.Mock).mockReturnValueOnce(200);

    const offset = bufferifyFrame(builder, frame);
    builder.finish(offset);
    const buf = builder.asUint8Array();

    expect(bufferifyField).toHaveBeenCalledTimes(1);
    expect(bufferifyField).toHaveBeenCalledWith(
      builder,
      frame.fields[0],
    );

    expect(bufferifyFilterClause).toHaveBeenCalledTimes(1);
    expect(bufferifyFilterClause).toHaveBeenCalledWith(
      builder,
      frame.filter_by,
    );

    // Test output buffer properties
    expect(offset).toBeGreaterThan(0);
    expect(buf).toBeInstanceOf(Uint8Array);
  });

  it("should correctly serialize a Frame with multiple fields", () => {
    const frame: Frame = {
      name: "test_frame",
      description: null,
      source: "test_model",
      offset: 0,
      limit: 100,
      fields: [
        {
          name: "field1",
          description: null,
          origin: null,
          clause: null,
          type: {
            type: DataTypeEnum.Unspecified,
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
        {
          name: "field2",
          description: "description",
          origin: null,
          clause: null,
          type: {
            type: DataTypeEnum.Unspecified,
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
      ],
      filter_by: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      group_by: [],
      split_by: [],
      sort_by: [],
    };

    (bufferifyField as jest.Mock)
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(101);
    (bufferifyFilterClause as jest.Mock).mockReturnValueOnce(200);

    const offset = bufferifyFrame(builder, frame);
    builder.finish(offset);
    const buf = builder.asUint8Array();

    expect(bufferifyField).toHaveBeenCalledTimes(2);
    expect(bufferifyField).toHaveBeenCalledWith(
      builder,
      frame.fields[0],
    );
    expect(bufferifyField).toHaveBeenCalledWith(
      builder,
      frame.fields[1],
    );

    expect(bufferifyFilterClause).toHaveBeenCalledTimes(1);
    expect(bufferifyFilterClause).toHaveBeenCalledWith(
      builder,
      frame.filter_by,
    );

    expect(offset).toBeGreaterThan(0);
    expect(buf).toBeInstanceOf(Uint8Array);
  });

  it("should correctly serialize a Frame with group_by, split_by, and sort_by fields", () => {
    const frame: Frame = {
      name: "complex_frame",
      description: "description",
      source: "complex_model",
      offset: 0,
      limit: 100,
      fields: [
        {
          name: "field1",
          description: null,
          origin: null,
          clause: null,
          type: {
            type: DataTypeEnum.Int8,
            options: {
              nullable: false,
            },
          },
          aggregation: AggregationTypeEnum.Sum,
          order: OrderTypeEnum.Ascending,
        },
      ],
      filter_by: {
        type: FilterOperatorEnum.None,
        filters: [],
        children: [],
      },
      group_by: [
        {
          name: "field1",
          description: null,
          origin: null,
          clause: null,
          type: {
            type: DataTypeEnum.Unspecified,
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
      ],
      split_by: [
        {
          name: "field1",
          description: null,
          origin: null,
          clause: null,
          type: {
            type: DataTypeEnum.Unspecified,
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
      ],
      sort_by: [
        {
          name: "field1",
          description: null,
          origin: null,
          clause: null,
          type: {
            type: DataTypeEnum.Unspecified,
          },
          aggregation: AggregationTypeEnum.None,
          order: OrderTypeEnum.None,
        },
      ],
    };

    (bufferifyField as jest.Mock)
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(101)
      .mockReturnValueOnce(102)
      .mockReturnValueOnce(103);
    (bufferifyFilterClause as jest.Mock).mockReturnValueOnce(200);

    const offset = bufferifyFrame(builder, frame);
    builder.finish(offset);
    const buf = builder.asUint8Array();

    expect(bufferifyField).toHaveBeenCalledTimes(4);
    expect(bufferifyFilterClause).toHaveBeenCalledTimes(1);

    expect(offset).toBeGreaterThan(0);
    expect(buf).toBeInstanceOf(Uint8Array);
  });
});

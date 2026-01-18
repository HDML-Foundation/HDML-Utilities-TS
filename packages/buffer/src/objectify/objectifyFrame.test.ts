/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import { Builder } from "flatbuffers";
import {
  FilterOperatorEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  FrameStruct,
} from "@hdml/schemas";
import { Frame } from "@hdml/types";
import { bufferifyFrame } from "../bufferify/bufferifyFrame";
import { objectifyFrame } from "./objectifyFrame";

describe("The `objectifyFrame` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  it("should objectify a basic Frame", () => {
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

    const offset = bufferifyFrame(builder, frame);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const frameStruct = FrameStruct.getRootAsFrameStruct(byteBuffer);
    const objectified = objectifyFrame(frameStruct);

    expect(objectified).toEqual(frame);
  });

  it("should objectify a Frame with multiple fields", () => {
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

    const offset = bufferifyFrame(builder, frame);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const frameStruct = FrameStruct.getRootAsFrameStruct(byteBuffer);
    const objectified = objectifyFrame(frameStruct);

    expect(objectified).toEqual(frame);
  });

  it("should objectify a Frame with group_by, split_by, and sort_by fields", () => {
    const frame: Frame = {
      name: "complex_frame",
      description: null,
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

    const offset = bufferifyFrame(builder, frame);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const frameStruct = FrameStruct.getRootAsFrameStruct(byteBuffer);
    const objectified = objectifyFrame(frameStruct);

    expect(objectified).toEqual(frame);
  });
});

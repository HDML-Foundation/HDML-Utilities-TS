/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import { Builder } from "flatbuffers";
import {
  TableTypeEnum,
  JoinTypeEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  ModelStruct,
} from "@hdml/schemas";
import { Model } from "@hdml/types";
import { bufferifyModel } from "../bufferify/bufferifyModel";
import { objectifyModel } from "./objectifyModel";

describe("The `objectifyModel` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  it("should objectify a Model from FlatBuffers", () => {
    const model: Model = {
      name: "TestModel",
      description: null,
      tables: [
        {
          name: "Table1",
          description: null,
          type: TableTypeEnum.Table,
          identifier: "database.schema.table1",
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
        },
      ],
      joins: [],
    };

    const offset = bufferifyModel(builder, model);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const modelStruct = ModelStruct.getRootAsModelStruct(byteBuffer);
    const objectified = objectifyModel(modelStruct);

    expect(objectified).toEqual(model);
  });

  it("should handle an empty model gracefully", () => {
    const model: Model = {
      name: "EmptyModel",
      description: null,
      tables: [],
      joins: [],
    };

    const offset = bufferifyModel(builder, model);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const modelStruct = ModelStruct.getRootAsModelStruct(byteBuffer);
    const objectified = objectifyModel(modelStruct);

    expect(objectified).toEqual(model);
  });

  it("should objectify a Model with joins", () => {
    const model: Model = {
      name: "TestModel",
      description: "description",
      tables: [
        {
          name: "Table1",
          description: "description",
          type: TableTypeEnum.Table,
          identifier: "database.schema.table1",
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
        },
      ],
      joins: [
        {
          type: JoinTypeEnum.Inner,
          left: "Table1",
          right: "Table2",
          clause: { type: 0, filters: [], children: [] },
          description: null,
        },
      ],
    };

    const offset = bufferifyModel(builder, model);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const modelStruct = ModelStruct.getRootAsModelStruct(byteBuffer);
    const objectified = objectifyModel(modelStruct);

    expect(objectified).toEqual(model);
  });
});

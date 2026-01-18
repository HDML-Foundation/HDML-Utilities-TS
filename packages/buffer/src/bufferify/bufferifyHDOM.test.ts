/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import {
  HDOMStruct,
  ConnectorTypesEnum,
  TableTypeEnum,
  FilterOperatorEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
} from "@hdml/schemas";
import { HDOM } from "@hdml/types";
import { bufferifyHDOM } from "./bufferifyHDOM";

describe("bufferifyHDOM", () => {
  it("should serialize an HDOM object to FlatBuffers", () => {
    const builder = new flatbuffers.Builder(1024);

    const hdom: HDOM = {
      includes: [{ path: "/path/to/doc.hdml" }],
      connections: [
        {
          name: "JDBCConnection",
          description: "JDBC metadata",
          options: {
            connector: ConnectorTypesEnum.Postgres,
            parameters: {
              host: "localhost",
              user: "root",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [
        {
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
        },
      ],
      frames: [
        {
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
        },
      ],
    };

    const offset = bufferifyHDOM(builder, hdom);
    builder.finish(offset);

    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fbHDDM = HDOMStruct.getRootAsHDOMStruct(byteBuffer);

    expect(fbHDDM.includesLength()).toBe(1);
    expect(fbHDDM.includes(0)?.path()).toBe("/path/to/doc.hdml");
    expect(fbHDDM.connectionsLength()).toBe(1);
    expect(fbHDDM.modelsLength()).toBe(1);
    expect(fbHDDM.framesLength()).toBe(1);
  });

  it("should handle empty HDOM object", () => {
    const builder = new flatbuffers.Builder(1024);

    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };

    const offset = bufferifyHDOM(builder, hdom);
    builder.finish(offset);

    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fbHDDM = HDOMStruct.getRootAsHDOMStruct(byteBuffer);

    expect(fbHDDM.includesLength()).toBe(0);
    expect(fbHDDM.connectionsLength()).toBe(0);
    expect(fbHDDM.modelsLength()).toBe(0);
    expect(fbHDDM.framesLength()).toBe(0);
  });
});

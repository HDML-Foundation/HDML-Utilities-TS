/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import {
  DocumentFilesStruct,
  ConnectorTypesEnum,
  TableTypeEnum,
  FilterOperatorEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
  ConnectionStruct,
  ModelStruct,
  FrameStruct,
} from "@hdml/schemas";
import { HDOM } from "@hdml/types";
import { bufferifyDocumentFiles } from "./bufferifyDocumentFiles";

describe("The `bufferifyDocumentFiles` function", () => {
  let builder: flatbuffers.Builder;

  beforeEach(() => {
    builder = new flatbuffers.Builder(1024);
  });

  it("should bufferify HDOM with connections, models, and frames", () => {
    const hdom: HDOM = {
      includes: [],
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

    const offset = bufferifyDocumentFiles(builder, hdom);
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(bytes);
    const struct =
      DocumentFilesStruct.getRootAsDocumentFilesStruct(byteBuffer);

    expect(struct.connectionsLength()).toBe(1);
    expect(struct.modelsLength()).toBe(1);
    expect(struct.framesLength()).toBe(1);

    // Verify connection file
    const connectionFile = struct.connections(0);
    expect(connectionFile).toBeDefined();
    expect(connectionFile?.name()).toBe("JDBCConnection");
    const connectionContent = connectionFile?.contentArray();
    expect(connectionContent).toBeDefined();
    expect(connectionContent?.length).toBeGreaterThan(0);

    // Verify model file
    const modelFile = struct.models(0);
    expect(modelFile).toBeDefined();
    expect(modelFile?.name()).toBe("TestModel");
    const modelContent = modelFile?.contentArray();
    expect(modelContent).toBeDefined();
    expect(modelContent?.length).toBeGreaterThan(0);

    // Verify frame file
    const frameFile = struct.frames(0);
    expect(frameFile).toBeDefined();
    expect(frameFile?.name()).toBe("test_frame");
    const frameContent = frameFile?.contentArray();
    expect(frameContent).toBeDefined();
    expect(frameContent?.length).toBeGreaterThan(0);
  });

  it("should handle empty HDOM object", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };

    const offset = bufferifyDocumentFiles(builder, hdom);
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(bytes);
    const struct =
      DocumentFilesStruct.getRootAsDocumentFilesStruct(byteBuffer);

    expect(struct.connectionsLength()).toBe(0);
    expect(struct.modelsLength()).toBe(0);
    expect(struct.framesLength()).toBe(0);
  });

  it("should handle multiple connections, models, and frames", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "Connection1",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Postgres,
            parameters: {
              host: "localhost",
              user: "user1",
              password: "pass1",
              ssl: false,
            },
          },
        },
        {
          name: "Connection2",
          description: null,
          options: {
            connector: ConnectorTypesEnum.MongoDB,
            parameters: {
              host: "localhost",
              port: 27017,
              user: "user2",
              password: "pass2",
              schema: "schema2",
              ssl: true,
            },
          },
        },
      ],
      models: [
        {
          name: "Model1",
          description: null,
          tables: [],
          joins: [],
        },
        {
          name: "Model2",
          description: null,
          tables: [],
          joins: [],
        },
      ],
      frames: [
        {
          name: "Frame1",
          description: null,
          source: "Model1",
          offset: 0,
          limit: 10,
          fields: [],
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: [],
          split_by: [],
          sort_by: [],
        },
        {
          name: "Frame2",
          description: null,
          source: "Model2",
          offset: 0,
          limit: 20,
          fields: [],
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

    const offset = bufferifyDocumentFiles(builder, hdom);
    expect(offset).toBeGreaterThan(0);

    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(bytes);
    const struct =
      DocumentFilesStruct.getRootAsDocumentFilesStruct(byteBuffer);

    expect(struct.connectionsLength()).toBe(2);
    expect(struct.modelsLength()).toBe(2);
    expect(struct.framesLength()).toBe(2);

    expect(struct.connections(0)?.name()).toBe("Connection1");
    expect(struct.connections(1)?.name()).toBe("Connection2");
    expect(struct.models(0)?.name()).toBe("Model1");
    expect(struct.models(1)?.name()).toBe("Model2");
    expect(struct.frames(0)?.name()).toBe("Frame1");
    expect(struct.frames(1)?.name()).toBe("Frame2");
  });

  it("should serialize file content that can be deserialized", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "TestConnection",
          description: "Test description",
          options: {
            connector: ConnectorTypesEnum.Postgres,
            parameters: {
              host: "testhost",
              user: "testuser",
              password: "testpass",
              ssl: true,
            },
          },
        },
      ],
      models: [
        {
          name: "TestModel",
          description: null,
          tables: [],
          joins: [],
        },
      ],
      frames: [
        {
          name: "TestFrame",
          description: null,
          source: "TestModel",
          offset: 0,
          limit: 100,
          fields: [],
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

    const offset = bufferifyDocumentFiles(builder, hdom);
    builder.finish(offset);
    const bytes = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(bytes);
    const struct =
      DocumentFilesStruct.getRootAsDocumentFilesStruct(byteBuffer);

    // Verify connection content can be deserialized
    const connectionFile = struct.connections(0);
    const connectionContent = connectionFile?.contentArray();
    if (connectionContent) {
      const connectionBuffer = new flatbuffers.ByteBuffer(
        connectionContent,
      );
      const connectionStruct =
        ConnectionStruct.getRootAsConnectionStruct(connectionBuffer);
      expect(connectionStruct.name()).toBe("TestConnection");
      expect(connectionStruct.description()).toBe("Test description");
    }

    // Verify model content can be deserialized
    const modelFile = struct.models(0);
    const modelContent = modelFile?.contentArray();
    if (modelContent) {
      const modelBuffer = new flatbuffers.ByteBuffer(modelContent);
      const modelStruct =
        ModelStruct.getRootAsModelStruct(modelBuffer);
      expect(modelStruct.name()).toBe("TestModel");
    }

    // Verify frame content can be deserialized
    const frameFile = struct.frames(0);
    const frameContent = frameFile?.contentArray();
    if (frameContent) {
      const frameBuffer = new flatbuffers.ByteBuffer(frameContent);
      const frameStruct =
        FrameStruct.getRootAsFrameStruct(frameBuffer);
      expect(frameStruct.name()).toBe("TestFrame");
      expect(frameStruct.source()).toBe("TestModel");
    }
  });
});

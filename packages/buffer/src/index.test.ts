/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import {
  ConnectorTypesEnum,
  TableTypeEnum,
  FilterOperatorEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
} from "@hdml/schemas";
import { HDOM } from "@hdml/types";
import * as flatbuffers from "flatbuffers";
import {
  ConnectionStruct,
  ModelStruct,
  FrameStruct,
} from "@hdml/schemas";
import { serialize, deserialize, structurize, fileifize } from ".";
import { objectifyConnection } from "./objectify/objectifyConnection";
import { objectifyModel } from "./objectify/objectifyModel";
import { objectifyFrame } from "./objectify/objectifyFrame";

describe("The `serialize` function", () => {
  it("should serialize an HDOM object to Uin8Array", () => {
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

    const bytes = serialize(hdom);
    const struct = structurize(bytes);

    // includes
    expect(struct.includesLength()).toBe(1);
    expect(struct.includes(0)?.path()).toBe("/path/to/doc.hdml");

    // connections
    expect(struct.connectionsLength()).toBe(1);

    // models
    expect(struct.modelsLength()).toBe(1);

    // frames
    expect(struct.framesLength()).toBe(1);
  });

  it("should handle empty HDOM object", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = structurize(bytes);

    expect(struct.includesLength()).toBe(0);
    expect(struct.connectionsLength()).toBe(0);
    expect(struct.modelsLength()).toBe(0);
    expect(struct.framesLength()).toBe(0);
  });
});

describe("The `deserialize` function", () => {
  it("should deserialize an HDOM object from Uint8Array", () => {
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

    const bytes = serialize(hdom);
    const deserialized = deserialize(bytes);

    expect(deserialized).toEqual(hdom);
  });

  it("should handle empty HDOM object", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };

    const bytes = serialize(hdom);
    const deserialized = deserialize(bytes);

    expect(deserialized).toEqual(hdom);
  });
});

describe("The `structurize` function", () => {
  it("should structurize a FlatBuffers binary into HDOMStruct", () => {
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

    const bytes = serialize(hdom);
    const struct = structurize(bytes);

    expect(struct).toBeDefined();
    expect(struct.includesLength()).toBe(1);
    expect(struct.includes(0)?.path()).toBe("/path/to/doc.hdml");
    expect(struct.connectionsLength()).toBe(1);
    expect(struct.modelsLength()).toBe(1);
    expect(struct.framesLength()).toBe(1);
  });

  it("should handle empty HDOM object", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };

    const bytes = serialize(hdom);
    const struct = structurize(bytes);

    expect(struct).toBeDefined();
    expect(struct.includesLength()).toBe(0);
    expect(struct.connectionsLength()).toBe(0);
    expect(struct.modelsLength()).toBe(0);
    expect(struct.framesLength()).toBe(0);
  });
});

describe("The `fileifize` function", () => {
  it("should split HDOM buffer into separate connection, model, and frame buffers", () => {
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

    const hdomBuffer = serialize(hdom);
    const result = fileifize(hdomBuffer);

    expect(result.connections).toHaveLength(1);
    expect(result.connections[0].name).toBe("JDBCConnection");
    expect(result.connections[0].buffer).toBeInstanceOf(Uint8Array);

    expect(result.models).toHaveLength(1);
    expect(result.models[0].name).toBe("TestModel");
    expect(result.models[0].buffer).toBeInstanceOf(Uint8Array);

    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].name).toBe("test_frame");
    expect(result.frames[0].buffer).toBeInstanceOf(Uint8Array);

    // Verify buffers can be deserialized back to original objects
    const connByteBuffer = new flatbuffers.ByteBuffer(
      result.connections[0].buffer,
    );
    const connStruct =
      ConnectionStruct.getRootAsConnectionStruct(connByteBuffer);
    const objectifiedConn = objectifyConnection(connStruct);
    expect(objectifiedConn).toEqual(hdom.connections[0]);

    const modelByteBuffer = new flatbuffers.ByteBuffer(
      result.models[0].buffer,
    );
    const modelStruct =
      ModelStruct.getRootAsModelStruct(modelByteBuffer);
    const objectifiedModel = objectifyModel(modelStruct);
    expect(objectifiedModel).toEqual(hdom.models[0]);

    const frameByteBuffer = new flatbuffers.ByteBuffer(
      result.frames[0].buffer,
    );
    const frameStruct =
      FrameStruct.getRootAsFrameStruct(frameByteBuffer);
    const objectifiedFrame = objectifyFrame(frameStruct);
    expect(objectifiedFrame).toEqual(hdom.frames[0]);
  });

  it("should handle empty HDOM object", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };

    const hdomBuffer = serialize(hdom);
    const result = fileifize(hdomBuffer);

    expect(result.connections).toHaveLength(0);
    expect(result.models).toHaveLength(0);
    expect(result.frames).toHaveLength(0);
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
          name: "frame1",
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
          name: "frame2",
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

    const hdomBuffer = serialize(hdom);
    const result = fileifize(hdomBuffer);

    expect(result.connections).toHaveLength(2);
    expect(result.connections[0].name).toBe("Connection1");
    expect(result.connections[1].name).toBe("Connection2");

    expect(result.models).toHaveLength(2);
    expect(result.models[0].name).toBe("Model1");
    expect(result.models[1].name).toBe("Model2");

    expect(result.frames).toHaveLength(2);
    expect(result.frames[0].name).toBe("frame1");
    expect(result.frames[1].name).toBe("frame2");

    // Verify all buffers can be deserialized
    result.connections.forEach((conn, i) => {
      const byteBuffer = new flatbuffers.ByteBuffer(conn.buffer);
      const struct =
        ConnectionStruct.getRootAsConnectionStruct(byteBuffer);
      const objectified = objectifyConnection(struct);
      expect(objectified).toEqual(hdom.connections[i]);
    });

    result.models.forEach((model, i) => {
      const byteBuffer = new flatbuffers.ByteBuffer(model.buffer);
      const struct = ModelStruct.getRootAsModelStruct(byteBuffer);
      const objectified = objectifyModel(struct);
      expect(objectified).toEqual(hdom.models[i]);
    });

    result.frames.forEach((frame, i) => {
      const byteBuffer = new flatbuffers.ByteBuffer(frame.buffer);
      const struct = FrameStruct.getRootAsFrameStruct(byteBuffer);
      const objectified = objectifyFrame(struct);
      expect(objectified).toEqual(hdom.frames[i]);
    });
  });
});

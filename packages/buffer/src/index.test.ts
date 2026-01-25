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
import {
  HDOMStruct,
  ConnectionStruct,
  ModelStruct,
  FrameStruct,
} from "@hdml/schemas";
import { serialize, deserialize, structurize, StructType } from ".";
import { objectifyConnection } from "./objectify/objectifyConnection";
import { objectifyModel } from "./objectify/objectifyModel";
import { objectifyFrame } from "./objectify/objectifyFrame";
import { bufferifyConnection } from "./bufferify/bufferifyConnection";
import { bufferifyModel } from "./bufferify/bufferifyModel";
import { bufferifyFrame } from "./bufferify/bufferifyFrame";
import { Connection, Model, Frame } from "@hdml/types";
import { Builder } from "flatbuffers";

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
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;

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

  it("should serialize an HDOM object with explicit type parameter", () => {
    const hdom: HDOM = {
      includes: [{ path: "/path/to/doc.hdml" }],
      connections: [],
      models: [],
      frames: [],
    };

    const bytes = serialize(hdom, StructType.HDOMStruct);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;

    expect(struct.includesLength()).toBe(1);
    expect(struct.includes(0)?.path()).toBe("/path/to/doc.hdml");
  });

  it("should serialize a Connection object with ConnectionStruct type", () => {
    const connection: Connection = {
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
    };

    const bytes = serialize(connection, StructType.ConnectionStruct);
    const struct = structurize(
      bytes,
      StructType.ConnectionStruct,
    ) as ConnectionStruct;

    expect(struct).toBeDefined();
    expect(struct.name()).toBe("JDBCConnection");
    expect(struct.description()).toBe("JDBC metadata");
  });

  it("should serialize a Model object with ModelStruct type", () => {
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

    const bytes = serialize(model, StructType.ModelStruct);
    const struct = structurize(
      bytes,
      StructType.ModelStruct,
    ) as ModelStruct;

    expect(struct).toBeDefined();
    expect(struct.name()).toBe("TestModel");
    expect(struct.tablesLength()).toBe(1);
  });

  it("should serialize a Frame object with FrameStruct type", () => {
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

    const bytes = serialize(frame, StructType.FrameStruct);
    const struct = structurize(
      bytes,
      StructType.FrameStruct,
    ) as FrameStruct;

    expect(struct).toBeDefined();
    expect(struct.name()).toBe("test_frame");
    expect(struct.source()).toBe("test_model");
    expect(struct.fieldsLength()).toBe(1);
  });

  it("should handle empty HDOM object", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;

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

  it("should deserialize an HDOM object with explicit type parameter", () => {
    const hdom: HDOM = {
      includes: [{ path: "/path/to/doc.hdml" }],
      connections: [],
      models: [],
      frames: [],
    };

    const bytes = serialize(hdom, StructType.HDOMStruct);
    const deserialized = deserialize(bytes, StructType.HDOMStruct);

    expect(deserialized).toEqual(hdom);
  });

  it("should deserialize a Connection object with ConnectionStruct type", () => {
    const connection: Connection = {
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
    };

    const bytes = serialize(connection, StructType.ConnectionStruct);
    const deserialized = deserialize(
      bytes,
      StructType.ConnectionStruct,
    ) as Connection;

    expect(deserialized).toEqual(connection);
  });

  it("should deserialize a Model object with ModelStruct type", () => {
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

    const bytes = serialize(model, StructType.ModelStruct);
    const deserialized = deserialize(
      bytes,
      StructType.ModelStruct,
    ) as Model;

    expect(deserialized).toEqual(model);
  });

  it("should deserialize a Frame object with FrameStruct type", () => {
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

    const bytes = serialize(frame, StructType.FrameStruct);
    const deserialized = deserialize(
      bytes,
      StructType.FrameStruct,
    ) as Frame;

    expect(deserialized).toEqual(frame);
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
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;

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
    const struct = structurize(
      bytes,
      StructType.HDOMStruct,
    ) as HDOMStruct;

    expect(struct).toBeDefined();
    expect(struct.includesLength()).toBe(0);
    expect(struct.connectionsLength()).toBe(0);
    expect(struct.modelsLength()).toBe(0);
    expect(struct.framesLength()).toBe(0);
  });

  it("should structurize a Connection buffer into ConnectionStruct", () => {
    const connection: Connection = {
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
    };

    const builder = new Builder(1024);
    const offset = bufferifyConnection(builder, connection);
    builder.finish(offset);
    const buffer = builder.asUint8Array();

    const struct = structurize(
      buffer,
      StructType.ConnectionStruct,
    ) as ConnectionStruct;

    expect(struct).toBeDefined();
    expect(struct.name()).toBe("JDBCConnection");
    expect(struct.description()).toBe("JDBC metadata");
    const objectified = objectifyConnection(struct);
    expect(objectified).toEqual(connection);
  });

  it("should structurize a Model buffer into ModelStruct", () => {
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

    const builder = new Builder(1024);
    const offset = bufferifyModel(builder, model);
    builder.finish(offset);
    const buffer = builder.asUint8Array();

    const struct = structurize(
      buffer,
      StructType.ModelStruct,
    ) as ModelStruct;

    expect(struct).toBeDefined();
    expect(struct.name()).toBe("TestModel");
    expect(struct.tablesLength()).toBe(1);
    const objectified = objectifyModel(struct);
    expect(objectified).toEqual(model);
  });

  it("should structurize a Frame buffer into FrameStruct", () => {
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

    const builder = new Builder(1024);
    const offset = bufferifyFrame(builder, frame);
    builder.finish(offset);
    const buffer = builder.asUint8Array();

    const struct = structurize(
      buffer,
      StructType.FrameStruct,
    ) as FrameStruct;

    expect(struct).toBeDefined();
    expect(struct.name()).toBe("test_frame");
    expect(struct.source()).toBe("test_model");
    expect(struct.offset().toString()).toBe("0");
    expect(struct.limit().toString()).toBe("100");
    expect(struct.fieldsLength()).toBe(1);
    const objectified = objectifyFrame(struct);
    expect(objectified).toEqual(frame);
  });
});

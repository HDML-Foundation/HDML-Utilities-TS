/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import { Builder } from "flatbuffers";
import { ConnectorTypesEnum, ConnectionStruct } from "@hdml/schemas";
import { Connection } from "@hdml/types";
import { bufferifyConnection } from "../bufferify/bufferifyConnection";
import { objectifyConnection } from "./objectifyConnection";

describe("The `objectifyConnection` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  test("should objectify a JDBC connection", () => {
    const connection: Connection = {
      name: "JDBCConnection",
      description: null,
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

    const offset = bufferifyConnection(builder, connection);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const connectionStruct =
      ConnectionStruct.getRootAsConnectionStruct(byteBuffer);
    const objectified = objectifyConnection(connectionStruct);

    expect(objectified).toEqual(connection);
  });

  test("should objectify a BigQuery connection", () => {
    const connection: Connection = {
      name: "BigQueryConnection",
      description: "BigQuery metadata",
      options: {
        connector: ConnectorTypesEnum.BigQuery,
        parameters: {
          project_id: "my-project-id",
          credentials_key: "my-credentials-key",
        },
      },
    };

    const offset = bufferifyConnection(builder, connection);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const connectionStruct =
      ConnectionStruct.getRootAsConnectionStruct(byteBuffer);
    const objectified = objectifyConnection(connectionStruct);

    expect(objectified).toEqual(connection);
  });

  test("should objectify a Google Sheets connection", () => {
    const connection: Connection = {
      name: "GoogleSheetsConnection",
      description: "GoogleSheets metadata",
      options: {
        connector: ConnectorTypesEnum.GoogleSheets,
        parameters: {
          sheet_id: "my-sheet-id",
          credentials_key: "my-credentials-key",
        },
      },
    };

    const offset = bufferifyConnection(builder, connection);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const connectionStruct =
      ConnectionStruct.getRootAsConnectionStruct(byteBuffer);
    const objectified = objectifyConnection(connectionStruct);

    expect(objectified).toEqual(connection);
  });

  test("should objectify an Elasticsearch connection", () => {
    const connection: Connection = {
      name: "ElasticSearchConnection",
      description: "ElasticSearch metadata",
      options: {
        connector: ConnectorTypesEnum.ElasticSearch,
        parameters: {
          host: "localhost",
          port: 9200,
          user: "elastic",
          password: "password",
          ssl: true,
          region: "us-west-1",
          access_key: "my-access-key",
          secret_key: "my-secret-key",
        },
      },
    };

    const offset = bufferifyConnection(builder, connection);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const connectionStruct =
      ConnectionStruct.getRootAsConnectionStruct(byteBuffer);
    const objectified = objectifyConnection(connectionStruct);

    expect(objectified).toEqual(connection);
  });

  test("should objectify a MongoDB connection", () => {
    const connection: Connection = {
      name: "MongoDBConnection",
      description: "MongoDB metadata",
      options: {
        connector: ConnectorTypesEnum.MongoDB,
        parameters: {
          host: "localhost",
          port: 27017,
          user: "admin",
          password: "password",
          schema: "my_schema",
          ssl: false,
        },
      },
    };

    const offset = bufferifyConnection(builder, connection);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const connectionStruct =
      ConnectionStruct.getRootAsConnectionStruct(byteBuffer);
    const objectified = objectifyConnection(connectionStruct);

    expect(objectified).toEqual(connection);
  });

  test("should objectify a Snowflake connection", () => {
    const connection: Connection = {
      name: "SnowflakeConnection",
      description: "Snowflake metadata",
      options: {
        connector: ConnectorTypesEnum.Snowflake,
        parameters: {
          account: "my_account",
          user: "my_user",
          password: "my_password",
          database: "my_database",
          role: "my_role",
          warehouse: "my_warehouse",
        },
      },
    };

    const offset = bufferifyConnection(builder, connection);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const connectionStruct =
      ConnectionStruct.getRootAsConnectionStruct(byteBuffer);
    const objectified = objectifyConnection(connectionStruct);

    expect(objectified).toEqual(connection);
  });
});

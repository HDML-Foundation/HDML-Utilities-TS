/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { IConnection, ConnectorTypes } from "@hdml/schemas";
import { bufferifyConnection } from "./bufferifyConnection";

/**
 * Jest test suite for `bufferifyConnection`.
 * This suite tests the serialization of `IConnection` objects
 * with different types of connection options.
 */
describe("The `bufferifyConnection` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  test("should bufferify a JDBC connection", () => {
    const connection: IConnection = {
      name: "JDBCConnection",
      meta: "JDBC metadata",
      options: {
        connector: ConnectorTypes.Postgres,
        parameters: {
          host: "localhost",
          user: "root",
          password: "password",
          ssl: true,
        },
      },
    };

    const offset = bufferifyConnection(builder, connection);
    expect(offset).toBeGreaterThan(0);
  });

  test("should bufferify a BigQuery connection", () => {
    const connection: IConnection = {
      name: "BigQueryConnection",
      meta: "BigQuery metadata",
      options: {
        connector: ConnectorTypes.BigQuery,
        parameters: {
          project_id: "my-project-id",
          credentials_key: "my-credentials-key",
        },
      },
    };

    const offset = bufferifyConnection(builder, connection);
    expect(offset).toBeGreaterThan(0);
  });

  test("should bufferify a Google Sheets connection", () => {
    const connection: IConnection = {
      name: "GoogleSheetsConnection",
      meta: "GoogleSheets metadata",
      options: {
        connector: ConnectorTypes.GoogleSheets,
        parameters: {
          sheet_id: "my-sheet-id",
          credentials_key: "my-credentials-key",
        },
      },
    };

    const offset = bufferifyConnection(builder, connection);
    expect(offset).toBeGreaterThan(0);
  });

  test("should bufferify an Elasticsearch connection", () => {
    const connection: IConnection = {
      name: "ElasticSearchConnection",
      meta: "ElasticSearch metadata",
      options: {
        connector: ConnectorTypes.ElasticSearch,
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
    expect(offset).toBeGreaterThan(0);
  });

  test("should bufferify a MongoDB connection", () => {
    const connection: IConnection = {
      name: "MongoDBConnection",
      meta: "MongoDB metadata",
      options: {
        connector: ConnectorTypes.MongoDB,
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
    expect(offset).toBeGreaterThan(0);
  });

  test("should bufferify a Snowflake connection", () => {
    const connection: IConnection = {
      name: "SnowflakeConnection",
      meta: "Snowflake metadata",
      options: {
        connector: ConnectorTypes.Snowflake,
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
    expect(offset).toBeGreaterThan(0);
  });
});

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import {
  // enums
  ConnectorTypes,
  // interfaces
  IConnection,
  IConnectionOptions,
  IJDBCParameters,
  IBigQueryParameters,
  IGoogleSheetsParameters,
  IElasticsearchParameters,
  IMongoDBParameters,
  ISnowflakeParameters,
  // structures
  Connection,
  JDBCParameters,
  BigQueryParameters,
  GoogleSheetsParameters,
  ElasticsearchParameters,
  MongoDBParameters,
  SnowflakeParameters,
} from "@hdml/schemas";

/**
 * Serializes a TypeScript `IConnection` object into its FlatBuffers
 * representation.
 *
 * This function converts a TypeScript `IConnection` object, which
 * defines database or data-source connection parameters, into its
 * FlatBuffers counterpart. The `IConnection` object can represent
 * a variety of connection types including JDBC, BigQuery,
 * GoogleSheets, Elasticsearch, MongoDB, and Snowflake.
 *
 * ## Example:
 *
 * ```typescript
 * const builder = new Builder(1024);
 * const connection: Connection = {
 *   name: "MyConnection",
 *   meta: "Metadata for connection",
 *   options: {
 *     connector: ConnectorTypes.MongoDB,
 *     parameters: {
 *       host: "localhost",
 *       port: 27017,
 *       user: "admin",
 *       password: "password",
 *       schema: "my_schema",
 *       ssl: false,
 *     },
 *   },
 * };
 * const bufferOffset = bufferifyConnection(builder, connection);
 * ```
 *
 * @param builder - The FlatBuffers `Builder` instance used to
 *                  serialize data.
 * @param connection - The TypeScript `Connection` object representing
 *                     the connection configuration.
 *
 * @returns The offset of the serialized `Connection` structure in the
 *          FlatBuffers builder.
 */
export function bufferifyConnection(
  builder: Builder,
  connection: IConnection,
): number {
  const nameOffset = builder.createString(connection.name);
  const metaOffset = builder.createString(connection.meta);
  const optionsOffset = bufferifyConnectionOptions(
    builder,
    connection.options,
  );

  Connection.startConnection(builder);
  Connection.addName(builder, nameOffset);
  Connection.addMeta(builder, metaOffset);
  Connection.addOptions(builder, optionsOffset);
  return Connection.endConnection(builder);
}

/**
 * Serializes `ConnectionOptions` into FlatBuffers based on the
 * connector type.
 *
 * @param builder - The FlatBuffers `Builder` instance.
 * @param options - The `ConnectionOptions` object.
 * @returns The offset of the serialized `ConnectionOptions`.
 */
function bufferifyConnectionOptions(
  builder: Builder,
  options: IConnectionOptions,
): number {
  switch (options.connector) {
    case ConnectorTypes.Postgres:
    case ConnectorTypes.MySQL:
    case ConnectorTypes.MsSQL:
    case ConnectorTypes.Oracle:
    case ConnectorTypes.Clickhouse:
    case ConnectorTypes.Druid:
    case ConnectorTypes.Ignite:
    case ConnectorTypes.Redshift:
      return bufferifyJDBCParameters(builder, options.parameters);
    case ConnectorTypes.BigQuery:
      return bufferifyBigQueryParameters(builder, options.parameters);
    case ConnectorTypes.GoogleSheets:
      return bufferifyGoogleSheetsParameters(
        builder,
        options.parameters,
      );
    case ConnectorTypes.ElasticSearch:
      return bufferifyElasticsearchParameters(
        builder,
        options.parameters,
      );
    case ConnectorTypes.MongoDB:
      return bufferifyMongoDBParameters(builder, options.parameters);
    case ConnectorTypes.Snowflake:
      return bufferifySnowflakeParameters(
        builder,
        options.parameters,
      );
  }
}

function bufferifyJDBCParameters(
  builder: Builder,
  params: IJDBCParameters,
): number {
  const hostOffset = builder.createString(params.host);
  const userOffset = builder.createString(params.user);
  const passwordOffset = builder.createString(params.password);

  return JDBCParameters.createJDBCParameters(
    builder,
    hostOffset,
    userOffset,
    passwordOffset,
    params.ssl,
  );
}

function bufferifyBigQueryParameters(
  builder: Builder,
  params: IBigQueryParameters,
): number {
  const projectIdOffset = builder.createString(params.project_id);
  const credentialsKeyOffset = builder.createString(
    params.credentials_key,
  );

  return BigQueryParameters.createBigQueryParameters(
    builder,
    projectIdOffset,
    credentialsKeyOffset,
  );
}

function bufferifyGoogleSheetsParameters(
  builder: Builder,
  params: IGoogleSheetsParameters,
): number {
  const sheetIdOffset = builder.createString(params.sheet_id);
  const credentialsKeyOffset = builder.createString(
    params.credentials_key,
  );

  return GoogleSheetsParameters.createGoogleSheetsParameters(
    builder,
    sheetIdOffset,
    credentialsKeyOffset,
  );
}

function bufferifyElasticsearchParameters(
  builder: Builder,
  params: IElasticsearchParameters,
): number {
  const hostOffset = builder.createString(params.host);
  const userOffset = builder.createString(params.user);
  const passwordOffset = builder.createString(params.password);
  const regionOffset = builder.createString(params.region);
  const accessKeyOffset = builder.createString(params.access_key);
  const secretKeyOffset = builder.createString(params.secret_key);

  return ElasticsearchParameters.createElasticsearchParameters(
    builder,
    hostOffset,
    params.port,
    userOffset,
    passwordOffset,
    params.ssl,
    regionOffset,
    accessKeyOffset,
    secretKeyOffset,
  );
}

function bufferifyMongoDBParameters(
  builder: Builder,
  params: IMongoDBParameters,
): number {
  const hostOffset = builder.createString(params.host);
  const userOffset = builder.createString(params.user);
  const passwordOffset = builder.createString(params.password);
  const schemaOffset = builder.createString(params.schema);

  return MongoDBParameters.createMongoDBParameters(
    builder,
    hostOffset,
    params.port,
    userOffset,
    passwordOffset,
    schemaOffset,
    params.ssl,
  );
}

function bufferifySnowflakeParameters(
  builder: Builder,
  params: ISnowflakeParameters,
): number {
  const accountOffset = builder.createString(params.account);
  const userOffset = builder.createString(params.user);
  const passwordOffset = builder.createString(params.password);
  const databaseOffset = builder.createString(params.database);
  const roleOffset = builder.createString(params.role);
  const warehouseOffset = builder.createString(params.warehouse);

  return SnowflakeParameters.createSnowflakeParameters(
    builder,
    accountOffset,
    userOffset,
    passwordOffset,
    databaseOffset,
    roleOffset,
    warehouseOffset,
  );
}

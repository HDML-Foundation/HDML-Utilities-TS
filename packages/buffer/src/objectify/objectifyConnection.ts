/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  ConnectorTypesEnum,
  ConnectionStruct,
  ConnectionOptionsStruct,
  JDBCParametersStruct,
  BigQueryParametersStruct,
  GoogleSheetsParametersStruct,
  ElasticsearchParametersStruct,
  MongoDBParametersStruct,
  SnowflakeParametersStruct,
} from "@hdml/schemas";
import {
  Connection,
  ConnectionOptions,
  JDBCParameters,
  BigQueryParameters,
  GoogleSheetsParameters,
  ElasticsearchParameters,
  MongoDBParameters,
  SnowflakeParameters,
} from "@hdml/types";

/**
 * Converts a FlatBuffers `ConnectionStruct` to a TypeScript
 * `Connection` object.
 *
 * This function deserializes a FlatBuffers `ConnectionStruct`
 * structure into a TypeScript `Connection` interface object. The
 * connection can
 * represent a variety of connection types including JDBC, BigQuery,
 * GoogleSheets, Elasticsearch, MongoDB, and Snowflake.
 *
 * @param connectionStruct The FlatBuffers `ConnectionStruct` object
 * to convert.
 *
 * @returns The converted `Connection` object.
 *
 * @example
 * ```ts
 * const connectionStruct: ConnectionStruct = ...;
 * const connection = objectifyConnection(connectionStruct);
 * ```
 */
export function objectifyConnection(
  connectionStruct: ConnectionStruct,
): Connection {
  const name = connectionStruct.name() || "";
  const description = connectionStruct.description();
  const optionsStruct = connectionStruct.options();
  if (!optionsStruct) {
    throw new Error("Connection options are required");
  }
  const options = objectifyConnectionOptions(optionsStruct);

  return {
    name,
    description,
    options,
  };
}

/**
 * Converts a FlatBuffers `ConnectionOptionsStruct` to a TypeScript
 * `ConnectionOptions` object.
 *
 * @param optionsStruct The FlatBuffers `ConnectionOptionsStruct`
 * object to convert.
 *
 * @returns The converted `ConnectionOptions` object.
 */
function objectifyConnectionOptions(
  optionsStruct: ConnectionOptionsStruct,
): ConnectionOptions {
  const connector = optionsStruct.connector();

  switch (connector) {
    case ConnectorTypesEnum.Postgres:
    case ConnectorTypesEnum.MySQL:
    case ConnectorTypesEnum.MsSQL:
    case ConnectorTypesEnum.Oracle:
    case ConnectorTypesEnum.Clickhouse:
    case ConnectorTypesEnum.Druid:
    case ConnectorTypesEnum.Ignite:
    case ConnectorTypesEnum.Redshift:
    case ConnectorTypesEnum.MariaDB: {
      const params = optionsStruct.parameters(
        new JDBCParametersStruct(),
      ) as unknown as JDBCParametersStruct;
      if (!params) {
        throw new Error("JDBC parameters struct is invalid");
      }
      const jdbcParams: JDBCParameters = {
        host: params.host() || "",
        user: params.user() || "",
        password: params.password() || "",
        ssl: params.ssl(),
      };
      return {
        connector,
        parameters: jdbcParams,
      };
    }

    case ConnectorTypesEnum.BigQuery: {
      const params = optionsStruct.parameters(
        new BigQueryParametersStruct(),
      ) as unknown as BigQueryParametersStruct;
      if (!params) {
        throw new Error("BigQuery parameters struct is invalid");
      }
      const bigQueryParams: BigQueryParameters = {
        project_id: params.projectId() || "",
        credentials_key: params.credentialsKey() || "",
      };
      return {
        connector,
        parameters: bigQueryParams,
      };
    }

    case ConnectorTypesEnum.GoogleSheets: {
      const params = optionsStruct.parameters(
        new GoogleSheetsParametersStruct(),
      ) as unknown as GoogleSheetsParametersStruct;
      if (!params) {
        throw new Error("GoogleSheets parameters struct is invalid");
      }
      const sheetsParams: GoogleSheetsParameters = {
        sheet_id: params.sheetId() || "",
        credentials_key: params.credentialsKey() || "",
      };
      return {
        connector,
        parameters: sheetsParams,
      };
    }

    case ConnectorTypesEnum.ElasticSearch: {
      const params = optionsStruct.parameters(
        new ElasticsearchParametersStruct(),
      ) as unknown as ElasticsearchParametersStruct;
      if (!params) {
        throw new Error("Elasticsearch parameters struct is invalid");
      }
      const esParams: ElasticsearchParameters = {
        host: params.host() || "",
        port: params.port(),
        user: params.user(),
        password: params.password(),
        ssl: params.ssl(),
        region: params.region(),
        access_key: params.accessKey(),
        secret_key: params.secretKey(),
      };
      return {
        connector,
        parameters: esParams,
      };
    }

    case ConnectorTypesEnum.MongoDB: {
      const params = optionsStruct.parameters(
        new MongoDBParametersStruct(),
      ) as unknown as MongoDBParametersStruct;
      if (!params) {
        throw new Error("MongoDB parameters struct is invalid");
      }
      const mongoParams: MongoDBParameters = {
        host: params.host() || "",
        port: params.port(),
        user: params.user() || "",
        password: params.password() || "",
        schema: params.schema() || "",
        ssl: params.ssl(),
      };
      return {
        connector,
        parameters: mongoParams,
      };
    }

    case ConnectorTypesEnum.Snowflake: {
      const params = optionsStruct.parameters(
        new SnowflakeParametersStruct(),
      ) as unknown as SnowflakeParametersStruct;
      if (!params) {
        throw new Error("Snowflake parameters struct is invalid");
      }
      const snowflakeParams: SnowflakeParameters = {
        account: params.account() || "",
        user: params.user() || "",
        password: params.password() || "",
        database: params.database() || "",
        role: params.role() || "",
        warehouse: params.warehouse() || "",
      };
      return {
        connector,
        parameters: snowflakeParams,
      };
    }

    default: {
      const _exhaustive: never = connector;
      throw new Error(
        `Unsupported connector type: ${String(_exhaustive)}`,
      );
    }
  }
}

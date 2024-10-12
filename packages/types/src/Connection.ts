/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ConnectorTypesEnum } from "@hdml/schemas";

/**
 * The `JDBCParameters` interface defines the connection parameters
 * required to establish a connection to a JDBC-compatible database:
 *
 * - Postgres
 * - MySQL
 * - MS SQL
 * - MariaDB
 * - Oracle
 * - ClickHouse
 * - Druid
 * - Ignite
 * - Redshift
 *
 * It includes properties for specifying the database host, user
 * credentials, and security settings.
 *
 * ## Properties:
 *
 * - `host` (string): The hostname or IP address of the database
 *   server.
 *
 * - `user` (string): The username for authenticating the database
 *   connection.
 *
 * - `password` (string): The password associated with the specified
 *   user for authentication.
 *
 * - `ssl` (boolean): Indicates whether SSL/TLS is enabled for the
 *   connection. `true` for enabling SSL, `false` otherwise.
 *
 * ## Example:
 *
 * ```ts
 * const dbParams: JDBCParameters = {
 *   host: "db.example.com",
 *   user: "admin",
 *   password: "securepassword",
 *   ssl: true
 * };
 * ```
 *
 * In this example, `dbParams` defines the parameters to connect to
 * a database at `db.example.com` using SSL.
 */

export type JDBCParameters = {
  host: string;
  user: string;
  password: string;
  ssl: boolean;
};

/**
 * The `BigQueryParameters` interface defines the connection
 * parameters required to establish a connection to Google BigQuery.
 * It includes properties for specifying the project ID and the
 * credentials key needed for authentication.
 *
 * ## Properties:
 *
 * - `project_id` (string): The ID of the Google Cloud project
 *   containing the BigQuery dataset.
 *
 * - `credentials_key` (string): The base64 encoded credentials key
 *   for the service account used to authenticate the connection to
 *   BigQuery.
 *
 * ## Example:
 *
 * ```ts
 * const bigQueryParams: BigQueryParameters = {
 *   project_id: "my-project-id",
 *   credentials_key: "base64encodedkey=="
 * };
 * ```
 *
 * In this example, `bigQueryParams` provides the project ID and
 * the path to the credentials key file for connecting to BigQuery.
 */
export type BigQueryParameters = {
  project_id: string;
  credentials_key: string;
};

/**
 * The `GoogleSheetsParameters` interface defines the connection
 * parameters required to access a Google Sheets document.
 * It includes properties for specifying the sheet ID and the
 * credentials key needed for authentication.
 *
 * ## Properties:
 *
 * - `sheet_id` (string): The unique identifier of the Google Sheets
 *   document to be accessed.
 *
 * - `credentials_key` (string): The base64 encoded credentials key
 *   for the service account used to authenticate the connection to
 *   Google Sheets.
 *
 * ## Example:
 *
 * ```ts
 * const sheetsParams: GoogleSheetsParameters = {
 *   sheet_id: "1A2B3C4D5E6F7G8H9I0J",
 *   credentials_key: "base64encodedkey=="
 * };
 * ```
 *
 * In this example, `sheetsParams` specifies the sheet ID and the
 * path to the credentials key file for accessing the Google Sheets
 * document.
 */
export type GoogleSheetsParameters = {
  sheet_id: string;
  credentials_key: string;
};

/**
 * The `ElasticsearchParameters` interface defines the connection
 * parameters required to establish a connection to an Elasticsearch
 * cluster. It includes properties for specifying the host, port, user
 * credentials, and security settings.
 *
 * ## Properties:
 *
 * - `host` (string): The hostname or IP address of the Elasticsearch
 *   server.
 *
 * - `port` (number): The port number on which the Elasticsearch
 *   server is listening.
 *
 * - `user` (string): The username for authenticating the connection
 *   to Elasticsearch.
 *
 * - `password` (string): The password associated with the specified
 *   user for authentication.
 *
 * - `ssl` (boolean): Indicates whether SSL/TLS is enabled for the
 *   connection. `true` for enabling SSL, `false` otherwise.
 *
 * - `region` (string): The AWS region where the Elasticsearch cluster
 *   is hosted.
 *
 * - `access_key` (string): The AWS access key for authenticating
 *   requests to Elasticsearch.
 *
 * - `secret_key` (string): The AWS secret key associated with the
 *   access key for secure authentication.
 *
 * ## Example:
 *
 * ```ts
 * const esParams: ElasticsearchParameters = {
 *   host: "es.example.com",
 *   port: 9200,
 *   user: "admin",
 *   password: "securepassword",
 *   ssl: true,
 *   region: "us-west-1",
 *   access_key: "your-access-key",
 *   secret_key: "your-secret-key"
 * };
 * ```
 *
 * In this example, `esParams` specifies the connection details for an
 * Elasticsearch cluster, including security and region settings.
 */
export type ElasticsearchParameters = {
  host: string;
  port: number;
  user: null | string;
  password: null | string;
  ssl: boolean;
  region: null | string;
  access_key: null | string;
  secret_key: null | string;
};

/**
 * The `MongoDBParameters` interface defines the connection parameters
 * required to establish a connection to a MongoDB database. It
 * includes properties for specifying the host, port, user
 * credentials, and security settings.
 *
 * ## Properties:
 *
 * - `host` (string): The hostname or IP address of the MongoDB.
 *
 * - `port` (number): The port number on which the MongoDB server is
 *   listening.
 *
 * - `user` (string): The username for authenticating the connection.
 *
 * - `password` (string): The password associated with the specified
 *   user for authentication.
 *
 * - `schema` (string): A collection which contains schema
 *   information.
 *
 * - `ssl` (boolean): Indicates whether SSL/TLS is enabled for the
 *   connection. `true` for enabling SSL, `false` otherwise.
 *
 * ## Example:
 *
 * ```ts
 * const mongoParams: MongoDBParameters = {
 *   host: "mongodb.example.com",
 *   port: 27017,
 *   user: "admin",
 *   password: "securepassword",
 *   schema: "schema_collection",
 *   ssl: true
 * };
 * ```
 *
 * In this example, `mongoParams` specifies the connection details for
 * a MongoDB database, including security and schema settings.
 */
export type MongoDBParameters = {
  host: string;
  port: number;
  user: string;
  password: string;
  schema: string;
  ssl: boolean;
};

/**
 * The `SnowflakeParameters` interface defines the connection
 * parameters required to connect to a Snowflake data warehouse.
 * It includes properties for specifying account details, user
 * credentials, and database settings.
 *
 * ## Properties:
 *
 * - `account` (string): The Snowflake account identifier.
 *
 * - `user` (string): The username for authenticating the
 *   connection to Snowflake.
 *
 * - `password` (string): The password associated with the
 *   specified user for authentication.
 *
 * - `database` (string): The name of the Snowflake database
 *   to connect to.
 *
 * - `role` (string): The Snowflake role to assume for the
 *   connection.
 *
 * - `warehouse` (string): The Snowflake warehouse to use for
 *   query execution.
 *
 * ## Example:
 *
 * ```ts
 * const snowflakeParams: SnowflakeParameters = {
 *   account: "myaccount",
 *   user: "admin",
 *   password: "securepassword",
 *   database: "mydatabase",
 *   role: "myrole",
 *   warehouse: "mywarehouse"
 * };
 * ```
 *
 * In this example, `snowflakeParams` specifies the connection
 * details for a Snowflake data warehouse, including account,
 * user, and database settings.
 */
export type SnowflakeParameters = {
  account: string;
  user: string;
  password: string;
  database: string;
  role: string;
  warehouse: string;
};

/**
 * The `ConnectionOptions` type defines the configuration for
 * different types of data connectors. It includes various
 * connector types and their associated parameters.
 *
 * ## Types:
 *
 * - **JDBC Connectors**: Includes connectors for databases
 *   such as PostgreSQL, MySQL, MS SQL, Oracle, MariaDB, Clickhouse,
 *   Druid, Ignite, and Redshift. Uses `JDBCParameters`.
 *
 * - **BigQuery**: For Google BigQuery. Uses `BigQueryParameters`.
 *
 * - **Google Sheets**: For accessing Google Sheets. Uses
 *   `GoogleSheetsParameters`.
 *
 * - **Elasticsearch**: For connecting to an Elasticsearch
 *   cluster. Uses `ElasticsearchParameters`.
 *
 * - **MongoDB**: For connecting to a MongoDB database. Uses
 *   `MongoDBParameters`.
 *
 * - **Snowflake**: For connecting to a Snowflake data warehouse.
 *   Uses `SnowflakeParameters`.
 *
 * ## Example:
 *
 * ```ts
 * const connectionOptions: ConnectionOptions = {
 *   connector: ConnectorTypesEnum.Postgres,
 *   parameters: {
 *     host: "db.example.com",
 *     port: 5432,
 *     user: "admin",
 *     password: "securepassword",
 *     ssl: true
 *   }
 * };
 * ```
 *
 * In this example, `connectionOptions` specifies a PostgreSQL
 * connector with its associated parameters for connecting to
 * a database.
 */
export type ConnectionOptions =
  | {
      connector:
        | ConnectorTypesEnum.Postgres
        | ConnectorTypesEnum.MySQL
        | ConnectorTypesEnum.MsSQL
        | ConnectorTypesEnum.Oracle
        | ConnectorTypesEnum.Clickhouse
        | ConnectorTypesEnum.Druid
        | ConnectorTypesEnum.Ignite
        | ConnectorTypesEnum.Redshift
        | ConnectorTypesEnum.MariaDB;
      parameters: JDBCParameters;
    }
  | {
      connector: ConnectorTypesEnum.BigQuery;
      parameters: BigQueryParameters;
    }
  | {
      connector: ConnectorTypesEnum.GoogleSheets;
      parameters: GoogleSheetsParameters;
    }
  | {
      connector: ConnectorTypesEnum.ElasticSearch;
      parameters: ElasticsearchParameters;
    }
  | {
      connector: ConnectorTypesEnum.MongoDB;
      parameters: MongoDBParameters;
    }
  | {
      connector: ConnectorTypesEnum.Snowflake;
      parameters: SnowflakeParameters;
    };

/**
 * The `Connection` interface represents a data connection
 * configuration. It includes details for the connection name,
 * metadata, and the connection options.
 *
 * ## Properties:
 *
 * - `name` (string): The name of the connection. This name is
 *   used as the first segment in a three-tier table name.
 *
 * - `meta` (string): Metadata or description associated with
 *   the connection.
 *
 * - `options` (ConnectionOptions): The configuration options
 *   for the connection, including the connector type and
 *   parameters.
 *
 * ## Example:
 *
 * ```ts
 * const connection: Connection = {
 *   name: "my_connection",
 *   meta: "A description of the connection",
 *   options: {
 *     connector: ConnectorTypesEnum.MongoDB,
 *     parameters: {
 *       host: "mongodb.example.com",
 *       port: 27017,
 *       user: "admin",
 *       password: "securepassword",
 *       schema: "mydatabase",
 *       ssl: true
 *     }
 *   }
 * };
 * ```
 *
 * In this example, `connection` defines a MongoDB connection
 * with a specified name, metadata, and connection options.
 */
export interface Connection {
  name: string;
  description: null | string;
  options: ConnectionOptions;
}

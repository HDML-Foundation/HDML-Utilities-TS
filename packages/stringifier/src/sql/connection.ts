/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  ConnectionStruct,
  ConnectorTypesEnum,
  ConnectionOptionsStruct,
  JDBCParametersStruct,
  BigQueryParametersStruct,
  GoogleSheetsParametersStruct,
  ElasticsearchParametersStruct,
  MongoDBParametersStruct,
  SnowflakeParametersStruct,
} from "@hdml/schemas";
import { t } from "../constants";

export function getConnectionSQLs(conn: ConnectionStruct): string[] {
  const name = conn.name();
  const opts = conn.options();
  const sqls = [
    `show catalogs like '${name}'`,
    `drop catalog ${name}`,
  ];

  if (!name || !opts) {
    return [];
  } else {
    switch (opts.connector()) {
      case ConnectorTypesEnum.Postgres:
      case ConnectorTypesEnum.MySQL:
      case ConnectorTypesEnum.MsSQL:
      case ConnectorTypesEnum.Oracle:
      case ConnectorTypesEnum.Clickhouse:
      case ConnectorTypesEnum.Druid:
      case ConnectorTypesEnum.Ignite:
      case ConnectorTypesEnum.Redshift:
      case ConnectorTypesEnum.MariaDB:
        sqls.push(getJdbcSQL(name, opts));
        break;

      case ConnectorTypesEnum.BigQuery:
        sqls.push(getBigQuerySQL(name, opts));
        break;

      case ConnectorTypesEnum.GoogleSheets:
        sqls.push(getGoogleSheetsSQL(name, opts));
        break;

      case ConnectorTypesEnum.ElasticSearch:
        sqls.push(getElasticSearchSQL(name, opts));
        break;

      case ConnectorTypesEnum.MongoDB:
        sqls.push(getMongoSQL(name, opts));
        break;

      case ConnectorTypesEnum.Snowflake:
        sqls.push(getSnowflakeSQL(name, opts));
        break;
    }
  }

  return sqls;
}

export function getJdbcSQL(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new JDBCParametersStruct(),
  ) as JDBCParametersStruct;

  const host = params.host() || "";
  const user = params.user() || "";
  const pass = params.password() || "";
  const ssl = params.ssl();

  let sql = `create catalog ${name} using `;
  switch (opts.connector()) {
    case ConnectorTypesEnum.Postgres:
      sql = sql + "postgresql\nwith (\n";
      break;

    case ConnectorTypesEnum.MySQL:
      sql = sql + "mysql\nwith (\n";
      break;

    case ConnectorTypesEnum.MsSQL:
      sql = sql + "mssql\nwith (\n";
      break;

    case ConnectorTypesEnum.Oracle:
      sql = sql + "oracle\nwith (\n";
      break;

    case ConnectorTypesEnum.Clickhouse:
      sql = sql + "clickhouse\nwith (\n";
      break;

    case ConnectorTypesEnum.Druid:
      sql = sql + "druid\nwith (\n";
      break;

    case ConnectorTypesEnum.Ignite:
      sql = sql + "ignite\nwith (\n";
      break;

    case ConnectorTypesEnum.Redshift:
      sql = sql + "redshift\nwith (\n";
      break;

    case ConnectorTypesEnum.MariaDB:
      sql = sql + "mariadb\nwith (\n";
      break;
  }

  sql =
    sql +
    `${t}"connection-url" = '${host}${ssl ? "?ssl=true" : ""}'\n` +
    `${t}"connection-user" = '${user}'\n` +
    `${t}"connection-password" = '${pass}'\n` +
    ")\n";

  return sql;
}

export function getBigQuerySQL(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new BigQueryParametersStruct(),
  ) as BigQueryParametersStruct;

  const projectId = params.projectId() || "";
  const credentialsKey = params.credentialsKey() || "";
  const sql =
    `create catalog ${name} using bigquery\nwith (\n` +
    `${t}"project-id" = '${projectId}'\n` +
    `${t}"credentials-key" = '${credentialsKey}'\n` +
    `)\n`;

  return sql;
}

export function getGoogleSheetsSQL(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new GoogleSheetsParametersStruct(),
  ) as GoogleSheetsParametersStruct;

  const sheetId = params.sheetId() || "";
  const credentialsKey = params.credentialsKey() || "";
  const sql =
    `create catalog ${name} using googlesheets\nwith (\n` +
    `${t}"gsheets.metadata-sheet-id" = '${sheetId}'\n` +
    `${t}"gsheets.credentials-key" = '${credentialsKey}'\n` +
    `)\n`;

  return sql;
}

export function getElasticSearchSQL(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new ElasticsearchParametersStruct(),
  ) as ElasticsearchParametersStruct;

  const host = params.host() || "";
  const port = params.port() || "";
  const user = params.user() || "";
  const password = params.password() || "";
  const region = params.region() || "";
  const accessKey = params.accessKey() || "";
  const secretKey = params.secretKey() || "";

  const sql =
    `create catalog ${name} using elasticsearch\nwith (\n` +
    `${t}"gelasticsearch.host" = '${host}'\n` +
    `${t}"elasticsearch.port" = '${port}'\n` +
    `${t}"elasticsearch.auth.user" = '${user}'\n` +
    `${t}"elasticsearch.auth.password" = '${password}'\n` +
    `${t}"elasticsearch.aws.region" = '${region}'\n` +
    `${t}"elasticsearch.aws.access-key" = '${accessKey}'\n` +
    `${t}"elasticsearch.aws.secret-key" = '${secretKey}'\n` +
    `)\n`;

  return sql;
}

export function getMongoSQL(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new MongoDBParametersStruct(),
  ) as MongoDBParametersStruct;

  const host = params.host() || "";
  const port = params.port() || "";
  const user = params.user() || "";
  const password = params.password() || "";
  const schema = params.schema() || "";
  const ssl = params.ssl() || "";
  const url = `mongodb://${user}:${password}@${host}:${port}/`;

  const sql =
    `create catalog ${name} using mongodb\nwith (\n` +
    `${t}"mongodb.connection-url" = '${url}'\n` +
    `${t}"mongodb.schema-collection" = '${schema}'\n` +
    `${t}"mongodb.tls.enabled" = '${ssl ? "true" : "false"}'\n` +
    `)\n`;

  return sql;
}

export function getSnowflakeSQL(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new SnowflakeParametersStruct(),
  ) as SnowflakeParametersStruct;

  const account = params.account() || "";
  const warehouse = params.warehouse() || "";
  const database = params.database() || "";
  const user = params.user() || "";
  const password = params.password() || "";
  const role = params.role() || "";
  const url = `jdbc:snowflake://${account}.snowflakecomputing.com`;
  const sql =
    `create catalog ${name} using snowflake\nwith (\n` +
    `${t}"connection-url" = '${url}'\n` +
    `${t}"connection-user" = '${user}'\n` +
    `${t}"connection-password" = '${password}'\n` +
    `${t}"snowflake.account" = '${account}'\n` +
    `${t}"snowflake.database" = '${database}'\n` +
    `${t}"snowflake.role" = '${role}'\n` +
    `${t}"snowflake.warehouse" = '${warehouse}'\n` +
    `)\n`;

  return sql;
}

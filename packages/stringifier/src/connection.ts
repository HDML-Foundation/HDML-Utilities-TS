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
import {
  HDML_TAG_NAMES,
  CONN_ATTRS_LIST,
  CONN_TYPE_VALUES,
} from "@hdml/types";
import { t } from "./constants";

export function getConnectionSQLs(conn: ConnectionStruct): string[] {
  if (!conn.name()) {
    return [];
  } else {
    const name = conn.name()!;
    const opts = conn.options()!;
    const sqls = [
      `show catalogs like '${name}'`,
      `drop catalog ${name}`,
    ];
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
    return sqls;
  }
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
  const port = params.port();
  const user = params.user() || "";
  const password = params.password() || "";
  const region = params.region() || "";
  const accessKey = params.accessKey() || "";
  const secretKey = params.secretKey() || "";
  const sql =
    `create catalog ${name} using elasticsearch\nwith (\n` +
    `${t}"elasticsearch.host" = '${host}'\n` +
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
  const port = params.port();
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

export function getConnectionHTML(conn: ConnectionStruct): string {
  if (!conn.name()) {
    return "";
  } else {
    const name = conn.name()!;
    const opts = conn.options()!;
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
        return getJdbcHTML(name, opts);

      case ConnectorTypesEnum.BigQuery:
        return getBigQueryHTML(name, opts);

      case ConnectorTypesEnum.GoogleSheets:
        return getGoogleSheetsHTML(name, opts);

      case ConnectorTypesEnum.ElasticSearch:
        return getElasticSearchHTML(name, opts);

      case ConnectorTypesEnum.MongoDB:
        return getMongoHTML(name, opts);

      case ConnectorTypesEnum.Snowflake:
        return getSnowflakeHTML(name, opts);
    }
  }
}

export function getJdbcHTML(
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

  let html =
    `<${HDML_TAG_NAMES.CONNECTION}\n${t}` +
    `${CONN_ATTRS_LIST.NAME}="${name}"\n`;
  switch (opts.connector()) {
    case ConnectorTypesEnum.Postgres:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.POSTGRES}"\n`;
      break;

    case ConnectorTypesEnum.MySQL:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.MYSQL}"\n`;
      break;

    case ConnectorTypesEnum.MsSQL:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.MSSQL}"\n`;
      break;

    case ConnectorTypesEnum.Oracle:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.ORACLE}"\n`;
      break;

    case ConnectorTypesEnum.Clickhouse:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.CLICKHOUSE}"\n`;
      break;

    case ConnectorTypesEnum.Druid:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.DRUID}"\n`;
      break;

    case ConnectorTypesEnum.Ignite:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.IGNITE}"\n`;
      break;

    case ConnectorTypesEnum.Redshift:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.REDSHIFT}"\n`;
      break;

    case ConnectorTypesEnum.MariaDB:
      html =
        html +
        `${t}${CONN_ATTRS_LIST.TYPE}=` +
        `"${CONN_TYPE_VALUES.MARIADB}"\n`;
      break;
  }
  html =
    html +
    `${t}${CONN_ATTRS_LIST.HOST}="${host}"\n` +
    `${t}${CONN_ATTRS_LIST.SSL}="${ssl ? "true" : "false"}"\n` +
    `${t}${CONN_ATTRS_LIST.USER}="${user}"\n` +
    `${t}${CONN_ATTRS_LIST.PASSWORD}="${pass}"\n` +
    `</${HDML_TAG_NAMES.CONNECTION}>\n`;

  return html;
}

export function getBigQueryHTML(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new BigQueryParametersStruct(),
  ) as BigQueryParametersStruct;

  const projectId = params.projectId() || "";
  const credentialsKey = params.credentialsKey() || "";
  const html =
    `<${HDML_TAG_NAMES.CONNECTION}\n${t}` +
    `${CONN_ATTRS_LIST.NAME}="${name}"\n` +
    `${t}${CONN_ATTRS_LIST.TYPE}="${CONN_TYPE_VALUES.BIGQUERY}"\n` +
    `${t}${CONN_ATTRS_LIST.PROJECT_ID}="${projectId}"\n` +
    `${t}${CONN_ATTRS_LIST.CREDENTIALS_KEY}="${credentialsKey}"\n` +
    `</${HDML_TAG_NAMES.CONNECTION}>\n`;

  return html;
}

export function getGoogleSheetsHTML(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new GoogleSheetsParametersStruct(),
  ) as GoogleSheetsParametersStruct;

  const sheetId = params.sheetId() || "";
  const credentialsKey = params.credentialsKey() || "";
  const html =
    `<${HDML_TAG_NAMES.CONNECTION}\n${t}` +
    `${CONN_ATTRS_LIST.NAME}="${name}"\n` +
    `${t}${CONN_ATTRS_LIST.TYPE}=` +
    `"${CONN_TYPE_VALUES.GOOGLESHEETS}"\n` +
    `${t}${CONN_ATTRS_LIST.SHEET_ID}="${sheetId}"\n` +
    `${t}${CONN_ATTRS_LIST.CREDENTIALS_KEY}="${credentialsKey}"\n` +
    `</${HDML_TAG_NAMES.CONNECTION}>\n`;

  return html;
}

export function getElasticSearchHTML(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new ElasticsearchParametersStruct(),
  ) as ElasticsearchParametersStruct;

  const host = params.host() || "";
  const port = params.port();
  const user = params.user() || "";
  const password = params.password() || "";
  const region = params.region() || "";
  const accessKey = params.accessKey() || "";
  const secretKey = params.secretKey() || "";
  const html =
    `<${HDML_TAG_NAMES.CONNECTION}\n${t}` +
    `${CONN_ATTRS_LIST.NAME}="${name}"\n` +
    `${t}${CONN_ATTRS_LIST.TYPE}=` +
    `"${CONN_TYPE_VALUES.ELASTICSEARCH}"\n` +
    `${t}${CONN_ATTRS_LIST.HOST}="${host}"\n` +
    `${t}${CONN_ATTRS_LIST.PORT}="${port}"\n` +
    `${t}${CONN_ATTRS_LIST.USER}="${user}"\n` +
    `${t}${CONN_ATTRS_LIST.PASSWORD}="${password}"\n` +
    `${t}${CONN_ATTRS_LIST.REGION}="${region}"\n` +
    `${t}${CONN_ATTRS_LIST.ACCESS_KEY}="${accessKey}"\n` +
    `${t}${CONN_ATTRS_LIST.SECRET_KEY}="${secretKey}"\n` +
    `</${HDML_TAG_NAMES.CONNECTION}>\n`;

  return html;
}

export function getMongoHTML(
  name: string,
  opts: ConnectionOptionsStruct,
): string {
  const params = opts.parameters(
    new MongoDBParametersStruct(),
  ) as MongoDBParametersStruct;

  const host = params.host() || "";
  const port = params.port();
  const user = params.user() || "";
  const password = params.password() || "";
  const schema = params.schema() || "";
  const ssl = params.ssl() || "";
  const html =
    `<${HDML_TAG_NAMES.CONNECTION}\n${t}` +
    `${CONN_ATTRS_LIST.NAME}="${name}"\n` +
    `${t}${CONN_ATTRS_LIST.TYPE}="${CONN_TYPE_VALUES.MONGODB}"\n` +
    `${t}${CONN_ATTRS_LIST.HOST}="${host}"\n` +
    `${t}${CONN_ATTRS_LIST.PORT}="${port}"\n` +
    `${t}${CONN_ATTRS_LIST.USER}="${user}"\n` +
    `${t}${CONN_ATTRS_LIST.PASSWORD}="${password}"\n` +
    `${t}${CONN_ATTRS_LIST.SCHEMA}="${schema}"\n` +
    `${t}${CONN_ATTRS_LIST.SSL}="${ssl ? "true" : "false"}"\n` +
    `</${HDML_TAG_NAMES.CONNECTION}>\n`;

  return html;
}

export function getSnowflakeHTML(
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
  const html =
    `<${HDML_TAG_NAMES.CONNECTION}\n${t}` +
    `${CONN_ATTRS_LIST.NAME}="${name}"\n` +
    `${t}${CONN_ATTRS_LIST.TYPE}="${CONN_TYPE_VALUES.SNOWFLAKE}"\n` +
    `${t}${CONN_ATTRS_LIST.ACCOUNT}="${account}"\n` +
    `${t}${CONN_ATTRS_LIST.WAREHOUSE}="${warehouse}"\n` +
    `${t}${CONN_ATTRS_LIST.DATABASE}="${database}"\n` +
    `${t}${CONN_ATTRS_LIST.USER}="${user}"\n` +
    `${t}${CONN_ATTRS_LIST.PASSWORD}="${password}"\n` +
    `${t}${CONN_ATTRS_LIST.ROLE}="${role}"\n` +
    `</${HDML_TAG_NAMES.CONNECTION}>\n`;

  return html;
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IConnection, ConnectorTypes } from "@hdml/schemas";
import { Token } from "parse5";
import { CONN_ATTRS_LIST } from "../enums/CONN_ATTRS_LIST";
import { CONN_TYPE_VALUES } from "../enums/CONN_TYPE_VALUES";

export function getConnectionData(
  attrs: Token.Attribute[],
): null | IConnection {
  let name: null | string = null;
  let type: null | string = null;
  let meta: null | string = null;
  let ssl: null | string = null;
  let host: null | string = null;
  let port: null | string = null;
  let user: null | string = null;
  let password: null | string = null;
  let projectId: null | string = null;
  let credentialsKey: null | string = null;
  let sheetId: null | string = null;
  let region: null | string = null;
  let accessKey: null | string = null;
  let secretKey: null | string = null;
  let schema: null | string = null;
  let account: null | string = null;
  let database: null | string = null;
  let role: null | string = null;
  let warehouse: null | string = null;

  attrs.forEach((attr) => {
    switch (attr.name as CONN_ATTRS_LIST) {
      case CONN_ATTRS_LIST.ACCESS_KEY:
        accessKey = attr.value;
        break;
      case CONN_ATTRS_LIST.CREDENTIALS_KEY:
        credentialsKey = attr.value;
        break;
      case CONN_ATTRS_LIST.HOST:
        host = attr.value;
        break;
      case CONN_ATTRS_LIST.PORT:
        port = attr.value;
        break;
      case CONN_ATTRS_LIST.META:
        meta = attr.value;
        break;
      case CONN_ATTRS_LIST.NAME:
        name = attr.value;
        break;
      case CONN_ATTRS_LIST.PASSWORD:
        password = attr.value;
        break;
      case CONN_ATTRS_LIST.PROJECT_ID:
        projectId = attr.value;
        break;
      case CONN_ATTRS_LIST.REGION:
        region = attr.value;
        break;
      case CONN_ATTRS_LIST.SCHEMA:
        schema = attr.value;
        break;
      case CONN_ATTRS_LIST.SECRET_KEY:
        secretKey = attr.value;
        break;
      case CONN_ATTRS_LIST.SHEET_ID:
        sheetId = attr.value;
        break;
      case CONN_ATTRS_LIST.SSL:
        ssl = attr.value;
        break;
      case CONN_ATTRS_LIST.TYPE:
        type = attr.value;
        break;
      case CONN_ATTRS_LIST.USER:
        user = attr.value;
        break;
      case CONN_ATTRS_LIST.ACCOUNT:
        account = attr.value;
        break;
      case CONN_ATTRS_LIST.DATABASE:
        database = attr.value;
        break;
      case CONN_ATTRS_LIST.ROLE:
        role = attr.value;
        break;
      case CONN_ATTRS_LIST.WAREHOUSE:
        warehouse = attr.value;
        break;
    }
  });

  if (!type || !name) {
    return null;
  }

  switch (type as CONN_TYPE_VALUES) {
    case CONN_TYPE_VALUES.POSTGRES:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.Postgres,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.MYSQL:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.MySQL,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.MSSQL:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.MsSQL,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.MARIADB:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.MariaDB,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.ORACLE:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.Oracle,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.CLICKHOUSE:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.Clickhouse,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.DRUID:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.Druid,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.IGNITE:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.Ignite,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.REDSHIFT:
      return getJdbcConnection(
        name,
        meta,
        ConnectorTypes.Redshift,
        host,
        user,
        password,
        ssl,
      );
    case CONN_TYPE_VALUES.BIGQUERY:
      return getBigQueryConnection(
        name,
        meta,
        ConnectorTypes.BigQuery,
        projectId,
        credentialsKey,
      );
    case CONN_TYPE_VALUES.GOOGLESHEETS:
      return getGoogleSheetsConnection(
        name,
        meta,
        ConnectorTypes.GoogleSheets,
        credentialsKey,
        sheetId,
      );
    case CONN_TYPE_VALUES.ELASTICSEARCH:
      return getElasticSearchConnection(
        name,
        meta,
        ConnectorTypes.ElasticSearch,
        host,
        port,
        user,
        password,
        ssl,
        region,
        accessKey,
        secretKey,
      );
    case CONN_TYPE_VALUES.MONGODB:
      return getMongoDbConnection(
        name,
        meta,
        ConnectorTypes.MongoDB,
        host,
        port,
        user,
        password,
        ssl,
        schema,
      );
    case CONN_TYPE_VALUES.SNOWFLAKE:
      return getSnowflakeConnection(
        name,
        meta,
        ConnectorTypes.Snowflake,
        account,
        user,
        password,
        database,
        role,
        warehouse,
      );
    default:
      return null;
  }
}

function getJdbcConnection(
  name: string,
  meta: null | string,
  type:
    | ConnectorTypes.Postgres
    | ConnectorTypes.MySQL
    | ConnectorTypes.MsSQL
    | ConnectorTypes.Oracle
    | ConnectorTypes.Clickhouse
    | ConnectorTypes.Druid
    | ConnectorTypes.Ignite
    | ConnectorTypes.Redshift
    | ConnectorTypes.MariaDB,
  host: null | string,
  user: null | string,
  password: null | string,
  ssl: null | string,
): null | IConnection {
  if (!host || !user || !password) {
    return null;
  }
  return {
    name,
    meta: meta || "",
    options: {
      connector: type,
      parameters: {
        host,
        user,
        password,
        ssl: ssl === "true" ? true : false,
      },
    },
  };
}

function getBigQueryConnection(
  name: string,
  meta: null | string,
  type: ConnectorTypes.BigQuery,
  projectId: null | string,
  credentialsKey: null | string,
): null | IConnection {
  if (!projectId || !credentialsKey) {
    return null;
  }

  return {
    name,
    meta: meta || "",
    options: {
      connector: type,
      parameters: {
        project_id: projectId,
        credentials_key: credentialsKey,
      },
    },
  };
}

function getGoogleSheetsConnection(
  name: string,
  meta: null | string,
  type: ConnectorTypes.GoogleSheets,
  credentialsKey: null | string,
  sheetId: null | string,
): null | IConnection {
  if (!sheetId || !credentialsKey) {
    return null;
  }

  return {
    name,
    meta: meta || "",
    options: {
      connector: type,
      parameters: {
        credentials_key: credentialsKey,
        sheet_id: sheetId,
      },
    },
  };
}

function getElasticSearchConnection(
  name: string,
  meta: null | string,
  type: ConnectorTypes.ElasticSearch,
  host: null | string,
  port: null | string,
  user: null | string,
  password: null | string,
  ssl: null | string,
  region: null | string,
  accessKey: null | string,
  secretKey: null | string,
): null | IConnection {
  if (!host) {
    return null;
  }

  if (
    (region || accessKey || secretKey) &&
    (!region || !accessKey || !secretKey)
  ) {
    return null;
  }

  return {
    name,
    meta: meta || "",
    options: {
      connector: type,
      parameters: {
        host,
        port: port ? Number(port) : 9200,
        user,
        password,
        ssl: ssl === "true" ? true : false,
        region,
        access_key: accessKey,
        secret_key: secretKey,
      },
    },
  };
}

function getMongoDbConnection(
  name: string,
  meta: null | string,
  type: ConnectorTypes.MongoDB,
  host: null | string,
  port: null | string,
  user: null | string,
  password: null | string,
  ssl: null | string,
  schema: null | string,
): null | IConnection {
  if (!host || !user || !password || !schema) {
    return null;
  }

  return {
    name,
    meta: meta || "",
    options: {
      connector: type,
      parameters: {
        host,
        port: port ? Number(port) : 27017,
        user,
        password,
        ssl: ssl === "true" ? true : false,
        schema,
      },
    },
  };
}

function getSnowflakeConnection(
  name: string,
  meta: null | string,
  type: ConnectorTypes.Snowflake,
  account: null | string,
  user: null | string,
  password: null | string,
  database: null | string,
  role: null | string,
  warehouse: null | string,
): null | IConnection {
  if (
    !account ||
    !user ||
    !password ||
    !database ||
    !role ||
    !warehouse
  ) {
    return null;
  }

  return {
    name,
    meta: meta || "",
    options: {
      connector: type,
      parameters: {
        account,
        user,
        password,
        database,
        role,
        warehouse,
      },
    },
  };
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ConnectorTypesEnum } from "@hdml/schemas";
import {
  Connection,
  CONN_ATTRS_LIST,
  CONN_TYPE_VALUES,
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { Token } from "parse5";
import { DiagnosticSink, pushDiagnostic } from "../diagnostics";

/**
 * The wire enum back to the spelling an author actually wrote.
 * A diagnostic has to name the connector the way it appears in the
 * document, and by the time a credential guard fails the raw
 * `type` attribute is three stack frames away -- only the
 * {@link ConnectorTypesEnum} is in hand.
 *
 * ★ Typed as a total `Record` on purpose: adding a connector to
 * `ConnectorTypesEnum` without adding its spelling here is a
 * compile error, not a diagnostic that says `undefined`.
 */
const CONNECTOR_SPELLINGS: Record<ConnectorTypesEnum, string> = {
  [ConnectorTypesEnum.Postgres]: CONN_TYPE_VALUES.POSTGRES,
  [ConnectorTypesEnum.MySQL]: CONN_TYPE_VALUES.MYSQL,
  [ConnectorTypesEnum.MsSQL]: CONN_TYPE_VALUES.MSSQL,
  [ConnectorTypesEnum.MariaDB]: CONN_TYPE_VALUES.MARIADB,
  [ConnectorTypesEnum.Oracle]: CONN_TYPE_VALUES.ORACLE,
  [ConnectorTypesEnum.Clickhouse]: CONN_TYPE_VALUES.CLICKHOUSE,
  [ConnectorTypesEnum.Druid]: CONN_TYPE_VALUES.DRUID,
  [ConnectorTypesEnum.Ignite]: CONN_TYPE_VALUES.IGNITE,
  [ConnectorTypesEnum.Redshift]: CONN_TYPE_VALUES.REDSHIFT,
  [ConnectorTypesEnum.BigQuery]: CONN_TYPE_VALUES.BIGQUERY,
  [ConnectorTypesEnum.GoogleSheets]: CONN_TYPE_VALUES.GOOGLESHEETS,
  [ConnectorTypesEnum.ElasticSearch]: CONN_TYPE_VALUES.ELASTICSEARCH,
  [ConnectorTypesEnum.MongoDB]: CONN_TYPE_VALUES.MONGODB,
  [ConnectorTypesEnum.Snowflake]: CONN_TYPE_VALUES.SNOWFLAKE,
};

/**
 * The `missing-connector-credentials` message. Six of the seven
 * credential guards are all-or-nothing, so each names its
 * connector, everything that connector requires, and which of
 * those the author left out. ★ The seventh -- ElasticSearch's AWS
 * triple -- does NOT use this: see the comment at its guard.
 *
 * @param connector The connector as the author spelled it.
 * @param required Everything this connector requires.
 * @param missing The subset the author left out.
 *
 * @returns The author-facing message (contract, §2.4).
 */
function credentialsMessage(
  connector: string,
  required: string,
  missing: string[],
): string {
  return (
    `\`<hdml-connection type="${connector}">\` needs ` +
    `${required}; missing: ${missing.join(", ")}. ` +
    "This one was dropped."
  );
}

/**
 * Reads an `<hdml-connection>`'s attributes into a
 * {@link Connection}, or returns `null` when the element must be
 * dropped.
 *
 * Nine rejection paths over three codes, spread across this
 * function and the six connector-shape helpers below it.
 *
 * @param attrs The element's attributes.
 * @param sink The parse's diagnostics sink. **Optional**: the
 * module-singleton adapter and the existing unit cases call this
 * with one argument, and an absent sink discards.
 *
 * @returns The connection, or `null`.
 */
export function getConnectionData(
  attrs: Token.Attribute[],
  sink?: DiagnosticSink,
): null | Connection {
  let name: null | string = null;
  let type: null | string = null;
  let description: null | string = null;
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
      case CONN_ATTRS_LIST.DESCRIPTION:
        description = attr.value;
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
    // The diagnostic does NOT change the `return null`: 019
    // carries diagnostics, it does not change accept/reject
    // (RFC 019/002 §10.2, D11).
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTION_ATTRS,
      "`<hdml-connection>` needs `name` and `type`; this one " +
        "was dropped.",
    );
    return null;
  }

  // ★ Captured BEFORE the switch, and this is not defensive
  // style. `switch (type as CONN_TYPE_VALUES)` narrows `type`
  // ITSELF, and because the 14 cases below exhaust the enum
  // TypeScript narrows it to `never` in `default:` -- so the one
  // branch whose whole job is to name the connector the author
  // wrote cannot read it (measured: an
  // `@typescript-eslint/restrict-template-expressions` error,
  // "Invalid type never of template literal expression"). The
  // cast is a lie -- `type` is an arbitrary attribute value and
  // `default:` is exactly the branch that proves it -- and this
  // `const` keeps the truth the cast throws away.
  const authored: string = type;

  switch (type as CONN_TYPE_VALUES) {
    case CONN_TYPE_VALUES.POSTGRES:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.Postgres,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.MYSQL:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.MySQL,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.MSSQL:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.MsSQL,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.MARIADB:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.MariaDB,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.ORACLE:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.Oracle,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.CLICKHOUSE:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.Clickhouse,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.DRUID:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.Druid,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.IGNITE:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.Ignite,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.REDSHIFT:
      return getJdbcConnection(
        name,
        description,
        ConnectorTypesEnum.Redshift,
        host,
        user,
        password,
        ssl,
        sink,
      );
    case CONN_TYPE_VALUES.BIGQUERY:
      return getBigQueryConnection(
        name,
        description,
        ConnectorTypesEnum.BigQuery,
        projectId,
        credentialsKey,
        sink,
      );
    case CONN_TYPE_VALUES.GOOGLESHEETS:
      return getGoogleSheetsConnection(
        name,
        description,
        ConnectorTypesEnum.GoogleSheets,
        credentialsKey,
        sheetId,
        sink,
      );
    case CONN_TYPE_VALUES.ELASTICSEARCH:
      return getElasticSearchConnection(
        name,
        description,
        ConnectorTypesEnum.ElasticSearch,
        host,
        port,
        user,
        password,
        ssl,
        region,
        accessKey,
        secretKey,
        sink,
      );
    case CONN_TYPE_VALUES.MONGODB:
      return getMongoDbConnection(
        name,
        description,
        ConnectorTypesEnum.MongoDB,
        host,
        port,
        user,
        password,
        ssl,
        schema,
        sink,
      );
    case CONN_TYPE_VALUES.SNOWFLAKE:
      return getSnowflakeConnection(
        name,
        description,
        ConnectorTypesEnum.Snowflake,
        account,
        user,
        password,
        database,
        role,
        warehouse,
        sink,
      );
    default: {
      // The diagnostic does NOT change the `return null`: 019
      // carries diagnostics, it does not change accept/reject
      // (RFC 019/002 §10.2, D11). The legal list is DERIVED from
      // `CONN_TYPE_VALUES` so a new connector cannot leave the
      // message stale.
      const legal = Object.values(CONN_TYPE_VALUES)
        .map((v) => `\`${v}\``)
        .join(", ");
      pushDiagnostic(
        sink,
        HDQL_DIAGNOSTIC_CODES.UNKNOWN_CONNECTOR,
        `\`<hdml-connection type="${authored}">\` is not a ` +
          `connector HDML knows; legal values are ${legal}. ` +
          "This one was dropped.",
      );
      return null;
    }
  }
}

function getJdbcConnection(
  name: string,
  description: null | string,
  type:
    | ConnectorTypesEnum.Postgres
    | ConnectorTypesEnum.MySQL
    | ConnectorTypesEnum.MsSQL
    | ConnectorTypesEnum.Oracle
    | ConnectorTypesEnum.Clickhouse
    | ConnectorTypesEnum.Druid
    | ConnectorTypesEnum.Ignite
    | ConnectorTypesEnum.Redshift
    | ConnectorTypesEnum.MariaDB,
  host: null | string,
  user: null | string,
  password: null | string,
  ssl: null | string,
  sink?: DiagnosticSink,
): null | Connection {
  if (!host || !user || !password) {
    // The diagnostic does NOT change the `return null`
    // (RFC 019/002 §10.2, D11). ★ This one helper serves NINE
    // connectors, so the message reads its spelling out of
    // `CONNECTOR_SPELLINGS` rather than hard-coding one.
    const missing: string[] = [];
    if (!host) {
      missing.push("`host`");
    }
    if (!user) {
      missing.push("`user`");
    }
    if (!password) {
      missing.push("`password`");
    }
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
      credentialsMessage(
        CONNECTOR_SPELLINGS[type],
        "`host`, `user` and `password`",
        missing,
      ),
    );
    return null;
  }
  return {
    name,
    description,
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
  description: null | string,
  type: ConnectorTypesEnum.BigQuery,
  projectId: null | string,
  credentialsKey: null | string,
  sink?: DiagnosticSink,
): null | Connection {
  if (!projectId || !credentialsKey) {
    // The diagnostic does NOT change the `return null`
    // (RFC 019/002 §10.2, D11).
    const missing: string[] = [];
    if (!projectId) {
      missing.push("`project-id`");
    }
    if (!credentialsKey) {
      missing.push("`credentials-key`");
    }
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
      credentialsMessage(
        CONNECTOR_SPELLINGS[type],
        "`project-id` and `credentials-key`",
        missing,
      ),
    );
    return null;
  }

  return {
    name,
    description,
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
  description: null | string,
  type: ConnectorTypesEnum.GoogleSheets,
  credentialsKey: null | string,
  sheetId: null | string,
  sink?: DiagnosticSink,
): null | Connection {
  if (!sheetId || !credentialsKey) {
    // The diagnostic does NOT change the `return null`
    // (RFC 019/002 §10.2, D11).
    const missing: string[] = [];
    if (!credentialsKey) {
      missing.push("`credentials-key`");
    }
    if (!sheetId) {
      missing.push("`sheet-id`");
    }
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
      credentialsMessage(
        CONNECTOR_SPELLINGS[type],
        "`credentials-key` and `sheet-id`",
        missing,
      ),
    );
    return null;
  }

  return {
    name,
    description,
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
  description: null | string,
  type: ConnectorTypesEnum.ElasticSearch,
  host: null | string,
  port: null | string,
  user: null | string,
  password: null | string,
  ssl: null | string,
  region: null | string,
  accessKey: null | string,
  secretKey: null | string,
  sink?: DiagnosticSink,
): null | Connection {
  if (!host) {
    // The diagnostic does NOT change the `return null`
    // (RFC 019/002 §10.2, D11). One required field, and it is the
    // one that is missing, so there is nothing to enumerate.
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
      '`<hdml-connection type="elasticsearch">` needs `host`; ' +
        "this one was dropped.",
    );
    return null;
  }

  if (
    (region || accessKey || secretKey) &&
    (!region || !accessKey || !secretKey)
  ) {
    // ★ The ONE guard of the seven where the author supplied SOME
    // of what is required, and the reason the messages name
    // fields at all (RFC 019/002 §10.3). "AWS credentials are
    // missing" is useless here -- the author wrote one or two of
    // the three. So this message names ONLY what is absent, and
    // deliberately does not restate the full triple: an author
    // who supplied `region` must not be told `region` is a
    // problem.
    //
    // The diagnostic does NOT change the `return null`
    // (RFC 019/002 §10.2, D11).
    const missing: string[] = [];
    if (!region) {
      missing.push("`region`");
    }
    if (!accessKey) {
      missing.push("`access-key`");
    }
    if (!secretKey) {
      missing.push("`secret-key`");
    }
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
      '`<hdml-connection type="elasticsearch">` supplies some ' +
        "AWS credentials but not all; missing: " +
        missing.join(", ") +
        ". This one was dropped.",
    );
    return null;
  }

  return {
    name,
    description,
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
  description: null | string,
  type: ConnectorTypesEnum.MongoDB,
  host: null | string,
  port: null | string,
  user: null | string,
  password: null | string,
  ssl: null | string,
  schema: null | string,
  sink?: DiagnosticSink,
): null | Connection {
  if (!host || !user || !password || !schema) {
    // The diagnostic does NOT change the `return null`
    // (RFC 019/002 §10.2, D11).
    const missing: string[] = [];
    if (!host) {
      missing.push("`host`");
    }
    if (!user) {
      missing.push("`user`");
    }
    if (!password) {
      missing.push("`password`");
    }
    if (!schema) {
      missing.push("`schema`");
    }
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
      credentialsMessage(
        CONNECTOR_SPELLINGS[type],
        "`host`, `user`, `password` and `schema`",
        missing,
      ),
    );
    return null;
  }

  return {
    name,
    description,
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
  description: null | string,
  type: ConnectorTypesEnum.Snowflake,
  account: null | string,
  user: null | string,
  password: null | string,
  database: null | string,
  role: null | string,
  warehouse: null | string,
  sink?: DiagnosticSink,
): null | Connection {
  if (
    !account ||
    !user ||
    !password ||
    !database ||
    !role ||
    !warehouse
  ) {
    // The diagnostic does NOT change the `return null`
    // (RFC 019/002 §10.2, D11).
    const missing: string[] = [];
    if (!account) {
      missing.push("`account`");
    }
    if (!user) {
      missing.push("`user`");
    }
    if (!password) {
      missing.push("`password`");
    }
    if (!database) {
      missing.push("`database`");
    }
    if (!role) {
      missing.push("`role`");
    }
    if (!warehouse) {
      missing.push("`warehouse`");
    }
    pushDiagnostic(
      sink,
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
      credentialsMessage(
        CONNECTOR_SPELLINGS[type],
        "`account`, `user`, `password`, `database`, `role` and " +
          "`warehouse`",
        missing,
      ),
    );
    return null;
  }

  return {
    name,
    description,
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

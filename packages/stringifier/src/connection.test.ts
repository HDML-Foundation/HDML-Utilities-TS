/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDOM, ConnectionOptions } from "@hdml/types";
import { ConnectorTypesEnum } from "@hdml/schemas";
import { serialize, structurize } from "@hdml/buffer";
import { getConnectionSQLs, getConnectionHTML } from "./connection";

describe("The `getConnectionSQLs` and `getConnectionHTML` functions", () => {
  it("should stringify unnamed connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Postgres,
            parameters: {
              host: "",
              user: "",
              password: "",
              ssl: false,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([]);
    expect(html).toBe("");
  });

  it("should throw with unconfigured connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {} as ConnectionOptions,
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;

    // TODO (buntarb): how to replace this without throwing?
    expect(() => getConnectionSQLs(conn)).toThrow();
    expect(() => getConnectionHTML(conn)).toThrow();
  });

  it("should stringify empty JDBC connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Postgres,
            parameters: {
              host: "",
              user: "",
              password: "",
              ssl: false,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using postgresql\nwith (\n  \"connection-url\" = ''\n  \"connection-user\" = ''\n  \"connection-password\" = ''\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="postgresql"\n  host=""\n  ssl="false"\n  user=""\n  password=""\n</hdml-connection>\n',
    );
  });

  it("should stringify Postgres connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Postgres,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using postgresql\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="postgresql"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify MySQL connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.MySQL,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using mysql\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="mysql"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify MsSQL connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.MsSQL,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using mssql\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="mssql"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify Oracle connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Oracle,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using oracle\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="oracle"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify Clickhouse connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Clickhouse,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using clickhouse\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="clickhouse"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify Druid connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Druid,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using druid\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="druid"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify Ignite connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Ignite,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using ignite\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="ignite"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify Redshift connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Redshift,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using redshift\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="redshift"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify MariaDB connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.MariaDB,
            parameters: {
              host: "host",
              user: "user",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using mariadb\nwith (\n  \"connection-url\" = 'host?ssl=true'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="mariadb"\n  host="host"\n  ssl="true"\n  user="user"\n  password="password"\n</hdml-connection>\n',
    );
  });

  it("should stringify empty BigQuery connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.BigQuery,
            parameters: {
              project_id: "",
              credentials_key: "",
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using bigquery\nwith (\n  \"project-id\" = ''\n  \"credentials-key\" = ''\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="bigquery"\n  project-id=""\n  credentials-key=""\n</hdml-connection>\n',
    );
  });

  it("should stringify BigQuery connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.BigQuery,
            parameters: {
              project_id: "project_id",
              credentials_key: "credentials_key",
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using bigquery\nwith (\n  \"project-id\" = 'project_id'\n  \"credentials-key\" = 'credentials_key'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="bigquery"\n  project-id="project_id"\n  credentials-key="credentials_key"\n</hdml-connection>\n',
    );
  });

  it("should stringify empty GoogleSheets connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.GoogleSheets,
            parameters: {
              sheet_id: "",
              credentials_key: "",
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using googlesheets\nwith (\n  \"gsheets.metadata-sheet-id\" = ''\n  \"gsheets.credentials-key\" = ''\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="googlesheets"\n  sheet-id=""\n  credentials-key=""\n</hdml-connection>\n',
    );
  });

  it("should stringify GoogleSheets connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.GoogleSheets,
            parameters: {
              sheet_id: "sheet_id",
              credentials_key: "credentials_key",
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using googlesheets\nwith (\n  \"gsheets.metadata-sheet-id\" = 'sheet_id'\n  \"gsheets.credentials-key\" = 'credentials_key'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="googlesheets"\n  sheet-id="sheet_id"\n  credentials-key="credentials_key"\n</hdml-connection>\n',
    );
  });

  it("should stringify empty ElasticSearch connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.ElasticSearch,
            parameters: {
              host: "",
              port: 0,
              user: "",
              password: "",
              region: "",
              access_key: "",
              secret_key: "",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using elasticsearch\nwith (\n  \"elasticsearch.host\" = ''\n  \"elasticsearch.port\" = '0'\n  \"elasticsearch.auth.user\" = ''\n  \"elasticsearch.auth.password\" = ''\n  \"elasticsearch.aws.region\" = ''\n  \"elasticsearch.aws.access-key\" = ''\n  \"elasticsearch.aws.secret-key\" = ''\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="elasticsearch"\n  host=""\n  port="0"\n  user=""\n  password=""\n  region=""\n  access-key=""\n  secret-key=""\n</hdml-connection>\n',
    );
  });

  it("should stringify ElasticSearch connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.ElasticSearch,
            parameters: {
              host: "host",
              port: 9200,
              user: "user",
              password: "password",
              region: "region",
              access_key: "access_key",
              secret_key: "secret_key",
              ssl: false,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using elasticsearch\nwith (\n  \"elasticsearch.host\" = 'host'\n  \"elasticsearch.port\" = '9200'\n  \"elasticsearch.auth.user\" = 'user'\n  \"elasticsearch.auth.password\" = 'password'\n  \"elasticsearch.aws.region\" = 'region'\n  \"elasticsearch.aws.access-key\" = 'access_key'\n  \"elasticsearch.aws.secret-key\" = 'secret_key'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="elasticsearch"\n  host="host"\n  port="9200"\n  user="user"\n  password="password"\n  region="region"\n  access-key="access_key"\n  secret-key="secret_key"\n</hdml-connection>\n',
    );
  });

  it("should stringify empty MongoDB connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.MongoDB,
            parameters: {
              host: "",
              port: 0,
              user: "",
              password: "",
              schema: "",
              ssl: false,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using mongodb\nwith (\n  \"mongodb.connection-url\" = 'mongodb://:@:0/'\n  \"mongodb.schema-collection\" = ''\n  \"mongodb.tls.enabled\" = 'false'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="mongodb"\n  host=""\n  port="0"\n  user=""\n  password=""\n  schema=""\n  ssl="false"\n</hdml-connection>\n',
    );
  });

  it("should stringify MongoDB connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.MongoDB,
            parameters: {
              host: "host",
              port: 27017,
              user: "user",
              password: "password",
              schema: "schema",
              ssl: true,
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using mongodb\nwith (\n  \"mongodb.connection-url\" = 'mongodb://user:password@host:27017/'\n  \"mongodb.schema-collection\" = 'schema'\n  \"mongodb.tls.enabled\" = 'true'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="mongodb"\n  host="host"\n  port="27017"\n  user="user"\n  password="password"\n  schema="schema"\n  ssl="true"\n</hdml-connection>\n',
    );
  });

  it("should stringify empty Snowflake connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Snowflake,
            parameters: {
              account: "",
              warehouse: "",
              database: "",
              user: "",
              password: "",
              role: "",
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using snowflake\nwith (\n  \"connection-url\" = 'jdbc:snowflake://.snowflakecomputing.com'\n  \"connection-user\" = ''\n  \"connection-password\" = ''\n  \"snowflake.account\" = ''\n  \"snowflake.database\" = ''\n  \"snowflake.role\" = ''\n  \"snowflake.warehouse\" = ''\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="snowflake"\n  account=""\n  warehouse=""\n  database=""\n  user=""\n  password=""\n  role=""\n</hdml-connection>\n',
    );
  });

  it("should stringify Snowflake connection", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [
        {
          name: "name",
          description: null,
          options: {
            connector: ConnectorTypesEnum.Snowflake,
            parameters: {
              account: "account",
              warehouse: "warehouse",
              database: "database",
              user: "user",
              password: "password",
              role: "role",
            },
          },
        },
      ],
      models: [],
      frames: [],
    };
    const buf = serialize(hdom);
    const struct = structurize(buf);
    const conn = struct.connections(0)!;
    const sqls = getConnectionSQLs(conn);
    const html = getConnectionHTML(conn);

    expect(sqls).toEqual([
      "show catalogs like 'name'",
      "drop catalog name",
      "create catalog name using snowflake\nwith (\n  \"connection-url\" = 'jdbc:snowflake://account.snowflakecomputing.com'\n  \"connection-user\" = 'user'\n  \"connection-password\" = 'password'\n  \"snowflake.account\" = 'account'\n  \"snowflake.database\" = 'database'\n  \"snowflake.role\" = 'role'\n  \"snowflake.warehouse\" = 'warehouse'\n)\n",
    ]);
    expect(html).toBe(
      '<hdml-connection\n  name="name"\n  type="snowflake"\n  account="account"\n  warehouse="warehouse"\n  database="database"\n  user="user"\n  password="password"\n  role="role"\n</hdml-connection>\n',
    );
  });
});

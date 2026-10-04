/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { ConnectorTypesEnum } from "@hdml/schemas";
import {
  Connection,
  JDBCParameters,
  BigQueryParameters,
  GoogleSheetsParameters,
  ElasticsearchParameters,
  MongoDBParameters,
  SnowflakeParameters,
  CONN_ATTRS_LIST,
  CONN_TYPE_VALUES,
  HDQL_DIAGNOSTIC_CODES,
} from "@hdml/types";
import { getConnectionData } from "./getConnectionData";
import { DiagnosticSink } from "../diagnostics";

describe("The `getConnectionData` function", () => {
  // Common
  it("shoud return `null` if empty attributes passed", () => {
    expect(getConnectionData([])).toBeNull();
  });

  it("shoud return `null` if incorrect attributes passed", () => {
    expect(getConnectionData([{ name: "a", value: "b" }])).toBeNull();
  });

  it("shoud return `null` if incorrect `type` attribute passed", () => {
    expect(
      getConnectionData([
        { name: CONN_ATTRS_LIST.NAME, value: "name" },
        { name: CONN_ATTRS_LIST.TYPE, value: "type" },
      ]),
    ).toBeNull();
  });

  it("shoud return `null` if `type` attribute is missing", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `name` attribute is missing", () => {
    const connection = getConnectionData([
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  // JDBC
  it("shoud return `null` if `host` attribute is missing for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `user` attribute is missing for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `password` attribute is missing for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return valid `ssl` property if correct `ssl` attributes is missed for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgresql" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pg");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Postgres,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeFalsy();
  });

  it("shoud return valid `ssl` property if correct `ssl` attributes is equal to `false` for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgresql" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "false" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pg");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Postgres,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeFalsy();
  });

  it("shoud return valid `ssl` property if correct `ssl` attributes is equal to `true` for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgresql" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pg");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Postgres,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // PostgreSQL
  it("shoud return `Connection` object if correct `postgres` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgresql" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pg");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Postgres,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // MySQL
  it("shoud return `Connection` object if correct `mysql` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "my" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "mysql" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("my");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.MySQL,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // MsSQL
  it("shoud return `Connection` object if correct `mssql` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "ms" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "mssql" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("ms");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.MsSQL,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Oracle
  it("shoud return `Connection` object if correct `oracle` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pl" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "oracle" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pl");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Oracle,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // ClickHouse
  it("shoud return `Connection` object if correct `clickhouse` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "ch" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "clickhouse" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("ch");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Clickhouse,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Druid
  it("shoud return `Connection` object if correct `druid` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "dr" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "druid" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("dr");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Druid,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Ignite
  it("shoud return `Connection` object if correct `ignite` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "ig" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "ignite" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("ig");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Ignite,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Redshift
  it("shoud return `Connection` object if correct `redshift` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "rs" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "redshift" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("rs");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Redshift,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // MariaDB
  it("shoud return `Connection` object if correct `mariadb` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "ma" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "mariadb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("ma");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.MariaDB,
    );

    const params = <JDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Google BigQuery
  it("shoud return `null` if correct `project-id` attribute is missed for `bigquery` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "bg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "bigquery" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if correct `credentials-key` attribute is missed for `bigquery` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "bg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "bigquery" },
      { name: CONN_ATTRS_LIST.PROJECT_ID, value: "id" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `Connection` object if correct `bigquery` attributes passed", () => {
    // with description
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "bg" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "bigquery" },
      { name: CONN_ATTRS_LIST.PROJECT_ID, value: "id" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("bg");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.BigQuery,
    );

    let params = <BigQueryParameters>connection.options.parameters;
    expect(params.credentials_key).toBe("key");
    expect(params.project_id).toBe("id");

    // wo description
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "bg" },
      { name: CONN_ATTRS_LIST.TYPE, value: "bigquery" },
      { name: CONN_ATTRS_LIST.PROJECT_ID, value: "id" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("bg");
    expect(connection.description).toBe(null);
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.BigQuery,
    );

    params = <BigQueryParameters>connection.options.parameters;
    expect(params.credentials_key).toBe("key");
    expect(params.project_id).toBe("id");
  });

  // Google Sheet
  it("shoud return `null` if correct `sheet-id` attribute is missed for `googlesheets` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "gs" },
      { name: CONN_ATTRS_LIST.DESCRIPTION, value: "" },
      { name: CONN_ATTRS_LIST.TYPE, value: "googlesheets" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if correct `credentials-key` attribute is missed for `googlesheets` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "gs" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "googlesheets" },
      { name: CONN_ATTRS_LIST.SHEET_ID, value: "id" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `Connection` object if correct `googlesheets` attributes passed", () => {
    // with description
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "gs" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "googlesheets" },
      { name: CONN_ATTRS_LIST.SHEET_ID, value: "id" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("gs");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.GoogleSheets,
    );

    let params = <GoogleSheetsParameters>(
      connection.options.parameters
    );
    expect(params.credentials_key).toBe("key");
    expect(params.sheet_id).toBe("id");

    // wo description
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "gs" },
      { name: CONN_ATTRS_LIST.TYPE, value: "googlesheets" },
      { name: CONN_ATTRS_LIST.SHEET_ID, value: "id" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("gs");
    expect(connection.description).toBe(null);
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.GoogleSheets,
    );

    params = <GoogleSheetsParameters>connection.options.parameters;
    expect(params.credentials_key).toBe("key");
    expect(params.sheet_id).toBe("id");
  });

  // Elastic
  it("shoud return `null` if `host` attribute is missed for `elasticsearch` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if AWS attributes are incorrect for `elasticsearch` connector", () => {
    // no region
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as Connection;

    expect(connection).toBeNull();

    // no access key
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as Connection;

    expect(connection).toBeNull();

    // no secret key
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
    ]) as Connection;

    expect(connection).toBeNull();

    // secret key only
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `Connection` object if correct `elasticsearch` attributes are passed", () => {
    // with description, port and ssl
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("es");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.ElasticSearch,
    );

    let params = <ElasticsearchParameters>(
      connection.options.parameters
    );
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(1000);
    expect(params.ssl).toBe(true);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.region).toBe("region");
    expect(params.access_key).toBe("key");
    expect(params.secret_key).toBe("key");

    // wo description, port and ssl
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("es");
    expect(connection.description).toBe(null);
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.ElasticSearch,
    );

    params = <ElasticsearchParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(9200);
    expect(params.ssl).toBe(false);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.region).toBe("region");
    expect(params.access_key).toBe("key");
    expect(params.secret_key).toBe("key");

    // wo description, port and ssl equal to false
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.SSL, value: "false" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("es");
    expect(connection.description).toBe(null);
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.ElasticSearch,
    );

    params = <ElasticsearchParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(9200);
    expect(params.ssl).toBe(false);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.region).toBe("region");
    expect(params.access_key).toBe("key");
    expect(params.secret_key).toBe("key");
  });

  // MongoDB
  it("shoud return `null` if `host` attribute is missed for `mongodb` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `user` attribute is missed for `mongodb` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `password` attribute is missed for `mongodb` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `schema` attribute is missed for `mongodb` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `Connection` object if correct `mongodb` attributes are passed", () => {
    // with description, port and ssl
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("mn");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.MongoDB,
    );

    let params = <MongoDBParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(1000);
    expect(params.ssl).toBe(true);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.schema).toBe("schema");

    // wo description, port and ssl
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("mn");
    expect(connection.description).toBe(null);
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.MongoDB,
    );

    params = <MongoDBParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(27017);
    expect(params.ssl).toBe(false);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.schema).toBe("schema");

    // with empty description, port and ssl equal to false
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      { name: CONN_ATTRS_LIST.DESCRIPTION, value: "" },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "false" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("mn");
    expect(connection.description).toBe("");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.MongoDB,
    );

    params = <MongoDBParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(1000);
    expect(params.ssl).toBe(false);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.schema).toBe("schema");
  });

  // Snowflake
  it("shoud return `null` if `account` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `user` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `password` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `role` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `warehouse` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
    ]) as Connection;

    expect(connection).toBeNull();
  });

  it("shoud return `Connection` object if correct `snowflake` attributes are passed", () => {
    // with description
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      {
        name: CONN_ATTRS_LIST.DESCRIPTION,
        value: "Some description data.",
      },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("sn");
    expect(connection.description).toBe("Some description data.");
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Snowflake,
    );

    let params = <SnowflakeParameters>connection.options.parameters;
    expect(params.account).toBe("account");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.role).toBe("role");
    expect(params.database).toBe("database");
    expect(params.warehouse).toBe("warehouse");

    // wo description
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as Connection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("sn");
    expect(connection.description).toBe(null);
    expect(connection.options.connector).toBe(
      ConnectorTypesEnum.Snowflake,
    );

    params = <SnowflakeParameters>connection.options.parameters;
    expect(params.account).toBe("account");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.role).toBe("role");
    expect(params.database).toBe("database");
    expect(params.warehouse).toBe("warehouse");
  });
});

// ---------------------------------------------------------------
// 019 step 10 -- nine drop sites, three codes, SEVEN functions.
//
// Six of the nine live in module-local connector-shape helpers
// that the switch above reaches one per `type`, so these cases go
// through the exported `getConnectionData` rather than calling a
// helper directly: that is the only public way in.
// ---------------------------------------------------------------

/** `{name: value}` to the `Token.Attribute[]` the helper takes. */
function attrs(o: Record<string, string>): {
  name: string;
  value: string;
}[] {
  return Object.entries(o).map(([name, value]) => ({
    name,
    value,
  }));
}

/** The one diagnostic a dropped connection produced. */
function dropped(o: Record<string, string>): {
  code: HDQL_DIAGNOSTIC_CODES;
  severity: "error";
  message: string;
} {
  const sink: DiagnosticSink = [];
  expect(getConnectionData(attrs(o), sink)).toBeNull();
  expect(sink.length).toBe(1);
  return {
    code: sink[0].code,
    severity: sink[0].severity,
    message: sink[0].message,
  };
}

describe("The `getConnectionData` diagnostic", () => {
  it("reports an absent `name` or `type`", () => {
    const d = dropped({ [CONN_ATTRS_LIST.NAME]: "c" });

    expect(d.code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTION_ATTRS,
    );
    expect(d.severity).toBe("error");
    expect(d.message).toBe(
      "`<hdml-connection>` needs `name` and `type`; this one was dropped.",
    );
  });

  it("names the value and the legal connectors", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: "postgres",
    });

    expect(d.code).toBe(HDQL_DIAGNOSTIC_CODES.UNKNOWN_CONNECTOR);
    // ★ `postgres` is the near-miss an author actually writes;
    // the legal spelling is `postgresql`. A message that did not
    // echo the value could not show the difference.
    expect(d.message).toContain('type="postgres"');
    expect(d.message).toContain("`postgresql`");
    // Derived, so a new connector cannot leave the message stale.
    for (const legal of Object.values(CONN_TYPE_VALUES)) {
      expect(d.message).toContain("`" + legal + "`");
    }
  });

  it("names the connector and the missing jdbc fields", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.POSTGRES,
      [CONN_ATTRS_LIST.HOST]: "h",
      [CONN_ATTRS_LIST.USER]: "u",
    });

    expect(d.code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
    );
    expect(d.message).toBe(
      '`<hdml-connection type="postgresql">` needs `host`, `user` and `password`; missing: `password`. This one was dropped.',
    );
  });

  it("spells the jdbc connector the author wrote", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.CLICKHOUSE,
      [CONN_ATTRS_LIST.HOST]: "h",
      [CONN_ATTRS_LIST.USER]: "u",
    });

    // ★ One helper serves NINE connectors. Without the spelling
    // map every one of them would say `postgresql`, or nothing.
    expect(d.message).toContain('type="clickhouse"');
    expect(d.message).not.toContain("postgres");
  });

  it("names the missing bigquery fields", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.BIGQUERY,
      [CONN_ATTRS_LIST.PROJECT_ID]: "p",
    });

    expect(d.code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
    );
    expect(d.message).toBe(
      '`<hdml-connection type="bigquery">` needs `project-id` and `credentials-key`; missing: `credentials-key`. This one was dropped.',
    );
  });

  it("names the missing googlesheets fields", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.GOOGLESHEETS,
      [CONN_ATTRS_LIST.SHEET_ID]: "s",
    });

    expect(d.message).toBe(
      '`<hdml-connection type="googlesheets">` needs `credentials-key` and `sheet-id`; missing: `credentials-key`. This one was dropped.',
    );
  });

  it("reports an elasticsearch with no `host`", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.ELASTICSEARCH,
    });

    expect(d.code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
    );
    expect(d.message).toBe(
      '`<hdml-connection type="elasticsearch">` needs `host`; this one was dropped.',
    );
  });

  it("names the missing mongodb fields", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.MONGODB,
      [CONN_ATTRS_LIST.HOST]: "h",
      [CONN_ATTRS_LIST.USER]: "u",
    });

    expect(d.message).toBe(
      '`<hdml-connection type="mongodb">` needs `host`, `user`, `password` and `schema`; missing: `password`, `schema`. This one was dropped.',
    );
  });

  it("names the missing snowflake fields", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.SNOWFLAKE,
      [CONN_ATTRS_LIST.ACCOUNT]: "a",
      [CONN_ATTRS_LIST.USER]: "u",
    });

    expect(d.message).toBe(
      '`<hdml-connection type="snowflake">` needs `account`, `user`, `password`, `database`, `role` and `warehouse`; missing: `password`, `database`, `role`, `warehouse`. This one was dropped.',
    );
  });

  it("names which AWS credentials are missing", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.ELASTICSEARCH,
      [CONN_ATTRS_LIST.HOST]: "h",
      [CONN_ATTRS_LIST.REGION]: "eu-central-1",
    });

    expect(d.code).toBe(
      HDQL_DIAGNOSTIC_CODES.MISSING_CONNECTOR_CREDENTIALS,
    );
    // ★ The ONE site of the seven where the author supplied SOME
    // of what is required. Asserted as SUBSTRINGS, not as a whole
    // string: the gate is that the message names the two fields
    // that are ABSENT and does not name the one that is PRESENT.
    // A generic "credentials are missing" passes neither clause.
    expect(d.message).toContain("`access-key`");
    expect(d.message).toContain("`secret-key`");
    expect(d.message).not.toContain("region");
  });

  it("mirrors it for the other two of the triple", () => {
    const d = dropped({
      [CONN_ATTRS_LIST.NAME]: "c",
      [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.ELASTICSEARCH,
      [CONN_ATTRS_LIST.HOST]: "h",
      [CONN_ATTRS_LIST.ACCESS_KEY]: "ak",
    });

    expect(d.message).toContain("`region`");
    expect(d.message).toContain("`secret-key`");
    expect(d.message).not.toContain("`access-key`");
  });

  it("says nothing when all three AWS keys are present", () => {
    const sink: DiagnosticSink = [];
    const data = getConnectionData(
      attrs({
        [CONN_ATTRS_LIST.NAME]: "c",
        [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.ELASTICSEARCH,
        [CONN_ATTRS_LIST.HOST]: "h",
        [CONN_ATTRS_LIST.REGION]: "eu-central-1",
        [CONN_ATTRS_LIST.ACCESS_KEY]: "ak",
        [CONN_ATTRS_LIST.SECRET_KEY]: "sk",
      }),
      sink,
    );

    expect(data).not.toBeNull();
    expect(sink.length).toBe(0);
  });

  it("says nothing when none of the three is present", () => {
    const sink: DiagnosticSink = [];
    const data = getConnectionData(
      attrs({
        [CONN_ATTRS_LIST.NAME]: "c",
        [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.ELASTICSEARCH,
        [CONN_ATTRS_LIST.HOST]: "h",
      }),
      sink,
    );

    // ★ The guard is `(a || b || c) && (!a || !b || !c)`, so an
    // empty triple is legal. These two cases are what make the
    // case above a discrimination rather than a spelling test.
    expect(data).not.toBeNull();
    expect(sink.length).toBe(0);
  });

  it("records nothing for a connection it accepts", () => {
    const sink: DiagnosticSink = [];
    const data = getConnectionData(
      attrs({
        [CONN_ATTRS_LIST.NAME]: "c",
        [CONN_ATTRS_LIST.TYPE]: CONN_TYPE_VALUES.POSTGRES,
        [CONN_ATTRS_LIST.HOST]: "h",
        [CONN_ATTRS_LIST.USER]: "u",
        [CONN_ATTRS_LIST.PASSWORD]: "p",
      }),
      sink,
    );

    expect(data).not.toBeNull();
    expect(sink.length).toBe(0);
  });
});

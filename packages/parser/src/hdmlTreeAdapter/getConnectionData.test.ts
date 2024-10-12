/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import {
  IConnection,
  ConnectorTypes,
  IJDBCParameters,
  IBigQueryParameters,
  IGoogleSheetsParameters,
  IElasticsearchParameters,
  IMongoDBParameters,
  ISnowflakeParameters,
} from "@hdml/schemas";
import { getConnectionData } from "./getConnectionData";
import { CONN_ATTRS_LIST } from "../enums/CONN_ATTRS_LIST";

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
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `name` attribute is missing", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  // JDBC
  it("shoud return `null` if `host` attribute is missing for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `user` attribute is missing for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `password` attribute is missing for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return valid `ssl` property if correct `ssl` attributes is missed for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pg");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.Postgres,
    );

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeFalsy();
  });

  it("shoud return valid `ssl` property if correct `ssl` attributes is equal to `false` for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "false" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pg");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.Postgres,
    );

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeFalsy();
  });

  it("shoud return valid `ssl` property if correct `ssl` attributes is equal to `true` for JDBC connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pg");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.Postgres,
    );

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // PostgreSQL
  it("shoud return `IConnection` object if correct `postgres` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "postgres" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pg");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.Postgres,
    );

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // MySQL
  it("shoud return `IConnection` object if correct `mysql` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "my" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "mysql" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("my");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(ConnectorTypes.MySQL);

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // MsSQL
  it("shoud return `IConnection` object if correct `mssql` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "ms" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "mssql" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("ms");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(ConnectorTypes.MsSQL);

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Oracle
  it("shoud return `IConnection` object if correct `oracle` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "pl" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "oracle" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("pl");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(ConnectorTypes.Oracle);

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // ClickHouse
  it("shoud return `IConnection` object if correct `clickhouse` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "ch" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "clickhouse" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("ch");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.Clickhouse,
    );

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Druid
  it("shoud return `IConnection` object if correct `druid` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "dr" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "druid" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("dr");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(ConnectorTypes.Druid);

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Ignite
  it("shoud return `IConnection` object if correct `ignite` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "ig" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "ignite" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("ig");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(ConnectorTypes.Ignite);

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Redshift
  it("shoud return `IConnection` object if correct `redshift` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "rs" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "redshift" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("rs");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.Redshift,
    );

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // MariaDB
  it("shoud return `IConnection` object if correct `mariadb` attributes passed", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "ma" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "mariadb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("ma");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(ConnectorTypes.MariaDB);

    const params = <IJDBCParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.ssl).toBeTruthy();
  });

  // Google BigQuery
  it("shoud return `null` if correct `project-id` attribute is missed for `bigquery` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "bg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "bigquery" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if correct `credentials-key` attribute is missed for `bigquery` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "bg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "bigquery" },
      { name: CONN_ATTRS_LIST.PROJECT_ID, value: "id" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `IConnection` object if correct `bigquery` attributes passed", () => {
    // with meta
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "bg" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "bigquery" },
      { name: CONN_ATTRS_LIST.PROJECT_ID, value: "id" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("bg");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.BigQuery,
    );

    let params = <IBigQueryParameters>connection.options.parameters;
    expect(params.credentials_key).toBe("key");
    expect(params.project_id).toBe("id");

    // wo meta
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "bg" },
      { name: CONN_ATTRS_LIST.TYPE, value: "bigquery" },
      { name: CONN_ATTRS_LIST.PROJECT_ID, value: "id" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("bg");
    expect(connection.meta).toBe("");
    expect(connection.options.connector).toBe(
      ConnectorTypes.BigQuery,
    );

    params = <IBigQueryParameters>connection.options.parameters;
    expect(params.credentials_key).toBe("key");
    expect(params.project_id).toBe("id");
  });

  // Google Sheet
  it("shoud return `null` if correct `sheet-id` attribute is missed for `googlesheets` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "gs" },
      { name: CONN_ATTRS_LIST.META, value: "" },
      { name: CONN_ATTRS_LIST.TYPE, value: "googlesheets" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if correct `credentials-key` attribute is missed for `googlesheets` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "gs" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "googlesheets" },
      { name: CONN_ATTRS_LIST.SHEET_ID, value: "id" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `IConnection` object if correct `googlesheets` attributes passed", () => {
    // with meta
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "gs" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "googlesheets" },
      { name: CONN_ATTRS_LIST.SHEET_ID, value: "id" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("gs");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.GoogleSheets,
    );

    let params = <IGoogleSheetsParameters>(
      connection.options.parameters
    );
    expect(params.credentials_key).toBe("key");
    expect(params.sheet_id).toBe("id");

    // wo meta
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "gs" },
      { name: CONN_ATTRS_LIST.TYPE, value: "googlesheets" },
      { name: CONN_ATTRS_LIST.SHEET_ID, value: "id" },
      { name: CONN_ATTRS_LIST.CREDENTIALS_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("gs");
    expect(connection.meta).toBe("");
    expect(connection.options.connector).toBe(
      ConnectorTypes.GoogleSheets,
    );

    params = <IGoogleSheetsParameters>connection.options.parameters;
    expect(params.credentials_key).toBe("key");
    expect(params.sheet_id).toBe("id");
  });

  // Elastic
  it("shoud return `null` if `host` attribute is missed for `elasticsearch` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if AWS attributes are incorrect for `elasticsearch` connector", () => {
    // no region
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).toBeNull();

    // no access key
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).toBeNull();

    // no secret key
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).toBeNull();

    // secret key only
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `IConnection` object if correct `elasticsearch` attributes are passed", () => {
    // with meta, port and ssl
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("es");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.ElasticSearch,
    );

    let params = <IElasticsearchParameters>(
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

    // wo meta, port and ssl
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "es" },
      { name: CONN_ATTRS_LIST.TYPE, value: "elasticsearch" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.REGION, value: "region" },
      { name: CONN_ATTRS_LIST.ACCESS_KEY, value: "key" },
      { name: CONN_ATTRS_LIST.SECRET_KEY, value: "key" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("es");
    expect(connection.meta).toBe("");
    expect(connection.options.connector).toBe(
      ConnectorTypes.ElasticSearch,
    );

    params = <IElasticsearchParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(9200);
    expect(params.ssl).toBe(false);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.region).toBe("region");
    expect(params.access_key).toBe("key");
    expect(params.secret_key).toBe("key");

    // wo meta, port and ssl equal to false
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
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("es");
    expect(connection.meta).toBe("");
    expect(connection.options.connector).toBe(
      ConnectorTypes.ElasticSearch,
    );

    params = <IElasticsearchParameters>connection.options.parameters;
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
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `user` attribute is missed for `mongodb` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `password` attribute is missed for `mongodb` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `schema` attribute is missed for `mongodb` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `IConnection` object if correct `mongodb` attributes are passed", () => {
    // with meta, port and ssl
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "true" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("mn");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(ConnectorTypes.MongoDB);

    let params = <IMongoDBParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(1000);
    expect(params.ssl).toBe(true);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.schema).toBe("schema");

    // wo meta, port and ssl
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("mn");
    expect(connection.meta).toBe("");
    expect(connection.options.connector).toBe(ConnectorTypes.MongoDB);

    params = <IMongoDBParameters>connection.options.parameters;
    expect(params.host).toBe("localhost");
    expect(params.port).toBe(27017);
    expect(params.ssl).toBe(false);
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.schema).toBe("schema");

    // with empty meta, port and ssl equal to false
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "mn" },
      { name: CONN_ATTRS_LIST.META, value: "" },
      { name: CONN_ATTRS_LIST.TYPE, value: "mongodb" },
      { name: CONN_ATTRS_LIST.HOST, value: "localhost" },
      { name: CONN_ATTRS_LIST.PORT, value: "1000" },
      { name: CONN_ATTRS_LIST.SSL, value: "false" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.SCHEMA, value: "schema" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("mn");
    expect(connection.meta).toBe("");
    expect(connection.options.connector).toBe(ConnectorTypes.MongoDB);

    params = <IMongoDBParameters>connection.options.parameters;
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
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `user` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `password` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `role` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `null` if `warehouse` attribute is missed for `snowflake` connector", () => {
    const connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
    ]) as IConnection;

    expect(connection).toBeNull();
  });

  it("shoud return `IConnection` object if correct `snowflake` attributes are passed", () => {
    // with meta
    let connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      { name: CONN_ATTRS_LIST.META, value: "Some meta data." },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("sn");
    expect(connection.meta).toBe("Some meta data.");
    expect(connection.options.connector).toBe(
      ConnectorTypes.Snowflake,
    );

    let params = <ISnowflakeParameters>connection.options.parameters;
    expect(params.account).toBe("account");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.role).toBe("role");
    expect(params.database).toBe("database");
    expect(params.warehouse).toBe("warehouse");

    // wo meta
    connection = getConnectionData([
      { name: CONN_ATTRS_LIST.NAME, value: "sn" },
      { name: CONN_ATTRS_LIST.TYPE, value: "snowflake" },
      { name: CONN_ATTRS_LIST.ACCOUNT, value: "account" },
      { name: CONN_ATTRS_LIST.USER, value: "user" },
      { name: CONN_ATTRS_LIST.PASSWORD, value: "password" },
      { name: CONN_ATTRS_LIST.DATABASE, value: "database" },
      { name: CONN_ATTRS_LIST.ROLE, value: "role" },
      { name: CONN_ATTRS_LIST.WAREHOUSE, value: "warehouse" },
    ]) as IConnection;

    expect(connection).not.toBeNull();
    expect(connection.name).toBe("sn");
    expect(connection.meta).toBe("");
    expect(connection.options.connector).toBe(
      ConnectorTypes.Snowflake,
    );

    params = <ISnowflakeParameters>connection.options.parameters;
    expect(params.account).toBe("account");
    expect(params.user).toBe("user");
    expect(params.password).toBe("password");
    expect(params.role).toBe("role");
    expect(params.database).toBe("database");
    expect(params.warehouse).toBe("warehouse");
  });
});

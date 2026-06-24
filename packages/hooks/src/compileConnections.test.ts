/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { parseHDML, parseHTML } from "@hdml/parser";
import {
  serialize,
  deserialize,
  structurize,
  StructType,
} from "@hdml/buffer";
import { bytesToBase64, base64ToBytes } from "@hdml/hash";
import {
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
  getModelSQL,
  getFrameSQL,
} from "@hdml/stringifier";
import {
  compileConnections,
  injectEnv,
  CompilerDeps,
  CompilerResult,
  CompilerError,
  ConnectionEntry,
} from "./compileConnections";
import { compile } from "./compile";

const deps: CompilerDeps = {
  deserialize,
  serialize,
  structurize,
  base64ToBytes,
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
  getModelSQL,
  getFrameSQL,
  parseHTML,
  parseHDML,
  StructType,
};

// A Postgres connection whose host + password are env templates.
const pgConn = `
  <hdml-connection
    name="tenant_pg"
    type="postgresql"
    host="\${env.DB_HOST}"
    user="admin"
    password="\${env.DB_PASSWORD}">
  </hdml-connection>
`;

function entryFrom(html: string): ConnectionEntry {
  const conn = parseHDML(html).connections[0];
  return {
    name: conn.name,
    content: bytesToBase64(
      serialize(conn, StructType.ConnectionStruct),
    ),
  };
}

describe("injectEnv", () => {
  it("substitutes ${env.VAR}", () => {
    expect(injectEnv("${env.A}", { A: "x" })).toBe("x");
  });

  it("leaves ${scope.*} verbatim", () => {
    expect(injectEnv("${scope.s}", {})).toBe("${scope.s}");
  });

  it("un-escapes $${...} to literal ${...}", () => {
    expect(injectEnv("$${env.A}", { A: "x" })).toBe("${env.A}");
  });

  it("handles mixed env + scope in one value", () => {
    expect(injectEnv("${env.A}-${scope.b}", { A: "x" })).toBe(
      "x-${scope.b}",
    );
  });
});

describe("compileConnections", () => {
  it("emits an injected find-drop-create triple", () => {
    const out = compileConnections(deps, {
      connections: [entryFrom(pgConn)],
      env: { DB_HOST: "db.example.com", DB_PASSWORD: "s3cret" },
      output: "connection",
    }) as CompilerResult;
    expect(out.result).toHaveLength(3);
    expect(out.result[0]).toBe("show catalogs like 'tenant_pg'");
    expect(out.result[1]).toBe("drop catalog tenant_pg");
    expect(out.result[2]).toContain("db.example.com");
    expect(out.result[2]).toContain("s3cret");
    expect(out.result[2]).not.toContain("${env.");
  });

  it("fails the connection when an env var is undefined", () => {
    const out = compileConnections(deps, {
      connections: [entryFrom(pgConn)],
      env: {},
      output: "connection",
    }) as CompilerError;
    expect(out.error).toBe("undefined_env");
    expect(out.variable).toBe("DB_HOST");
  });

  it("passes ${scope.*} through to the DDL verbatim", () => {
    const scopeConn = `
      <hdml-connection
        name="t_pg"
        type="postgresql"
        host="\${scope.region}"
        user="u"
        password="p">
      </hdml-connection>
    `;
    const out = compileConnections(deps, {
      connections: [entryFrom(scopeConn)],
      env: {},
      output: "connection",
    }) as CompilerResult;
    expect(out.result[2]).toContain("${scope.region}");
  });

  it("un-escapes $${env.X} instead of injecting it", () => {
    const escConn = `
      <hdml-connection
        name="t_pg"
        type="postgresql"
        host="$\${env.DB_HOST}"
        user="u"
        password="p">
      </hdml-connection>
    `;
    const out = compileConnections(deps, {
      connections: [entryFrom(escConn)],
      env: { DB_HOST: "db.example.com" },
      output: "connection",
    }) as CompilerResult;
    expect(out.result[2]).toContain("${env.DB_HOST}");
    expect(out.result[2]).not.toContain("db.example.com");
  });

  it("yields no SQL for a nameless connection", () => {
    const conn = { ...parseHDML(pgConn).connections[0], name: "" };
    const entry: ConnectionEntry = {
      name: "",
      content: bytesToBase64(
        serialize(conn, StructType.ConnectionStruct),
      ),
    };
    const out = compileConnections(deps, {
      connections: [entry],
      env: { DB_HOST: "h", DB_PASSWORD: "p" },
      output: "connection",
    }) as CompilerResult;
    expect(out.result).toHaveLength(0);
  });
});

describe("compile dispatch", () => {
  it("routes connection mode to compileConnections", () => {
    const out = compile(deps, {
      connections: [entryFrom(pgConn)],
      env: { DB_HOST: "h", DB_PASSWORD: "p" },
      output: "connection",
    }) as CompilerResult;
    expect(out.result).toHaveLength(3);
  });

  it("returns invalid_output for unimplemented modes", () => {
    // `effective` (Slice D) is not yet wired; `sql` now is.
    const out = compile(deps, {
      connections: [],
      output: "effective",
    }) as CompilerError;
    expect(out.error).toBe("invalid_output");
  });
});

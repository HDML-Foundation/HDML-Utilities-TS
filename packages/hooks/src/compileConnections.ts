/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type { serialize, structurize } from "@hdml/buffer";
import type { StructType } from "@hdml/buffer";
import type { deserialize } from "@hdml/buffer";
import type { base64ToBytes } from "@hdml/hash";
import type { getConnectionSQLs } from "@hdml/stringifier";
import type { Connection } from "@hdml/types";
import type { ConnectionStruct } from "@hdml/schemas";

/**
 * One connection artifact in the compiler envelope: the bare element
 * `name` plus the base64 of its serialized `ConnectionStruct`.
 */
export interface ConnectionEntry {
  name: string;
  content: string;
}

/**
 * The `hdml_compiler.wasm` input envelope (RFC 002 §3). Only the
 * `connection` output mode is implemented here (Slice B);
 * `source` / `sql` (Slice C) and `effective` (Slice D) are not.
 */
export interface CompilerInput {
  connections?: ConnectionEntry[];
  env?: Record<string, string>;
  output?: string;
}

/** A flat `result` array — the uniform compiler output shape. */
export interface CompilerResult {
  result: string[];
}

/** A structured compiler failure. */
export interface CompilerError {
  error: string;
  detail?: string;
  variable?: string;
}

/**
 * The `@hdml/*` functions the connection branch needs, injected so
 * the WASM bin entry resolves them from `globalThis` (provided by
 * the plugin) while tests pass the real implementations in directly.
 */
export interface CompilerDeps {
  deserialize: typeof deserialize;
  serialize: typeof serialize;
  structurize: typeof structurize;
  base64ToBytes: typeof base64ToBytes;
  getConnectionSQLs: typeof getConnectionSQLs;
  StructType: typeof StructType;
}

/** Signals a `${env.VAR}` reference with no value in the env map. */
class UndefinedEnvError extends Error {
  public readonly variable: string;
  public constructor(variable: string) {
    super(`undefined env variable: ${variable}`);
    this.variable = variable;
  }
}

const TEMPLATE = /\$?\$\{([^}]*)\}/g;
const ENV_PREFIX = "env.";

/**
 * Resolves `${env.VAR}` references in a single attribute value
 * against the env map, and un-escapes `$${...}` → literal `${...}`.
 * Leaves
 * `${scope.*}` (and any non-`env` reference) verbatim — connections
 * are tenant-global, so scope is never injected (RFC 002 §4.2.2).
 *
 * @throws {UndefinedEnvError} when a `${env.VAR}` has no env value.
 */
export function injectEnv(
  value: string,
  env: Record<string, string>,
): string {
  return value.replace(TEMPLATE, (match: string, expr: string) => {
    if (match.startsWith("$$")) {
      // Escaped: $${...} -> literal ${...}, no substitution.
      return match.slice(1);
    }
    if (expr.startsWith(ENV_PREFIX)) {
      const name = expr.slice(ENV_PREFIX.length);
      if (!(name in env)) {
        throw new UndefinedEnvError(name);
      }
      return env[name];
    }
    // ${scope.*} or any other reference: pass through verbatim.
    return match;
  });
}

/**
 * Mutates a deserialized connection in place, injecting `${env.*}`
 * into every string-valued connector parameter. Works uniformly
 * across connector types — it walks `options.parameters` rather than
 * enumerating a per-field allowlist.
 */
function injectConnectionEnv(
  conn: Connection,
  env: Record<string, string>,
): void {
  const params = conn.options?.parameters as
    | Record<string, unknown>
    | undefined;
  if (!params) {
    return;
  }
  for (const key of Object.keys(params)) {
    const v = params[key];
    if (typeof v === "string") {
      params[key] = injectEnv(v, env);
    }
  }
}

/**
 * Runs the `connection` output mode: per connection, deserialize the
 * `ConnectionStruct`, inject `${env.*}`, re-serialize, and emit the
 * flat find-drop-create triple via `getConnectionSQLs`. The envelope
 * passes one connection per call, so a valid connection yields
 * exactly `[SHOW, DROP, CREATE]` and a nameless one yields `[]`.
 */
export function compileConnections(
  deps: CompilerDeps,
  input: CompilerInput,
): CompilerResult | CompilerError {
  const env = input.env ?? {};
  const result: string[] = [];
  for (const entry of input.connections ?? []) {
    let conn: Connection;
    try {
      conn = deps.deserialize(
        deps.base64ToBytes(entry.content),
        deps.StructType.ConnectionStruct,
      ) as Connection;
    } catch (e) {
      return { error: "deserialize_failed", detail: message(e) };
    }
    try {
      injectConnectionEnv(conn, env);
    } catch (e) {
      if (e instanceof UndefinedEnvError) {
        return { error: "undefined_env", variable: e.variable };
      }
      return { error: "injection_failed", detail: message(e) };
    }
    try {
      const bytes = deps.serialize(
        conn,
        deps.StructType.ConnectionStruct,
      );
      const struct = deps.structurize(
        bytes,
        deps.StructType.ConnectionStruct,
      ) as ConnectionStruct;
      result.push(...deps.getConnectionSQLs(struct));
    } catch (e) {
      return { error: "generation_failed", detail: message(e) };
    }
  }
  return { result };
}

/**
 * Dispatches the compiler envelope on `output`. Slice B owns only
 * the `connection` mode; `source` / `sql` (C) and `effective` (D)
 * are left as `invalid_output` so the dispatch stays extensible
 * without pre-empting those slices.
 */
export function compile(
  deps: CompilerDeps,
  input: CompilerInput,
): CompilerResult | CompilerError {
  switch (input.output) {
    case "connection":
      return compileConnections(deps, input);
    default:
      return {
        error: "invalid_output",
        detail: `unsupported output mode: ${String(input.output)}`,
      };
  }
}

/** Extracts a human-readable message from an unknown thrown value. */
function message(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

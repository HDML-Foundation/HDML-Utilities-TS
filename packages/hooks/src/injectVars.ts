/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Signals a `${env.VAR}` reference with no value in the env map.
 * Carries the bare variable name so the caller can surface it as
 * `{ error: "undefined_env", variable }`. Mirrors the local error of
 * `compileConnections.ts`, but lives here because the document-wide
 * `sql`-branch injector throws it too.
 */
export class UndefinedEnvError extends Error {
  public readonly variable: string;
  public constructor(variable: string) {
    super(`undefined env variable: ${variable}`);
    this.variable = variable;
  }
}

/**
 * Signals a `${scope.FIELD}` reference with no (coercible) value in
 * the scope map. Carries the field name for the
 * `{ error: "undefined_scope", variable }` surface.
 */
export class UndefinedScopeError extends Error {
  public readonly variable: string;
  public constructor(variable: string) {
    super(`undefined scope variable: ${variable}`);
    this.variable = variable;
  }
}

const TEMPLATE = /\$?\$\{([^}]*)\}/g;
const ENV_PREFIX = "env.";
const SCOPE_PREFIX = "scope.";

/**
 * Resolves one `${scope.FIELD}` reference. A missing key or a
 * nullish value is a hard error (`UndefinedScopeError`); a
 * non-primitive value (object / array) is not coercible and throws a
 * plain `Error`; otherwise the value is stringified.
 */
function resolveScope(
  name: string,
  scope: Record<string, unknown>,
): string {
  if (!(name in scope)) {
    throw new UndefinedScopeError(name);
  }
  const value = scope[name];
  if (value === null || value === undefined) {
    throw new UndefinedScopeError(name);
  }
  if (typeof value === "object") {
    throw new Error(
      `scope variable not coercible to string: ${name}`,
    );
  }
  return String(value);
}

/**
 * Resolves `${env.VAR}` and `${scope.FIELD}` references in a single
 * string against the env / scope maps, and un-escapes `$${...}` to a
 * literal `${...}`. Unlike `injectEnv` (connections, env-only), this
 * is the document-wide injector for the `sql` branch: both namespaces
 * resolve, and a referenced-but-missing variable is a hard error
 * (RFC 002 §8.4) — never a silent empty substitution that could open
 * a WHERE clause. References in an unknown namespace pass through
 * verbatim (mirrors `injectEnv`).
 *
 * @throws {UndefinedEnvError} when a `${env.VAR}` has no env value.
 * @throws {UndefinedScopeError} when a `${scope.FIELD}` has no
 *   coercible scope value.
 */
export function injectVars(
  value: string,
  env: Record<string, string>,
  scope: Record<string, unknown>,
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
    if (expr.startsWith(SCOPE_PREFIX)) {
      return resolveScope(expr.slice(SCOPE_PREFIX.length), scope);
    }
    // Unknown namespace: pass through verbatim.
    return match;
  });
}

/**
 * Recursively injects `${env.*}` / `${scope.*}` into every
 * string-valued field of an objectified `Frame` / `Model` (or any
 * nested value), mutating in place. Strings without a `${…}` template
 * are untouched; numbers, booleans, and `null` are skipped; arrays
 * and nested objects are walked. Mirrors `injectConnectionEnv`'s
 * walk, but recursive and over both namespaces.
 */
export function injectObjectVars(
  obj: unknown,
  env: Record<string, string>,
  scope: Record<string, unknown>,
): void {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  if (Array.isArray(obj)) {
    const arr = obj as unknown[];
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i];
      if (typeof value === "string") {
        arr[i] = injectVars(value, env, scope);
      } else {
        injectObjectVars(value, env, scope);
      }
    }
    return;
  }
  const rec = obj as Record<string, unknown>;
  for (const key of Object.keys(rec)) {
    const value = rec[key];
    if (typeof value === "string") {
      rec[key] = injectVars(value, env, scope);
    } else {
      injectObjectVars(value, env, scope);
    }
  }
}

# Integration — how other repos consume `@hdml/*`

> **Scope:** The contract this monorepo makes to its consumers (HDIO-Server, HDIO-Javy-Plugin,
> HDML-Components, and external npm users), plus versioning rules. Open this when bumping a
> version or wiring a new consumer.

## Consumers

| Consumer | How it imports | Notes |
|---|---|---|
| **HDML-Components** (public, Lit/TS) | `npm i @hdml/parser @hdml/types @hdml/schemas …` from registry | Build-time TS consumer. Authoring layer for HDML in the browser. |
| **HDIO-Javy-Plugin** (private, Rust → `hdio.wasm`) | `npm ci` inside its `.hdml/` directory pulls `@hdml/*` from npm | Bundles `@hdml/*` into the Javy/QuickJS runtime; the resulting WASM is embedded in `HDIO-Server`. |
| **HDIO-Server** (private, Go) | Does **not** import `@hdml/*` directly. It runs `hdio.wasm` (from the plugin) under `wasmtime-go`, plus tenant hooks built with `javy build -C dynamic -C plugin=hdio.wasm` after esbuild rewrites `@hdml/*` imports to `globalThis` lookups. | Consumes the same `HDML-Schemas` `.fbs` files independently via Go bindings (`flatc --go`). |
| External npm users | `npm i @hdml/parser` etc. | Public packages on `registry.npmjs.org` under the `@hdml` scope. |

## Versioning

**All eight packages publish at the same version.** A single semver string (`0.0.2-alpha.13`
at the time of writing) is mirrored across every `packages/*/package.json` and every
cross-package `@hdml/*` dependency. [scripts/release.sh](../scripts/release.sh) is the
mechanism that enforces this — it sed-rewrites every `version` and every
`"@hdml/<peer>": "<old>"` to the new value, commits, tags, and pushes; CI then publishes.

Implications:

- A consumer that wants `@hdml/parser@X` must also use `@hdml/types@X` and `@hdml/schemas@X`.
  Cross-version mixing is unsupported because the bufferify/objectify functions assume the
  generated struct shapes are identical.
- `HDML-Components` (one repo over) currently lags by one alpha (`^0.0.2-alpha.12` against
  this repo's `0.0.2-alpha.13`) — track that drift in the workspace root's
  [CLAUDE.md §6](../../../CLAUDE.md). `TODO(confirm: bump HDML-Components to match.)`

## globalThis convention (every runtime entry point)

Every `index.ts` except `@hdml/types` runs this side-effect on import:

```ts
const _export = globalThis as unknown as {
  "@hdml/<name>": { … each export … };
};
_export["@hdml/<name>"] = { … };
```

**Why it exists:** tenant hook code in HDIO is bundled by esbuild, then compiled to a
**dynamic** Javy `.wasm` that links against `hdio.wasm` via the plugin's import surface. The
plugin does not provide a CommonJS / ESM module resolver inside the QuickJS runtime — it
provides `globalThis` slots. The Javy plugin's esbuild step rewrites `import { parseHDML }
from "@hdml/parser"` into `const { parseHDML } = globalThis["@hdml/parser"]`.

**What you must not do:** remove the `globalThis` registration from an `index.ts`, even if
the ESM exports look complete. If you add a new function to an `index.ts`, add it to the
`globalThis` object too. If you add a brand-new `@hdml/*` package, model its `index.ts` on
an existing one.

## WASM host ABI (HDIO-Server ↔ `@hdml/hooks`)

The `@hdml/hooks` I/O primitives use `Javy.IO.readSync(fd, buffer)` and
`Javy.IO.writeSync(fd, buffer)` on file descriptors **0** (stdin), **1** (stdout), and **2**
(stderr) — declared in [packages/hooks/src/types/global.ts](../packages/hooks/src/types/global.ts).

What the host (HDIO-Server) is expected to do:

- Wire fd 0 to a temp input file (containing a **JSON envelope**; binary payloads
  base64-encoded).
- Wire fd 1 to a temp output file (the module will write a JSON response).
- Forward fd 2 to the logger.
- Run on a tmpfs under `HDIO_WASM_TMPDIR` (default `/dev/shm/hdio` per the
  HDIO-Server rewrite) with fuel + memory limits.

Tenants extend this with custom hooks (`fetchClaimsFromSSO`, `onUserTokenRequest`); those
hooks call `readJson` / `writeJson` from `@hdml/hooks` exactly like predefined modules.

See the workspace root [CLAUDE.md §4.2](../../../CLAUDE.md) for HDIO-Server's side of the
contract.

## Adding a consumer

1. Add `@hdml/<pkg>` to the consumer's `package.json` at the exact version this monorepo
   publishes — do not use `^` or `~` ranges across `@hdml/*` boundaries unless you accept
   atomic-version risk.
2. If the consumer runs inside `hdio.wasm`: rely on `globalThis["@hdml/<pkg>"]`. The Javy
   plugin's esbuild step does the rewrite for you when imports are written as `from
   "@hdml/<pkg>"`.
3. If the consumer is browser/Node: import normally; ESM and CJS entry points are in `esm/`
   and `cjs/` respectively, types in `dts/`.
4. If the consumer also reads `HDML-Schemas` (e.g. HDIO-Server with `flatc --go`): pin the
   submodule SHA so its generated bindings come from the same schema revision this repo
   published against.

## Apache Arrow at the boundary

HDIO-Server's query path streams **Apache Arrow IPC** to the client. The arrow runtime lives
in `@hdml/common` (`apache-arrow ^11.0.0`) and is re-exported as `arrow`. Consumers that need
to decode HDIO query results should depend on `@hdml/common` rather than installing a second
`apache-arrow` copy — that keeps Arrow's vtable identity stable across hosts.

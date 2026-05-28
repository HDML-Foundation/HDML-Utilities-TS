# HDML-Utilities-TS — agent index

> Navigational index for this repo. CLAUDE.md is loaded every session; substance lives in
> [docs/](docs/). Open a docs file only when you need its topic.

## What this repo is

The TypeScript monorepo behind HDML — eight npm packages under `@hdml/*` that parse HDML
markup, model it as `HDOM`, serialize it to FlatBuffers, and emit SQL / HTML from it. The
same code runs in browsers (via HDML-Components), inside `hdio.wasm` (via HDIO-Javy-Plugin),
and in Node consumers. **Node 18 / TypeScript 4.9.5 / FlatBuffers 24.3.25 / lockstep
versioning (currently `0.0.2-alpha.13`).**

This repo does **not** own the FlatBuffers schema. The `.fbs` files live in the
[HDML-Schemas/](HDML-Schemas/) submodule; `@hdml/schemas` regenerates TS bindings from them.

## Where to find what

| Looking for | Open |
|---|---|
| Eight packages, dependency graph, end-to-end data flow | [docs/architecture.md](docs/architecture.md) |
| Setup, build, test, lint, release commands, repo layout | [docs/development.md](docs/development.md) |
| Per-package public API — exports, signatures, where to look in src | [docs/packages.md](docs/packages.md) |
| FlatBuffers contract: `.fbs` codegen, `compile_fbs`, schema-change order | [docs/schemas.md](docs/schemas.md) |
| How HDIO-Server / HDIO-Javy-Plugin / HDML-Components consume `@hdml/*`, WASM ABI, versioning | [docs/integration.md](docs/integration.md) |
| Style, JSDoc, naming, error handling, "don't touch" rules | [docs/conventions.md](docs/conventions.md) |
| *Why* a piece of the repo is shaped the way it is | [docs/decisions.md](docs/decisions.md) |

## Quickstart

```bash
git submodule update --init --recursive   # populate HDML-Schemas
npm install
npm run build                              # build all eight packages
npm test
npm -w @hdml/parser run build              # one package
```

Per-format compile targets (`compile_cjs`, `compile_esm`, `compile_dts`, `compile_bin`,
`compile_tst`) and clean / dev-server / release flows live in [docs/development.md](docs/development.md).

## Repo layout

| Path | Contents |
|---|---|
| [packages/](packages/) | Eight `@hdml/*` workspaces (see table below) |
| [HDML-Schemas/](HDML-Schemas/) | Git submodule — `.fbs` source-of-truth |
| [tsconfig/](tsconfig/) | Shared `base/cjs/esm/dts/tst.json` |
| [scripts/](scripts/) | `init` (devcontainer postAttach), `release.sh` (lockstep bump+tag+push) |
| [.github/workflows/](.github/workflows/) | `main.yml`, `release.yml`, `devcontainer.yml` |
| [.eslintrc.js](.eslintrc.js), [.jestrc.js](.jestrc.js), [.srv.js](.srv.js) | Lint / test / dev-server config |

### The eight workspaces

| Package | What it does |
|---|---|
| [packages/schemas/](packages/schemas/) | FlatBuffers TS bindings — generated from `.fbs` via `compile_fbs`. The wire-format contract. |
| [packages/types/](packages/types/) | Hand-authored TS interfaces (`HDOM`, `Connection`, `Model`, `Frame`, …) + tag/attribute/value constants. |
| [packages/parser/](packages/parser/) | `parseHDML`, `parseHTML`, `sortFrames`. parse5 + custom tree adapter. |
| [packages/buffer/](packages/buffer/) | `serialize`, `deserialize`, `structurize`, `fileifize` + the `bufferify/` / `objectify/` converters. |
| [packages/stringifier/](packages/stringifier/) | `get{Connection,Model,Frame}{SQL,HTML}`. Inputs are FlatBuffers structs, **not** TS interfaces. |
| [packages/hooks/](packages/hooks/) | `Javy.IO` stdin/stdout helpers (`read/writeJson`, `read/writeString`, `read/writeUint8Array`). |
| [packages/hash/](packages/hash/) | `md5`, `uid`, `hashify`, `hashtime`, `parsetime`, base64 codec. |
| [packages/common/](packages/common/) | Pinned `apache-arrow`, `uuid`, `throttle-debounce` re-exports. |

## External contracts

| Contract | Where it's enforced | More |
|---|---|---|
| Wire / on-disk format = FlatBuffers `HDOMStruct` (+ `DocumentFilesStruct` for split storage) | [@hdml/buffer](packages/buffer/src/) | [docs/schemas.md](docs/schemas.md) |
| `flatc` version pinned at `v24.3.25` and `flatbuffers` runtime at the same | [@hdml/schemas](packages/schemas/package.json), workspace devcontainer | [docs/schemas.md#flatc-version](docs/schemas.md#flatc-version) |
| Every runtime `index.ts` registers itself on `globalThis["@hdml/<name>"]` (Javy/WASM linkage) | each package's `src/index.ts` | [docs/integration.md#globalthis-convention-every-runtime-entry-point](docs/integration.md#globalthis-convention-every-runtime-entry-point) |
| `@hdml/hooks` ABI = `Javy.IO.readSync/writeSync` on fds 0/1/2 | [packages/hooks/src/types/global.ts](packages/hooks/src/types/global.ts) | [docs/integration.md#wasm-host-abi-hdio-server--hdmlhooks](docs/integration.md#wasm-host-abi-hdio-server--hdmlhooks) |
| All eight packages publish at the **same** semver | [scripts/release.sh](scripts/release.sh) | [docs/integration.md#versioning](docs/integration.md#versioning) |

## Cross-repo dependencies

| Other repo | What flows where | Notes |
|---|---|---|
| `HDML-Schemas` (submodule) | `.fbs` → `@hdml/schemas` (via `flatc --ts`) | Pinned by git SHA. Schema changes are breaking. [docs/schemas.md](docs/schemas.md) |
| `HDML-Components` | npm consumes `@hdml/parser`, `@hdml/types`, `@hdml/schemas`, etc. | Currently one alpha behind; bump together. |
| `HDIO-Javy-Plugin` | `npm ci` in its `.hdml/` pulls `@hdml/*` → bundled into `hdio.wasm` | Tenant hooks resolve `@hdml/*` via `globalThis`. |
| `HDIO-Server` | Embeds `hdio.wasm`; also pulls `.fbs` directly via its own submodule and `flatc --go` | TS isn't consumed; Go bindings are. Both must come from the same `flatc`/schema rev. |

Workspace overview: [../../CLAUDE.md](../../CLAUDE.md).

## Conventions (short)

- **70-char line limit**, 2-space indent, semicolons, trailing commas — enforced by Prettier
  + ESLint ([.eslintrc.js](.eslintrc.js)).
- **No `any`**, every exported function declares its return type literally.
- **JSDoc required** on every exported symbol.
- **Don't edit `packages/schemas/src/document/` or `src/enum/`** — generated, gitignored;
  edit `.fbs` and run `compile_fbs`.
- **Stringifiers take FlatBuffers structs, not TS interfaces** — bufferify first if needed.
- **Don't drop the `globalThis["@hdml/<name>"]` block** from any runtime `index.ts` — tenant
  hooks resolve `@hdml/*` through it.
- Adding a new `StructType` requires updating
  [StructType.ts](packages/buffer/src/StructType.ts),
  [serialize.ts](packages/buffer/src/serialize.ts),
  [deserialize.ts](packages/buffer/src/deserialize.ts),
  [structurize.ts](packages/buffer/src/structurize.ts) together.

Full rules and rationale: [docs/conventions.md](docs/conventions.md) · [docs/decisions.md](docs/decisions.md).

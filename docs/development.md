# Development

> **Scope:** Setup, build, test, lint, and per-package output formats. Open this when running
> commands locally or debugging a build.

## Prerequisites

- Node.js 18 (provisioned by the workspace devcontainer — [.devcontainer/Dockerfile](../.devcontainer/Dockerfile))
- npm (workspaces, no Yarn / pnpm)
- `flatc` v24.3.25 on PATH — only needed when (re)building `@hdml/schemas` (the workspace
  devcontainer installs it from source)
- SSH key wired to the `HDML-Schemas` GitHub repo (workspace `init` script handles this)

## Setup

```bash
git submodule update --init --recursive   # populate HDML-Schemas
npm install                                # installs all workspaces
```

`HDML-Schemas/` MUST be populated before building `@hdml/schemas` — its `compile_fbs` step
runs `flatc --ts … ../../HDML-Schemas/src/*.fbs`.

## Build

```bash
npm run build                # build every workspace
npm run build --workspaces   # equivalent
npm -w @hdml/parser run build
```

Each package's `build` runs: `clear → lint → test --coverage → compile_all → docs`.
`@hdml/schemas` additionally runs `compile_fbs` before lint.

### Per-format compile targets

Every package exposes the same compile targets (driven by `tsconfig/{cjs,esm,dts,tst}.json`):

| Script | Output | Config |
|---|---|---|
| `compile_cjs` | `cjs/` (CommonJS, `main`) | `tsconfig/cjs.json` (extends [tsconfig/base.json](../tsconfig/base.json)) |
| `compile_esm` | `esm/` (ES modules, `module`) | `tsconfig/esm.json` |
| `compile_dts` | `dts/` (`.d.ts`, `types`) | `tsconfig/dts.json` (declaration-only) |
| `compile_bin` | one or more `bin/*.min.js` (IIFE, minified, sourcemap) | orchestrator; runs `esbuild` per entry |
| `compile_tst` | `tst/` (test compilation) | `tsconfig/tst.json` (extends `cjs.json`, includes `.test.ts`) |
| `compile_all` | all of the above | — |

`bin/` exists only on packages with a runtime surface (everything except `@hdml/types`, which
has no `srv` / `compile_bin` script either).

`@hdml/hooks` publishes **three** bin outputs, so its `compile_bin` is an orchestrator that
fans out to three per-entry esbuild sub-targets:

| Script | Output | esbuild entry |
|---|---|---|
| `compile_bin` | (runs the three below in order) | — |
| `compile_bin_io` | `bin/index.min.js` (the I/O primitives barrel) | `esm/index.js` |
| `compile_bin_parser` | `bin/parser.min.js` (predefined-module entry) | `esm/parser.js` |
| `compile_bin_compiler` | `bin/compiler.min.js` (predefined-module entry) | `esm/compiler.js` |

The two predefined-module entries (`parser.min.js`, `compiler.min.js`) are the
javy-ready bundles consumed by HDIO-Javy-Plugin's `javy build`. They reference the
plugin-provided `globalThis["@hdml/*"]` globals directly rather than inlining any `@hdml/*`
source.

## Test

```bash
npm test                     # all workspaces
npm -w @hdml/buffer test     # one package
```

Jest config: [.jestrc.js](../.jestrc.js) (`testMatch: **/?(*.)+(test).+(js)`). Tests are
**compiled to JS first** (`compile_tst`) and Jest runs against the `tst/` output, not the
TypeScript source. `@hdml/types` has an empty `test` script — its surface is pure types.

## Lint

```bash
npm run lint                 # all workspaces
```

ESLint config: [.eslintrc.js](../.eslintrc.js). Highlights:

- 70-char `max-len` (Prettier + ESLint both enforce)
- `@typescript-eslint/no-explicit-any: error`
- `@typescript-eslint/explicit-module-boundary-types: error`
- Prettier: 2-space indent, trailing commas, semicolons, single-statement arrow parens

The lint config drives the formatting rules in [.cursorrules](../.cursorrules); both files
must move together if rules change.

## Clean

```bash
npm run clear                # remove cjs/ esm/ dts/ bin/ tst/ docs/ coverage/ + .tsbuildinfo
```

`@hdml/schemas` additionally deletes `src/document/` and `src/enum/` (the generated
FlatBuffers TS output — both are gitignored, see [.gitignore](../.gitignore)).

## Dev server (one-package browser smoke test)

```bash
npm -w @hdml/parser run srv
```

Uses [.srv.js](../.srv.js) (`@web/dev-server`). Each package has its own `index.html` —
useful when validating a parser/stringifier change against a real browser.

## Release

[scripts/release.sh](../scripts/release.sh) bumps `version` in every `packages/*/package.json`,
rewrites cross-package `@hdml/*` deps to the new version, commits, tags `vX.Y.Z`, and pushes.
GitHub Actions then runs the **release.yml** workflow which `npm publish --workspaces`.

Versions are **lockstep** — all eight packages publish at the same version. Currently
**0.0.2-alpha.13**. See [docs/integration.md#versioning](integration.md#versioning).

```bash
sh scripts/release.sh 0.0.2-alpha.14
```

Must be run from `main`. Reads `/home/.ssh/gh_token` for push credentials.

## Repo layout

```
HDML-Utilities-TS/
├── packages/                       # eight @hdml/* packages (npm workspaces)
│   ├── common/                     # apache-arrow + uuid + throttle-debounce re-exports
│   ├── schemas/                    # FlatBuffers TS bindings (generated)
│   ├── types/                      # HDOM/Connection/Model/Frame/Field/… TS interfaces + enums
│   ├── parser/                     # parseHDML, parseHTML, sortFrames
│   ├── stringifier/                # get{Connection,Model,Frame}{SQL,HTML}
│   ├── buffer/                     # serialize/deserialize/structurize/fileifize + bufferify/objectify
│   ├── hash/                       # md5, uid, hashify, hashtime, parsetime, base64↔bytes
│   └── hooks/                      # Javy.IO read/write helpers for WASM hosts
├── HDML-Schemas/                   # git submodule (source-of-truth .fbs files)
├── tsconfig/                       # shared base.json + cjs/esm/dts/tst variants
├── scripts/                        # init (devcontainer postAttach), release.sh
├── .devcontainer/                  # workspace-local devcontainer (rarely opened directly)
├── .github/workflows/              # main.yml, release.yml, devcontainer.yml
├── .eslintrc.js · .jestrc.js · .srv.js · .gitignore · .gitmodules
└── package.json                    # root workspace declaration
```

Generated / build output directories (gitignored): `packages/*/{bin,cjs,dts,esm,tst,docs,coverage}`,
`packages/schemas/src/{document,enum}`.

## Adding a new package

1. `mkdir packages/<name>/{src,tsconfig}`
2. Copy `tsconfig/{cjs,esm,dts,tst}.json` from a peer package, adjust `references` if needed
3. Author `package.json` — mirror an existing package; bump version to match the lockstep
4. Add `"packages/<name>"` to root [package.json](../package.json) workspaces
5. Create `src/index.ts`, write the `globalThis["@hdml/<name>"]` registration block, write tests
6. `npm install` to refresh the workspace symlinks, `npm -w @hdml/<name> run build`

See [docs/integration.md](integration.md) for what other consumers (HDIO-Server, the Javy
plugin, HDML-Components) need to do to take the new package.

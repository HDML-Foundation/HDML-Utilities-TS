# Decisions

> **Scope:** Non-obvious design choices and *why* they exist. Open this when a piece of the
> repo seems weird and you want to know whether to "fix" it.

## FlatBuffers as the wire format, not JSON

Wire / on-disk format is FlatBuffers (via the `flatbuffers` 24.3.25 runtime), not JSON. The
deciding factors:

- The HDIO server stores compiled artifacts on disk in the **exact same format** as the
  wire — no second representation.
- Apache Arrow streams over the same boundary; pairing two binary formats is cheaper than
  mixing JSON + Arrow.
- The structs are referenced from Go (HDIO-Server) and TypeScript (this repo) — having a
  schema-compiler-driven contract lets both sides agree without a hand-written serializer.

The `serialize`/`deserialize` API at [packages/buffer/](../packages/buffer/) is what insulates
callers from this choice. Callers see TS interfaces; bytes are flat on disk.

## TS interfaces in `@hdml/types` are *parallel* to FlatBuffers structs, not derived

[packages/types/](../packages/types/src/) contains hand-authored TS interfaces (`HDOM`,
`Connection`, `Model`, etc.) that mirror the FlatBuffers schema. Why not auto-generate them?

- The generated TypeScript bindings from `flatc --ts` are **classes with getter methods**
  (`struct.name()`, `struct.fields(i)`) — not POJOs. They're awkward to author and serialize.
- The hand-authored interfaces are the *ergonomic* shape callers want. `bufferify*` /
  `objectify*` bridge between them.
- That makes the cost of schema changes higher — but the wire format is small and changes
  slowly, so the win on caller ergonomics dominates.

## Stringifiers consume FlatBuffers structs, not TS interfaces

[getModelSQL](../packages/stringifier/src/model.ts#L24), [getFrameSQL](../packages/stringifier/src/frame.ts#L17), and
[getConnectionSQLs](../packages/stringifier/src/connection.ts#L25) all take `*Struct`, not the
matching TS interface. Why?

- HDIO loads the on-disk artifact as a FlatBuffers struct directly (no `objectify` step in
  the hot query path). Calling `getFrameSQL(frameStruct, …)` avoids the round-trip and the
  allocations.
- The stringifiers don't mutate or extend their input — getter methods are sufficient.

If you have only a TS `HDOM` and need SQL, you must bufferify first. The asymmetry is
deliberate.

## `globalThis["@hdml/<name>"]` registration

Every runtime `index.ts` writes its exports to `globalThis`. Why this, given that ES modules
exist?

The Javy/QuickJS runtime inside `hdio.wasm` doesn't load ES modules at runtime — bundles are
fused into the WASM at compile time. Tenant hooks are compiled separately (`javy build -C
dynamic`) and **link against `hdio.wasm` via its plugin import surface**. That surface
exposes `globalThis`, not a module resolver. So:

- The Javy plugin's esbuild step rewrites `import { parseHDML } from "@hdml/parser"` into a
  `globalThis["@hdml/parser"]` lookup.
- For the lookup to succeed, `hdio.wasm` must already have evaluated each `@hdml/*`
  `index.ts` and populated the `globalThis` slot.

Without the registration, tenant hooks fail at runtime. See
[integration.md#globalthis-convention-every-runtime-entry-point](integration.md#globalthis-convention-every-runtime-entry-point).

## Lockstep versioning

All eight packages publish at the same version (`0.0.2-alpha.13` today). Why not loosen
versions per package, given they're separately scoped?

- The bufferify / objectify functions assume the generated struct shapes are identical
  across `@hdml/schemas`, `@hdml/types`, `@hdml/buffer`. A `@hdml/types@N` paired with
  `@hdml/buffer@N+1` can produce silent serialization corruption.
- Lockstep lets [scripts/release.sh](../scripts/release.sh) be a 20-line sed script. No
  need for changesets, no need for per-package release notes.

The cost: every user-visible change ships in every package's changelog. The cost is small
while the project is small and ships pre-1.0.

## Frame sort order matters

[sortFrames](../packages/parser/src/sortFrames.ts) sorts frames into four groups before
returning the parsed HDOM. Why?

- Frames source from models *or other frames*. Processing a frame before its source frame is
  parsed produces an unresolved reference.
- The four groups (model-rooted `/path`, frame-rooted `/path`, model-rooted `?`, frame-rooted
  `?`) correspond to dependency depth — earlier groups can never depend on later ones.
- Within group 4 (the only one with intra-group dependencies), the sort does a topological
  pass on `source` names.

Removing the sort would push the responsibility onto every downstream consumer.
`@hdml/parser` does it once, in the right place.

## Test compilation step

Tests are compiled to JS (`tst/`) and Jest runs against that, instead of `ts-jest` running
TS directly. Why?

- Decouples Jest from TypeScript version churn.
- Faster cold start (no per-test transform).
- Lets `compile_tst` reuse the same tsconfig graph as `compile_cjs` / `compile_esm`,
  which catches misconfiguration early.

The cost is one extra `npm run compile_tst` before `jest`, baked into the per-package
`test` script. Worth it.

## `@hdml/common` exists to pin shared runtimes

`apache-arrow`, `uuid`, and `throttle-debounce` are re-exported from
[@hdml/common](../packages/common/src/index.ts). Why not let each consumer install them
directly?

- Apache Arrow has heavy runtime state (vtables, lazy-init type tables) that breaks across
  duplicate module instances. Single-source pinning avoids it.
- The Javy bundle would otherwise carry duplicate copies of `uuid` for each `@hdml/*` that
  imports it; `@hdml/common` lets esbuild dedupe.
- Consumers can `import { arrow } from "@hdml/common"` and get the same Arrow instance HDIO
  uses on its streaming boundary.

## Why `@hdml/hooks` depends on `@hdml/parser`

`@hdml/hooks` is "stdin/stdout helpers for WASM" — at first glance unrelated to parsing. The
dep is there because a future-facing helper (`readHDML` / `writeHDML`) reuses `parseHDML` to
round-trip strings into HDOM. Current `index.ts` exports only the I/O primitives, but the
dep is preserved so the parser is bundled into `hdio.wasm` alongside the hooks. Don't drop
it.

`TODO(confirm: whether the planned readHDML / writeHDML helpers are still on the roadmap,
or the parser dep can be moved to devDependencies.)`

# Conventions

> **Scope:** The non-obvious house rules — code style, file naming, JSDoc, tests, and a few
> "don't touch this without reading first" callouts. Open this before authoring a new file
> or a PR.

## Authoritative source

[.eslintrc.js](../.eslintrc.js) is the machine-enforced rule set. This file summarizes its
*spirit* and calls out conventions ESLint can't enforce.

## Formatting (enforced by Prettier + ESLint)

- **70-character line limit.** Hard. Includes JSDoc lines. Wrap aggressively.
- 2-space indent, no tabs.
- Semicolons required.
- Trailing commas in every multi-line literal.
- Arrow params always parenthesized: `(x) => …`.
- Single line for `import {}` until you exceed 70 chars; then one symbol per line.

## TypeScript

- `strict: true`, `noImplicitReturns: true` (see [tsconfig/base.json](../tsconfig/base.json)).
- `no-explicit-any` is an **error**, not a warning.
- `explicit-module-boundary-types` is an error — every exported function must declare its
  return type literally. Don't rely on inference at the package boundary.
- `interface` for object shapes, `type` for unions/intersections.
- Use `import type` for type-only imports.
- Prefer `null` over `undefined` for "no value" optional properties (this is observable in
  the FlatBuffers round-trip — `null` and missing are not always equivalent in the bindings).

## Naming

- **Files:** camelCase (`bufferifyHDOM.ts`, `parseHDML.ts`). Generated FlatBuffers files do
  not follow this — they are kebab-case (`hdomstruct.ts`) and are not human-edited.
- **Tests:** `<source>.test.ts` next to the source.
- **Interfaces / types:** PascalCase.
- **Enums:** PascalCase. Generated `*Enum` suffix from FlatBuffers; hand-authored value
  arrays use `*_VALUES` suffix; attribute name lists use `*_ATTRS_LIST` suffix. These
  conventions matter because the parser and stringifier both index into them by name.

## JSDoc (required on every exported symbol)

Format: description, blank line, `@param` per parameter, `@returns`, optional `@example`.
The repo's existing functions are the reference — e.g.
[parseHDML](../packages/parser/src/parseHDML.ts#L13), [serialize](../packages/buffer/src/serialize.ts#L18).

Don't write what the code already says; write *why* the function exists and what edges it
guards. For interfaces, document each property with a JSDoc block per property.

## Error handling

- Validate at the **package boundary** (parser, hooks). Internal code trusts its inputs.
- **Do not throw on malformed HDML** — log to `console.error` and return a partial/empty
  HDOM. The parser is the precedent: [parseHDML.ts:36-41](../packages/parser/src/parseHDML.ts#L36-L41)
  uses `onParseError: console.error` and falls back to an empty HDDM.
- Buffer / stringifier do throw on `default:` branches (unsupported `StructType`,
  unsupported connector) — that is correct because those represent programming errors, not
  user input.

## Side-effect ban (with one allowed exception)

The **only** allowed side-effect at import time is the `globalThis["@hdml/<name>"] = {…}`
registration in each runtime `index.ts`. Why it exists and what depends on it: see
[integration.md#globalthis-convention-every-runtime-entry-point](integration.md#globalthis-convention-every-runtime-entry-point).
Do not add anything else to module top-level — that includes logging, network calls, env
reads, prototype monkey-patching.

## Don't touch

- `packages/schemas/src/document/`, `packages/schemas/src/enum/` — **generated**, gitignored.
  Edit `.fbs` instead and run `compile_fbs`.
- The high-level switch statements in
  [serialize.ts](../packages/buffer/src/serialize.ts),
  [deserialize.ts](../packages/buffer/src/deserialize.ts),
  [structurize.ts](../packages/buffer/src/structurize.ts) — they branch on `StructType`
  and must stay in lockstep with [StructType.ts](../packages/buffer/src/StructType.ts).
  Adding a new struct = update all four files in one commit.

## Testing

- Jest runs against compiled JS (`tst/`), not TS source — see [development.md](development.md#test).
- One `.test.ts` per source file, next to the source.
- `describe(functionName, …)` then `it("should …", …)`. Group by behavior, not by setup.
- Cover the round-trip for any new `bufferify*` / `objectify*` (serialize → bytes →
  deserialize → expect.toEqual). The existing tests are the template.

## Commits & PRs

- The repo does not require a particular commit-message format; `git log` shows mixed
  imperative and descriptive. Mirror nearby commits.
- Avoid landing changes that span generated files unless you also re-ran codegen — a stale
  `src/document/` will silently desync the wire format.

## Apache header

Every file opens with:

```ts
/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */
```

Keep it. ESLint doesn't enforce it, but it is uniform across the codebase.

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type { parseHDML } from "@hdml/parser";
import type { serialize, StructType } from "@hdml/buffer";
import type { bytesToBase64 } from "@hdml/hash";
import type { Connection, Model, Frame } from "@hdml/types";

/**
 * A single named element in the parser manifest: the bare element
 * `name` plus the base64 of its individually-serialized FlatBuffer.
 */
export interface ManifestEntry {
  name: string;
  content: string;
}

/**
 * The RFC 004 §3.1 parser manifest — each HDML element split into
 * its own base64-encoded FlatBuffer, grouped by kind.
 */
export interface Manifest {
  connections: ManifestEntry[];
  models: ManifestEntry[];
  frames: ManifestEntry[];
}

/**
 * A structured parse/serialize failure. `error` is a stable code
 * (`empty_source` | `parse_failed` | `serialize_failed`); `detail`
 * carries the underlying message when one is available.
 */
export interface ManifestError {
  error: string;
  detail?: string;
}

/**
 * The `@hdml/*` functions {@link buildManifest} needs, injected so
 * the WASM bin entry can resolve them from `globalThis` (provided by
 * the Javy plugin) while tests pass the real implementations in
 * directly.
 */
export interface ManifestDeps {
  parseHDML: typeof parseHDML;
  serialize: typeof serialize;
  bytesToBase64: typeof bytesToBase64;
  StructType: typeof StructType;
}

/**
 * Builds the RFC 004 §3.1 manifest from an HDML source string:
 * `parseHDML` → per-element `serialize` → base64, grouped into
 * `{ connections, models, frames }`. Never throws — returns a
 * {@link ManifestError} for an empty source, a parse failure, or a
 * serialize failure.
 *
 * @param deps The injected `@hdml/*` functions
 * (see {@link ManifestDeps}).
 * @param source The raw HDML HTML source string.
 * @returns The {@link Manifest}, or a {@link ManifestError}.
 */
export function buildManifest(
  deps: ManifestDeps,
  source: string,
): Manifest | ManifestError {
  if (!source) {
    return { error: "empty_source" };
  }
  let hdom: ReturnType<typeof parseHDML>;
  try {
    hdom = deps.parseHDML(source);
  } catch (e) {
    return { error: "parse_failed", detail: message(e) };
  }
  try {
    return {
      connections: hdom.connections.map((c) =>
        encode(deps, c, deps.StructType.ConnectionStruct),
      ),
      models: hdom.models.map((m) =>
        encode(deps, m, deps.StructType.ModelStruct),
      ),
      frames: hdom.frames.map((f) =>
        encode(deps, f, deps.StructType.FrameStruct),
      ),
    };
  } catch (e) {
    return { error: "serialize_failed", detail: message(e) };
  }
}

/**
 * Serializes a single element to its FlatBuffer and wraps it as a
 * {@link ManifestEntry} keyed by the element's bare `name`.
 */
function encode(
  deps: ManifestDeps,
  element: Connection | Model | Frame,
  type: StructType,
): ManifestEntry {
  const bytes = deps.serialize(element, type);
  return {
    name: element.name,
    content: deps.bytesToBase64(bytes),
  };
}

/**
 * Extracts a human-readable message from an unknown thrown value.
 */
function message(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

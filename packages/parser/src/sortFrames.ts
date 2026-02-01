/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import type { Frame } from "@hdml/types";

/** Parsed frame source: path prefix, type (model/frame), ref name. */
interface ParsedSource {
  pathPrefix: "/" | "?";
  type: "model" | "frame";
  name: string;
}

/** Group 1–4 for ordering. */
type SourceGroup = 1 | 2 | 3 | 4;

/**
 * Extracts the value of a query param from a string (from `=` until
 * `&` or end).
 *
 * @param s - String containing param=value
 * @param param - Param name including "=", e.g. "hdml-model="
 * @returns Extracted value or empty string
 */
function extractParam(s: string, param: string): string {
  const idx = s.indexOf(param);
  if (idx === -1) return "";
  const start = idx + param.length;
  const end = s.indexOf("&", start);
  return end === -1 ? s.slice(start) : s.slice(start, end);
}

/**
 * Parses a frame source string into path prefix, type, and referenced
 * name. Supports: `/path?hdml-model=x`, `/path?hdml-frame=x`,
 * `?hdml-model=x`, `?hdml-frame=x`.
 *
 * @param source - The frame source string
 * @returns Parsed result or null if format is not recognized
 */
function parseSource(source: string): ParsedSource | null {
  const trimmed = source.trim();
  if (trimmed.startsWith("/")) {
    const modelName = extractParam(trimmed, "?hdml-model=");
    const frameName = extractParam(trimmed, "?hdml-frame=");
    if (modelName) {
      return { pathPrefix: "/", type: "model", name: modelName };
    }
    if (frameName) {
      return { pathPrefix: "/", type: "frame", name: frameName };
    }
    return null;
  }
  if (trimmed.startsWith("?")) {
    const modelName = extractParam(trimmed, "hdml-model=");
    const frameName = extractParam(trimmed, "hdml-frame=");
    if (modelName) {
      return { pathPrefix: "?", type: "model", name: modelName };
    }
    if (frameName) {
      return { pathPrefix: "?", type: "frame", name: frameName };
    }
    return null;
  }
  return null;
}

/**
 * Returns the source group (1–4) for a parsed source.
 *
 * @param p - Parsed source
 * @returns Group number
 */
function getGroup(p: ParsedSource): SourceGroup {
  if (p.pathPrefix === "/" && p.type === "model") return 1;
  if (p.pathPrefix === "/" && p.type === "frame") return 2;
  if (p.pathPrefix === "?" && p.type === "model") return 3;
  return 4;
}

/**
 * Sorts an array of frames into a safe processing order. Order: (1)
 * frames sourcing from models with path `/`, (2) frames sourcing from
 * frames with path `/`, (3) frames sourcing from models with path
 * `?`, (4) frames sourcing from frames with path `?` (by dependency
 * then alphabetically). Within groups 1–3, frames are sorted
 * alphabetically by name. Frames that do not match the expected
 * source format are placed at the end.
 *
 * @param frames - Array of Frame objects to sort
 * @returns New array of frames in safe processing order
 *
 * @example
 * ```ts
 * const sorted = sortFrames(frames);
 * for (const frame of sorted) processFrame(frame);
 * ```
 */
export function sortFrames(frames: readonly Frame[]): Frame[] {
  const allNames = new Set(frames.map((f) => f.name));
  const withMeta = frames.map((frame) => {
    const parsed = parseSource(frame.source);
    const group: SourceGroup | 0 = parsed ? getGroup(parsed) : 0;
    const sourceName = parsed?.name ?? "";
    return { frame, parsed, group, sourceName };
  });

  const group1 = withMeta
    .filter((m) => m.group === 1)
    .sort((a, b) => a.frame.name.localeCompare(b.frame.name))
    .map((m) => m.frame);
  const group2 = withMeta
    .filter((m) => m.group === 2)
    .sort((a, b) => a.frame.name.localeCompare(b.frame.name))
    .map((m) => m.frame);
  const group3 = withMeta
    .filter((m) => m.group === 3)
    .sort((a, b) => a.frame.name.localeCompare(b.frame.name))
    .map((m) => m.frame);
  const group4Meta = withMeta.filter((m) => m.group === 4);
  const unparseable = withMeta
    .filter((m) => m.group === 0)
    .map((m) => m.frame);

  const available = new Set<string>();
  for (const m of withMeta) {
    if (m.group === 1 || m.group === 2 || m.group === 3) {
      available.add(m.frame.name);
    }
  }
  const group4Ordered: Frame[] = [];
  let remaining = [...group4Meta];
  let prevSize = -1;
  while (remaining.length > 0 && remaining.length !== prevSize) {
    prevSize = remaining.length;
    const canPlace = remaining.filter(
      (m) =>
        available.has(m.sourceName) || !allNames.has(m.sourceName),
    );
    const next = canPlace
      .sort((a, b) => a.frame.name.localeCompare(b.frame.name))
      .map((m) => m.frame);
    group4Ordered.push(...next);
    for (const m of canPlace) available.add(m.frame.name);
    remaining = remaining.filter(
      (m) => !canPlace.some((c) => c.frame.name === m.frame.name),
    );
  }
  const rest = remaining
    .sort((a, b) => a.frame.name.localeCompare(b.frame.name))
    .map((m) => m.frame);
  group4Ordered.push(...rest);

  return [
    ...group1,
    ...group2,
    ...group3,
    ...group4Ordered,
    ...unparseable,
  ];
}

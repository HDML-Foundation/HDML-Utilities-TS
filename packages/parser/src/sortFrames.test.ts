/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { FilterOperatorEnum } from "@hdml/schemas";
import type { Frame } from "@hdml/types";
import { sortFrames } from "./sortFrames";

const minimalFilterBy = {
  type: FilterOperatorEnum.And,
  filters: [],
  children: [],
};

function frame(name: string, source: string): Frame {
  return {
    name,
    description: null,
    source,
    offset: 0,
    limit: 100000,
    fields: [],
    filter_by: minimalFilterBy,
    group_by: [],
    split_by: [],
    sort_by: [],
  };
}

describe("sortFrames", () => {
  it("returns empty array when given empty array", () => {
    expect(sortFrames([])).toEqual([]);
  });

  it("places group 1 (path /, model) first, sorted by name", () => {
    const m = frame("m", "/x.html?hdml-model=m3");
    const z = frame("z", "/x.html?hdml-model=m2");
    const a = frame("a", "/x.html?hdml-model=m1");
    expect(sortFrames([z, m, a])).toEqual([a, m, z]);
  });

  it("places group 2 (path /, frame) after group 1, sorted by name", () => {
    const f1 = frame("f1", "/x.html?hdml-model=model_a");
    const f2z = frame("f2z", "/x.html?hdml-frame=f1");
    const f2a = frame("f2a", "/x.html?hdml-frame=f1");
    expect(sortFrames([f2z, f1, f2a])).toEqual([f1, f2a, f2z]);
  });

  it("places group 3 (path ?, model) after group 2, sorted by name", () => {
    const g1 = frame("g1", "/p?hdml-model=m");
    const g3b = frame("g3b", "?hdml-model=local_m2");
    const g3a = frame("g3a", "?hdml-model=local_m");
    const g2 = frame("g2", "/p?hdml-frame=g1");
    expect(sortFrames([g3b, g3a, g2, g1])).toEqual([
      g1,
      g2,
      g3a,
      g3b,
    ]);
  });

  it("places group 4 (path ?, frame) after group 3", () => {
    const c = frame("c", "?hdml-frame=a");
    const b = frame("b", "?hdml-model=m2");
    const a = frame("a", "/f?hdml-model=m");
    expect(sortFrames([c, b, a])).toEqual([a, b, c]);
  });

  it("orders group 4 by dependency: dependents of 1–3 first", () => {
    const local = frame("local", "?hdml-frame=f1");
    const f1 = frame("f1", "/f?hdml-frame=m");
    const m = frame("m", "/f?hdml-model=x");
    expect(sortFrames([local, f1, m])).toEqual([m, f1, local]);
  });

  it("orders group 4 by dependency: multiple layers", () => {
    const top = frame("top", "?hdml-frame=mid");
    const mid = frame("mid", "?hdml-frame=base");
    const base = frame("base", "/f?hdml-model=x");
    expect(sortFrames([top, base, mid])).toEqual([base, mid, top]);
  });

  it("sorts group 4 alphabetically within same dependency level", () => {
    const base = frame("base", "/f?hdml-model=x");
    const midZ = frame("midZ", "?hdml-frame=base");
    const midA = frame("midA", "?hdml-frame=base");
    expect(sortFrames([midZ, base, midA])).toEqual([
      base,
      midA,
      midZ,
    ]);
  });

  it("places frames with unrecognized source at the end", () => {
    const invalid = frame("inv", "plain_name");
    const valid = frame("v", "/f?hdml-model=m");
    expect(sortFrames([invalid, valid])).toEqual([valid, invalid]);
  });

  it("handles source with extra query params", () => {
    const f = frame(
      "f",
      "/path/file.html?hdml-model=my_model&other=value",
    );
    expect(sortFrames([f])).toEqual([f]);
    const f2 = frame("f2", "?hdml-frame=other&foo=bar");
    expect(sortFrames([f2])).toEqual([f2]);
  });

  it("does not mutate the input array", () => {
    const input = [
      frame("b", "/f?hdml-model=m"),
      frame("a", "/f?hdml-model=m2"),
    ];
    const copy = [...input];
    sortFrames(input);
    expect(input).toEqual(copy);
  });

  it("produces correct full order for mixed groups", () => {
    const g1b = frame("g1b", "/f?hdml-model=m1");
    const g1a = frame("g1a", "/f?hdml-model=m2");
    const g2b = frame("g2b", "/f?hdml-frame=g1a");
    const g2a = frame("g2a", "/f?hdml-frame=g1a");
    const g3b = frame("g3b", "?hdml-model=lm1");
    const g3a = frame("g3a", "?hdml-model=lm2");
    const g4c = frame("g4c", "?hdml-frame=g3a");
    const g4b = frame("g4b", "?hdml-frame=g3a");
    const g4a = frame("g4a", "?hdml-frame=g2a");
    const input = [g4c, g4b, g4a, g3b, g3a, g2b, g2a, g1b, g1a];
    const result = sortFrames(input);
    expect(result).toEqual([
      g1a,
      g1b,
      g2a,
      g2b,
      g3a,
      g3b,
      g4a,
      g4b,
      g4c,
    ]);
  });
});

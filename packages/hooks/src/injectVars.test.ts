/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  injectVars,
  injectObjectVars,
  UndefinedEnvError,
  UndefinedScopeError,
} from "./injectVars";

describe("injectVars", () => {
  it("substitutes ${env.VAR}", () => {
    expect(injectVars("${env.A}", { A: "x" }, {})).toBe("x");
  });

  it("substitutes ${scope.FIELD}", () => {
    expect(injectVars("${scope.s}", {}, { s: "y" })).toBe("y");
  });

  it("coerces non-string scope values", () => {
    expect(injectVars("${scope.n}", {}, { n: 42 })).toBe("42");
  });

  it("un-escapes $${env.A} to literal ${env.A}", () => {
    expect(injectVars("$${env.A}", { A: "x" }, {})).toBe("${env.A}");
  });

  it("resolves env and scope in one value", () => {
    expect(
      injectVars("${env.A}-${scope.b}", { A: "x" }, { b: "z" }),
    ).toBe("x-z");
  });

  it("passes an unknown namespace through verbatim", () => {
    expect(injectVars("${other.x}", {}, {})).toBe("${other.x}");
  });

  it("throws UndefinedEnvError on a missing env var", () => {
    expect(() => injectVars("${env.A}", {}, {})).toThrow(
      UndefinedEnvError,
    );
    try {
      injectVars("${env.MISSING}", {}, {});
    } catch (e) {
      expect((e as UndefinedEnvError).variable).toBe("MISSING");
    }
  });

  it("throws UndefinedScopeError on a missing scope var", () => {
    expect(() => injectVars("${scope.s}", {}, {})).toThrow(
      UndefinedScopeError,
    );
    try {
      injectVars("${scope.region}", {}, {});
    } catch (e) {
      expect((e as UndefinedScopeError).variable).toBe("region");
    }
  });

  it("treats a nullish scope value as undefined", () => {
    expect(() =>
      injectVars("${scope.s}", {}, { s: undefined }),
    ).toThrow(UndefinedScopeError);
  });

  it("rejects a non-coercible (object) scope value", () => {
    expect(() => injectVars("${scope.s}", {}, { s: {} })).toThrow(
      /not coercible/,
    );
  });
});

describe("injectObjectVars", () => {
  it("replaces ${…} in nested string fields, in place", () => {
    const obj = {
      name: "f",
      limit: 100,
      clause: "`open` > ${env.MIN}",
      nested: { value: "${scope.cap}", flag: true },
      list: ["${env.MIN}", "plain", 7],
    };
    injectObjectVars(obj, { MIN: "5" }, { cap: "10" });
    expect(obj.clause).toBe("`open` > 5");
    expect(obj.nested.value).toBe("10");
    expect(obj.list[0]).toBe("5");
    // Non-string and template-free values are untouched.
    expect(obj.limit).toBe(100);
    expect(obj.nested.flag).toBe(true);
    expect(obj.list[1]).toBe("plain");
    expect(obj.list[2]).toBe(7);
  });

  it("propagates an undefined-var error from a nested field", () => {
    expect(() =>
      injectObjectVars({ a: { b: "${env.X}" } }, {}, {}),
    ).toThrow(UndefinedEnvError);
  });
});

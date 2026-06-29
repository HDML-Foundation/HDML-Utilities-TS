/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { parseHDML, parseHTML } from "@hdml/parser";
import {
  serialize,
  deserialize,
  structurize,
  StructType,
} from "@hdml/buffer";
import { bytesToBase64, base64ToBytes } from "@hdml/hash";
import {
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
  getModelSQL,
  getFrameSQL,
} from "@hdml/stringifier";
import {
  CompilerDeps,
  CompilerInput,
  CompilerResult,
  CompilerError,
} from "./compileConnections";
import type { AdaptationPolicy } from "./adaptation";
import { applyAdaptation, AdaptationError } from "./applyAdaptation";
import { compileSql } from "./compileSql";

// A small whole-document fixture: a model-adjacent frame with two
// fields, one of them the `salary` the broad-then-specific rules
// target. Adaptation selectors run over this assembled DOM.
const fixtureHTML = `<hdml-frame name="f" source="?hdml-model=m"><hdml-field name="open"></hdml-field><hdml-field name="salary"></hdml-field></hdml-frame>`;

/** Wraps one role's rules into the lowercase policy shape. */
function policyFor(
  role: string,
  rules: AdaptationPolicy["roles"][string],
): AdaptationPolicy {
  return { roles: { [role]: rules } };
}

describe("applyAdaptation", () => {
  it("remove-element deletes the matched subtree", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(
      dom,
      policyFor("analyst", [
        {
          selector: "hdml-field[name='salary']",
          action: "remove-element",
        },
      ]),
      "analyst",
    );
    const out = dom.toString();
    expect(out).not.toContain('name="salary"');
    expect(out).toContain('name="open"');
  });

  it("remove-element on a frame takes its whole subtree", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(
      dom,
      policyFor("analyst", [
        { selector: "hdml-frame", action: "remove-element" },
      ]),
      "analyst",
    );
    expect(dom.toString().trim()).toBe("");
  });

  it("set-attribute writes a new attribute", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(
      dom,
      policyFor("analyst", [
        {
          selector: "hdml-field[name='salary']",
          action: "set-attribute",
          attribute: "type",
          value: "decimal",
        },
      ]),
      "analyst",
    );
    expect(dom.toString()).toContain(
      '<hdml-field name="salary" type="decimal">',
    );
  });

  it("set-attribute overwrites a structural attribute (D6)", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(
      dom,
      policyFor("analyst", [
        {
          selector: "hdml-frame",
          action: "set-attribute",
          attribute: "source",
          value: "?hdml-frame=other",
        },
      ]),
      "analyst",
    );
    const out = dom.toString();
    expect(out).toContain('source="?hdml-frame=other"');
    expect(out).not.toContain('source="?hdml-model=m"');
  });

  it("coerces a non-string value via String() (D2)", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(
      dom,
      policyFor("analyst", [
        {
          selector: "hdml-frame",
          action: "set-attribute",
          attribute: "limit",
          value: 50,
        },
      ]),
      "analyst",
    );
    expect(dom.toString()).toContain('limit="50"');
  });

  it("applies within-role rules in array order (broad then specific)", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(
      dom,
      policyFor("analyst", [
        {
          selector: "hdml-field",
          action: "set-attribute",
          attribute: "type",
          value: "string",
        },
        {
          selector: "hdml-field[name='salary']",
          action: "set-attribute",
          attribute: "type",
          value: "decimal",
        },
      ]),
      "analyst",
    );
    const out = dom.toString();
    // The broad rule typed every field string; the later specific
    // rule overwrote salary — array order is the resolution (D5).
    expect(out).toContain('<hdml-field name="open" type="string">');
    expect(out).toContain(
      '<hdml-field name="salary" type="decimal">',
    );
  });

  it("is identity when policy is absent (D5)", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(dom, undefined, "analyst");
    expect(dom.toString()).toBe(fixtureHTML);
  });

  it("is identity when the role is not in the policy (D5)", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(
      dom,
      policyFor("admin", [
        { selector: "hdml-field", action: "remove-element" },
      ]),
      "analyst",
    );
    expect(dom.toString()).toBe(fixtureHTML);
  });

  it("is identity when a selector matches nothing (D5)", () => {
    const dom = parseHTML(fixtureHTML);
    applyAdaptation(
      dom,
      policyFor("analyst", [
        { selector: "hdml-measure", action: "remove-element" },
      ]),
      "analyst",
    );
    expect(dom.toString()).toBe(fixtureHTML);
  });

  it("throws AdaptationError on a bad selector (D3)", () => {
    const dom = parseHTML(fixtureHTML);
    expect(() =>
      applyAdaptation(
        dom,
        policyFor("analyst", [
          { selector: ":::bad", action: "remove-element" },
        ]),
        "analyst",
      ),
    ).toThrow(AdaptationError);
  });

  it("throws AdaptationError on an unknown action (D3)", () => {
    const dom = parseHTML(fixtureHTML);
    expect(() =>
      applyAdaptation(
        dom,
        policyFor("analyst", [
          {
            selector: "hdml-field",
            action: "frobnicate" as never,
          },
        ]),
        "analyst",
      ),
    ).toThrow(AdaptationError);
  });
});

// The shared seam runs inside the `sql` branch before injection, so a
// `${scope.*}` forced into an attribute value still resolves.
const modelHDML = `
  <hdml-model name="m_stock">
    <hdml-table
      name="amazon"
      type="table"
      identifier="\`pg\`.\`public\`.\`amazon_stock\`">
      <hdml-field name="open"></hdml-field>
      <hdml-field name="close"></hdml-field>
    </hdml-table>
  </hdml-model>
`;

const frameHDML = `
  <hdml-frame name="inner" source="?hdml-model=m_stock"
    limit="100" offset="0">
    <hdml-field name="open"></hdml-field>
    <hdml-field name="close"></hdml-field>
    <hdml-filter-by>
      <hdml-connective operator="and">
        <hdml-filter type="expr" clause="open > 0"></hdml-filter>
      </hdml-connective>
    </hdml-filter-by>
  </hdml-frame>
`;

const deps: CompilerDeps = {
  deserialize,
  serialize,
  structurize,
  base64ToBytes,
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
  getModelSQL,
  getFrameSQL,
  parseHTML,
  parseHDML,
  StructType,
};

function modelB64(html: string): string {
  const model = parseHDML(html).models[0];
  return bytesToBase64(serialize(model, StructType.ModelStruct));
}

function frameB64(html: string): string {
  const frame = parseHDML(html).frames[0];
  return bytesToBase64(serialize(frame, StructType.FrameStruct));
}

describe("applyAdaptation via the sql branch", () => {
  it("resolves a ${scope.*} forced into an attribute (before injection)", () => {
    const input: CompilerInput = {
      model: modelB64(modelHDML),
      frames: [frameB64(frameHDML)],
      output: "sql",
      env: {},
      scope: { cap: "10" },
      role: "analyst",
      adaptation_policy: policyFor("analyst", [
        {
          selector: "hdml-filter",
          action: "set-attribute",
          attribute: "clause",
          value: "open > ${scope.cap}",
        },
      ]),
    };
    const out = compileSql(deps, input) as CompilerResult;
    const sql = out.result[0];
    // adaptation forced the clause, then injection substituted scope.
    expect(sql).toContain("open > 10");
    expect(sql).not.toContain("${scope.");
  });

  it("maps a bad selector to adaptation_failed (D3)", () => {
    const out = compileSql(deps, {
      model: modelB64(modelHDML),
      frames: [frameB64(frameHDML)],
      output: "sql",
      env: {},
      scope: { cap: "10" },
      role: "analyst",
      adaptation_policy: policyFor("analyst", [
        { selector: ":::bad", action: "remove-element" },
      ]),
    }) as CompilerError;
    expect(out.error).toBe("adaptation_failed");
  });

  it("maps an unknown action to adaptation_failed (D3)", () => {
    const out = compileSql(deps, {
      model: modelB64(modelHDML),
      frames: [frameB64(frameHDML)],
      output: "sql",
      env: {},
      scope: { cap: "10" },
      role: "analyst",
      adaptation_policy: policyFor("analyst", [
        { selector: "hdml-field", action: "frobnicate" as never },
      ]),
    }) as CompilerError;
    expect(out.error).toBe("adaptation_failed");
  });
});

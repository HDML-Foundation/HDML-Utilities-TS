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
import { compile } from "./compile";
import { compileSource } from "./compileSource";
import { compileEffective } from "./compileEffective";

const modelHDML = `
  <hdml-model name="m_stock">
    <hdml-table
      name="amazon"
      type="table"
      identifier="\`pg\`.\`public\`.\`amazon_stock\`">
      <hdml-field name="open"></hdml-field>
      <hdml-field name="salary"></hdml-field>
    </hdml-table>
  </hdml-model>
`;

const frameHDML = `
  <hdml-frame name="inner" source="?hdml-model=m_stock"
    limit="100" offset="0">
    <hdml-field name="open"></hdml-field>
    <hdml-field name="salary"></hdml-field>
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

/** Serializes the first parsed model to a base64 `ModelStruct`. */
function modelB64(html: string): string {
  const model = parseHDML(html).models[0];
  return bytesToBase64(serialize(model, StructType.ModelStruct));
}

/** Serializes the first parsed frame to a base64 `FrameStruct`. */
function frameB64(html: string): string {
  const frame = parseHDML(html).frames[0];
  return bytesToBase64(serialize(frame, StructType.FrameStruct));
}

/** Wraps one role's rules into the lowercase policy shape. */
function policyFor(
  role: string,
  rules: AdaptationPolicy["roles"][string],
): AdaptationPolicy {
  return { roles: { [role]: rules } };
}

const closure = (): CompilerInput => ({
  model: modelB64(modelHDML),
  frames: [frameB64(frameHDML)],
  output: "effective",
});

describe("compileEffective", () => {
  it("is byte-identical to source with no policy / role (D2/D5)", () => {
    const src = compileSource(deps, {
      ...closure(),
      output: "source",
    }) as CompilerResult;
    const eff = compileEffective(deps, closure()) as CompilerResult;
    expect(eff.result).toHaveLength(1);
    expect(eff.result[0]).toBe(src.result[0]);
  });

  it("applies remove-element + set-attribute mutations", () => {
    const out = compileEffective(deps, {
      ...closure(),
      role: "analyst",
      adaptation_policy: policyFor("analyst", [
        {
          selector: "hdml-frame hdml-field[name='salary']",
          action: "remove-element",
        },
        {
          selector: "hdml-frame hdml-field[name='open']",
          action: "set-attribute",
          attribute: "type",
          value: "decimal",
        },
      ]),
    }) as CompilerResult;
    expect(out.result).toHaveLength(1);
    const html = out.result[0];
    // The removed field is gone from the frame; the forced attribute
    // landed on the surviving one.
    expect(html).toContain('<hdml-field name="open" type="decimal">');
    // salary remains in the model, but not inside the frame.
    const frameStart = html.indexOf("<hdml-frame");
    expect(html.slice(frameStart)).not.toContain('name="salary"');
  });

  it("leaves ${scope.*} / ${env.*} literal — no injection (D2)", () => {
    const out = compileEffective(deps, {
      ...closure(),
      env: { region: "eu" },
      scope: { department: "sales" },
      role: "analyst",
      adaptation_policy: policyFor("analyst", [
        {
          selector: "hdml-frame hdml-field[name='open']",
          action: "set-attribute",
          attribute: "clause",
          value: "open > ${scope.department} and r = ${env.region}",
        },
      ]),
    }) as CompilerResult;
    const html = out.result[0];
    expect(html).toContain("${scope.department}");
    expect(html).toContain("${env.region}");
  });

  it("is lenient with no model — no missing_model gate", () => {
    const out = compileEffective(deps, {
      frames: [frameB64(frameHDML)],
      output: "effective",
    }) as CompilerResult;
    expect(out.result).toHaveLength(1);
    expect(out.result[0]).toContain('<hdml-frame name="inner"');
  });

  it("fails with structurize_failed on a malformed struct", () => {
    const out = compileEffective(deps, {
      model: modelB64(modelHDML),
      frames: ["not-a-valid-struct"],
      output: "effective",
    }) as CompilerError;
    expect(out.error).toBe("structurize_failed");
  });

  it("fails with adaptation_failed on a bad selector (D3)", () => {
    const out = compileEffective(deps, {
      ...closure(),
      role: "analyst",
      adaptation_policy: policyFor("analyst", [
        { selector: ":::bad", action: "remove-element" },
      ]),
    }) as CompilerError;
    expect(out.error).toBe("adaptation_failed");
  });
});

describe("compile dispatch", () => {
  it("routes effective mode to compileEffective", () => {
    const out = compile(deps, closure()) as CompilerResult;
    expect(out.result).toHaveLength(1);
    expect(out.result[0]).toContain('<hdml-model name="m_stock">');
  });
});

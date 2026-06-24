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
import { compile } from "./compile";
import { compileSql } from "./compileSql";

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

// Model-adjacent frame, with env + scope refs in its filter. Source
// uses the canonical `?hdml-*=` form so the re-parse's sortFrames can
// re-derive the chain order.
const innerFrameHDML = `
  <hdml-frame name="inner" source="?hdml-model=m_stock"
    limit="100" offset="0">
    <hdml-field name="open"></hdml-field>
    <hdml-field name="close"></hdml-field>
    <hdml-filter-by>
      <hdml-connective operator="and">
        <hdml-filter
          type="expr"
          clause="open > \${env.MIN} and close < \${scope.cap}">
        </hdml-filter>
      </hdml-connective>
    </hdml-filter-by>
  </hdml-frame>
`;

// Leaf (requested) frame — the chain's outermost SELECT.
const outerFrameHDML = `
  <hdml-frame name="outer" source="?hdml-frame=inner"
    limit="50" offset="0">
    <hdml-field name="open"></hdml-field>
    <hdml-field name="close"></hdml-field>
  </hdml-frame>
`;

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

/** A single-frame `sql` envelope sourcing straight from the model. */
function singleFrameInput(
  extra: Partial<CompilerInput> = {},
): CompilerInput {
  return {
    model: modelB64(modelHDML),
    frames: [frameB64(innerFrameHDML)],
    output: "sql",
    env: { MIN: "5" },
    scope: { cap: "10" },
    ...extra,
  };
}

describe("compileSql", () => {
  it("injects env + scope into the composed WITH … SELECT", () => {
    const out = compileSql(
      deps,
      singleFrameInput(),
    ) as CompilerResult;
    expect(out.result).toHaveLength(1);
    const sql = out.result[0];
    expect(sql).toContain('with "m_stock" as (');
    expect(sql).toContain("select");
    expect(sql).toContain("open > 5 and close < 10");
    expect(sql).not.toContain("${env.");
    expect(sql).not.toContain("${scope.");
  });

  it("composes the full chain (leaf wraps inner wraps model)", () => {
    const out = compileSql(deps, {
      model: modelB64(modelHDML),
      frames: [frameB64(outerFrameHDML), frameB64(innerFrameHDML)],
      output: "sql",
      env: { MIN: "5" },
      scope: { cap: "10" },
    }) as CompilerResult;
    const sql = out.result[0];
    // The projection layer is the outermost wrapper. Inside it, the
    // re-parse's sortFrames re-derives the order from `source`
    // (model-adjacent first), and the forward fold wraps each frame
    // over the previous. getFrameSQL names a frame's CTE/FROM after
    // its *parent*, so a frame's own name never appears: the
    // model-adjacent ("inner") CTE wraps the model ("m_stock") CTE.
    expect(sql.startsWith("with _projection as (")).toBe(true);
    expect(sql.indexOf('"inner"')).toBeLessThan(
      sql.indexOf('"m_stock"'),
    );
    expect(sql).not.toContain('"outer"');
    expect(sql.trimEnd().endsWith("from _projection")).toBe(true);
    expect(sql).toContain("limit 50"); // leaf frame's limit, nested
    // Nested CTEs indent with depth via the level param: the
    // projection is level 0, the leaf-chain CTE one level (2 spaces)
    // in, the wrapped model CTE two levels (4 spaces) in.
    expect(sql).toContain('\n  with "inner" as (');
    expect(sql).toContain('\n    with "m_stock" as (');
  });

  it("returns undefined_env for a missing env var", () => {
    const out = compileSql(
      deps,
      singleFrameInput({ env: {} }),
    ) as CompilerError;
    expect(out.error).toBe("undefined_env");
    expect(out.variable).toBe("MIN");
  });

  it("returns undefined_scope for a missing scope var", () => {
    const out = compileSql(
      deps,
      singleFrameInput({ scope: {} }),
    ) as CompilerError;
    expect(out.error).toBe("undefined_scope");
    expect(out.variable).toBe("cap");
  });

  it("wraps columns as a top-level WITH _projection", () => {
    const out = compileSql(
      deps,
      singleFrameInput({ columns: ["open", "close"] }),
    ) as CompilerResult;
    const sql = out.result[0];
    expect(sql).toContain("with _projection as (");
    expect(sql).toContain('select "open", "close"');
    expect(sql).toContain("from _projection");
    // Top-level WITH form, never a SELECT … FROM (subquery).
    expect(sql).not.toMatch(/from\s*\(/i);
  });

  it("projects a subset of the frame fields", () => {
    const out = compileSql(
      deps,
      singleFrameInput({ columns: ["open"] }),
    ) as CompilerResult;
    const sql = out.result[0];
    expect(sql).toContain('select "open"');
    expect(sql).toContain("from _projection");
  });

  it("projects select * when columns is empty or omitted", () => {
    const omitted = compileSql(
      deps,
      singleFrameInput(),
    ) as CompilerResult;
    const empty = compileSql(
      deps,
      singleFrameInput({ columns: [] }),
    ) as CompilerResult;
    expect(empty.result[0]).toBe(omitted.result[0]);
    expect(empty.result[0]).toContain("with _projection as (");
    expect(empty.result[0]).toContain("select *");
    expect(empty.result[0]).toContain("from _projection");
  });

  it("returns missing_model when no model is supplied", () => {
    const out = compileSql(deps, {
      frames: [frameB64(innerFrameHDML)],
      output: "sql",
    }) as CompilerError;
    expect(out.error).toBe("missing_model");
  });

  it("returns structurize_failed on a malformed frame", () => {
    const out = compileSql(deps, {
      model: modelB64(modelHDML),
      frames: ["not-a-valid-struct"],
      output: "sql",
    }) as CompilerError;
    expect(out.error).toBe("structurize_failed");
  });
});

describe("compile dispatch", () => {
  it("routes sql mode to compileSql", () => {
    const out = compile(deps, singleFrameInput()) as CompilerResult;
    expect(out.result).toHaveLength(1);
    expect(out.result[0]).toContain('with "m_stock" as (');
  });
});

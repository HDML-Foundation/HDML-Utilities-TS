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

// ── Adaptation boundary fixtures (O10) ──────────────────────────
// Every case below sits over one physical table,
// `pg.public.employees`, whose `salary` is the sensitive column. The
// field list is the experiment, so the models are built rather than
// spelled out: the difference between two cases is then the only
// thing that differs on screen.

/** A one-table model over the physical `employees` table. */
function empModelHDML(fields: string): string {
  return `
    <hdml-model name="m_emp">
      <hdml-table
        name="employees"
        type="table"
        identifier="\`pg\`.\`public\`.\`employees\`">
        ${fields}
      </hdml-table>
    </hdml-model>
  `;
}

/** A frame named `name` over `source`, projecting `fields`. */
function empFrameHDML(
  name: string,
  source: string,
  fields: string,
): string {
  return `
    <hdml-frame name="${name}" source="${source}"
      limit="50" offset="0">
      ${fields}
    </hdml-frame>
  `;
}

/** A single-role `remove-element` policy for the role `analyst`. */
function removePolicy(selector: string): AdaptationPolicy {
  return {
    roles: { analyst: [{ selector, action: "remove-element" }] },
  };
}

/**
 * The select list a frame projects over `source`: everything between
 * that frame's own `select` and its `from "<source>"`. A frame
 * extending it can resolve exactly these aliases and nothing else,
 * which is the whole of why a frame is a boundary and a model is not.
 */
function projectionOver(sql: string, source: string): string {
  const fromAt = sql.search(new RegExp(`from\\s+"${source}"`));
  if (fromAt < 0) {
    throw new Error(`no 'from "${source}"' in:\n${sql}`);
  }
  return sql.slice(sql.lastIndexOf("select", fromAt), fromAt);
}

describe("adaptation boundary (O10)", () => {
  it("LEAKS a removed model field through a sibling's clause", () => {
    // O10, row 1. `remove-element` deletes a field *declaration*, not
    // a physical column: getPlainClauseSQL returns the `clause`
    // verbatim (stringifier field.ts:96-102), so a surviving sibling
    // still reads `salary` off the physical table. Asserted as it is,
    // not as it should be (C8) — the fix lives in WASM and is out of
    // Slice C's scope. The rule that replaces it is prose:
    // docs/contracts/authorization.md — put the policy on the
    // security frame, not on the model.
    const out = compileSql(deps, {
      model: modelB64(
        empModelHDML(`
          <hdml-field name="emp_name" origin="name"></hdml-field>
          <hdml-field name="salary"></hdml-field>
          <hdml-field name="shadow" clause="salary * 1"></hdml-field>
        `),
      ),
      frames: [
        frameB64(
          empFrameHDML(
            "f_emp",
            "?hdml-model=m_emp",
            `<hdml-field name="employees_emp_name"></hdml-field>
             <hdml-field name="employees_shadow"></hdml-field>`,
          ),
        ),
      ],
      output: "sql",
      adaptation_policy: removePolicy(
        "hdml-table hdml-field[name='salary']",
      ),
      role: "analyst",
    }) as CompilerResult;
    const sql = out.result[0];
    // Half one — adaptation did remove the declaration. Without this
    // the second half proves nothing: a policy that matched nothing
    // would pass it.
    expect(sql).not.toContain('"employees_salary"');
    expect(sql).not.toContain('"salary" as "salary"');
    // Half two — and the column is still read, under the sibling's
    // alias, inside the model CTE.
    expect(sql).toContain('salary * 1 as "shadow"');
  });

  it("LEAKS a removed model field through a sibling's origin, with no clause in the document", () => {
    // O10, row 1 again — and this is the case that surprises. No
    // `clause` is involved anywhere in this fixture. `origin` alone
    // is enough, because getPlainClauseSQL falls back to
    // `"${origin || name}"` against the *physical* table, so the
    // declaration a policy removes and the column a sibling reads are
    // simply different things. A reader who believes `clause` is the
    // dangerous attribute is wrong. C8: asserted, not fixed. See
    // docs/contracts/authorization.md.
    const out = compileSql(deps, {
      model: modelB64(
        empModelHDML(`
          <hdml-field name="emp_name" origin="name"></hdml-field>
          <hdml-field name="salary"></hdml-field>
          <hdml-field name="alias_pay" origin="salary"></hdml-field>
        `),
      ),
      frames: [
        frameB64(
          empFrameHDML(
            "f_emp",
            "?hdml-model=m_emp",
            `<hdml-field name="employees_emp_name"></hdml-field>
             <hdml-field name="employees_alias_pay"></hdml-field>`,
          ),
        ),
      ],
      output: "sql",
      adaptation_policy: removePolicy(
        "hdml-table hdml-field[name='salary']",
      ),
      role: "analyst",
    }) as CompilerResult;
    const sql = out.result[0];
    expect(sql).not.toContain('"employees_salary"');
    expect(sql).not.toContain('"salary" as "salary"');
    expect(sql).toContain('"salary" as "alias_pay"');
  });

  it("HOLDS at a frame: a user frame cannot reach past a security frame by clause, origin or name", () => {
    // O10, row 2 — the positive result, and the reason the slice's
    // answer is a rule rather than a warning. getFrameSQL selects
    // `from "<source>"`, and the source CTE projects only its
    // surviving fields (stringifier frame.ts:52-54), so what the
    // security frame stops projecting is unreachable from outside it
    // in *every* reference form, not just `clause`.
    const model = modelB64(
      empModelHDML(`
        <hdml-field name="emp_name" origin="name"></hdml-field>
        <hdml-field name="salary"></hdml-field>
      `),
    );
    // The security frame — a static frame a policy narrows.
    const sec = frameB64(
      empFrameHDML(
        "sec",
        "?hdml-model=m_emp",
        `<hdml-field name="employees_emp_name"></hdml-field>
         <hdml-field name="employees_salary"></hdml-field>`,
      ),
    );
    // The user frame — three attempts to reach the dropped column.
    const usr = frameB64(
      empFrameHDML(
        "usr",
        "?hdml-frame=sec",
        `<hdml-field name="employees_emp_name"></hdml-field>
         <hdml-field name="by_clause" clause="employees_salary * 1"></hdml-field>
         <hdml-field name="by_origin" origin="employees_salary"></hdml-field>
         <hdml-field name="employees_salary"></hdml-field>`,
      ),
    );
    const policy = removePolicy(
      "hdml-frame[name='sec'] hdml-field[name='employees_salary']",
    );
    const adapted = (
      compileSql(deps, {
        model,
        frames: [usr, sec],
        output: "sql",
        adaptation_policy: policy,
        role: "analyst",
      }) as CompilerResult
    ).result[0];

    // The security frame stops exposing the column …
    const secProjection = projectionOver(adapted, "m_emp");
    expect(secProjection).toContain('"employees_emp_name"');
    expect(secProjection).not.toContain("employees_salary");

    // … while all three user-frame reach attempts still *compile*,
    // each naming a column `"sec"` does not project. Trino resolves
    // the outer select against the CTE, so each is a hard failure at
    // plan time, not a silent read. One of these three is not this
    // case: the claim is that the frame holds against every
    // reference form.
    const usrProjection = projectionOver(adapted, "sec");
    expect(usrProjection).toContain(
      'employees_salary * 1 as "by_clause"',
    );
    expect(usrProjection).toContain(
      '"employees_salary" as "by_origin"',
    );
    expect(usrProjection).toContain(
      '"employees_salary" as "employees_salary"',
    );

    // Negative control: with no policy the same chain does expose it,
    // so the assertion above is the adaptation's doing and not an
    // accident of the fixture.
    const unadapted = (
      compileSql(deps, {
        model,
        frames: [usr, sec],
        output: "sql",
      }) as CompilerResult
    ).result[0];
    expect(projectionOver(unadapted, "m_emp")).toContain(
      "employees_salary",
    );
  });

  it("GRANTS an undeclared column when set-attribute writes origin", () => {
    // O18. The contract calls adaptation restriction-only; it is not.
    // A `set-attribute` on `origin` makes the compiled SQL read a
    // column no document declares. This is *not* a code defect —
    // applyAdaptation's D6 trust assumption covers it, and C10
    // forbids adding an attribute allowlist here. It is a false
    // sentence in docs/contracts/authorization.md, which step 03
    // corrects; this test is what makes that correction checkable.
    const modelHDML = empModelHDML(
      `<hdml-field name="emp_name" origin="name"></hdml-field>`,
    );
    // The fixture never mentions the column — that is the point.
    expect(modelHDML).not.toContain("salary");

    const out = compileSql(deps, {
      model: modelB64(modelHDML),
      frames: [
        frameB64(
          empFrameHDML(
            "f_pub",
            "?hdml-model=m_emp",
            `<hdml-field name="employees_emp_name"></hdml-field>`,
          ),
        ),
      ],
      output: "sql",
      adaptation_policy: {
        roles: {
          analyst: [
            {
              selector: "hdml-table hdml-field[name='emp_name']",
              action: "set-attribute",
              attribute: "origin",
              value: "salary",
            },
          ],
        },
      },
      role: "analyst",
    }) as CompilerResult;
    const sql = out.result[0];
    expect(sql).toContain('"salary" as "emp_name"');
    expect(sql).not.toContain('"name" as "emp_name"');
  });
});

describe("compile dispatch", () => {
  it("routes sql mode to compileSql", () => {
    const out = compile(deps, singleFrameInput()) as CompilerResult;
    expect(out.result).toHaveLength(1);
    expect(out.result[0]).toContain('with "m_stock" as (');
  });
});

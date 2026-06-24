/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { parseHDML } from "@hdml/parser";
import { serialize, structurize, StructType } from "@hdml/buffer";
import { bytesToBase64, base64ToBytes } from "@hdml/hash";
import {
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
} from "@hdml/stringifier";
import {
  compile,
  CompilerDeps,
  CompilerResult,
  CompilerError,
} from "./compileConnections";
import { compileSource } from "./compileSource";

const deps: CompilerDeps = {
  deserialize: (() => {
    throw new Error("unused");
  }) as unknown as CompilerDeps["deserialize"],
  serialize,
  structurize,
  base64ToBytes,
  getConnectionSQLs,
  getModelHTML,
  getFrameHTML,
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

const leafFrameHDML = `
  <hdml-frame name="leaf" source="/m_stock" limit="100" offset="0">
    <hdml-field name="open"></hdml-field>
  </hdml-frame>
`;

const rootFrameHDML = `
  <hdml-frame name="root" source="/leaf" limit="50" offset="0">
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

describe("compileSource", () => {
  it("reconstructs a 1-model + 1-frame closure", () => {
    const out = compileSource(deps, {
      model: modelB64(modelHDML),
      frames: [frameB64(leafFrameHDML)],
      output: "source",
    }) as CompilerResult;
    expect(out.result).toHaveLength(1);
    const html = out.result[0];
    expect(html).toContain('<hdml-model name="m_stock">');
    expect(html).toContain('<hdml-table name="amazon"');
    expect(html).toContain('<hdml-frame name="leaf"');
  });

  it("emits every frame in a leaf→root closure", () => {
    const out = compileSource(deps, {
      model: modelB64(modelHDML),
      frames: [frameB64(leafFrameHDML), frameB64(rootFrameHDML)],
      output: "source",
    }) as CompilerResult;
    expect(out.result).toHaveLength(1);
    const html = out.result[0];
    expect(html).toContain('<hdml-frame name="leaf"');
    expect(html).toContain('<hdml-frame name="root"');
    // Model first, then frames in the given order.
    expect(html.indexOf("m_stock")).toBeLessThan(
      html.indexOf('name="leaf"'),
    );
    expect(html.indexOf('name="leaf"')).toBeLessThan(
      html.indexOf('name="root"'),
    );
  });

  it("fails with structurize_failed on malformed base64", () => {
    const out = compileSource(deps, {
      model: modelB64(modelHDML),
      frames: ["not-a-valid-struct"],
      output: "source",
    }) as CompilerError;
    expect(out.error).toBe("structurize_failed");
  });

  it("fails with structurize_failed on a wrong struct type", () => {
    // A ModelStruct decoded as a FrameStruct mismatches.
    const out = compileSource(deps, {
      frames: [modelB64(modelHDML)],
      output: "source",
    }) as CompilerError;
    expect(out.error).toBe("structurize_failed");
  });
});

describe("compile dispatch", () => {
  it("routes source mode to compileSource", () => {
    const out = compile(deps, {
      model: modelB64(modelHDML),
      frames: [frameB64(leafFrameHDML)],
      output: "source",
    }) as CompilerResult;
    expect(out.result).toHaveLength(1);
    expect(out.result[0]).toContain('<hdml-model name="m_stock">');
  });
});

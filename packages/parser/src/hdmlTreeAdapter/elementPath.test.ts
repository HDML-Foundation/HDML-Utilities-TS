/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, parseFragment } from "parse5";
import { HDML_TAG_NAMES } from "@hdml/types";
import { hdmlTreeAdapter } from "./hdmlTreeAdapter";
import { elementPath } from "./elementPath";
import {
  Element,
  ParentNode,
  HDMLTreeAdapterMap,
} from "../types/HDMLTreeAdapterMap";

function parse(src: string): ParentNode {
  return parseFragment<HDMLTreeAdapterMap>(src, {
    onParseError: () => undefined,
    scriptingEnabled: false,
    treeAdapter: hdmlTreeAdapter,
  });
}

function elementsOf(parent: ParentNode): Element[] {
  const out: Element[] = [];
  for (const child of parent.childNodes) {
    if (child) {
      out.push(child, ...elementsOf(child));
    }
  }
  return out;
}

function pathsOf(src: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const el of elementsOf(parse(src))) {
    const key = String(
      el.attrs.find((a) => a.name === "name")?.value ?? el.tagName,
    );
    out[key] = String(el.path);
  }
  return out;
}

const NESTED =
  '<hdml-model name="m">\n' +
  '  <hdml-join type="full" left="a" right="b"></hdml-join>\n' +
  '  <hdml-dataset name="d0" type="table" identifier="x">' +
  "</hdml-dataset>\n" +
  '  <hdml-dataset name="d1" type="table" identifier="y">\n' +
  '    <hdml-field name="f0"></hdml-field>\n' +
  '    <hdml-field name="f1"></hdml-field>\n' +
  "  </hdml-dataset>\n" +
  "</hdml-model>\n";

describe("The `elementPath` function", () => {
  it("builds a tag-and-ordinal path from the document root", () => {
    expect(pathsOf(NESTED)).toEqual({
      m: "hdml-model[0]",
      "hdml-join": "hdml-model[0]/hdml-join[0]",
      d0: "hdml-model[0]/hdml-dataset[0]",
      d1: "hdml-model[0]/hdml-dataset[1]",
      f0: "hdml-model[0]/hdml-dataset[1]/hdml-field[0]",
      f1: "hdml-model[0]/hdml-dataset[1]/hdml-field[1]",
    });
  });

  it("counts same-tag siblings, not all children", () => {
    // Dropping the `hdml-join` that precedes `d0` must not shift
    // `d0`, which an all-children ordinal would do.
    const withJoin = pathsOf(NESTED);
    const withoutJoin = pathsOf(
      NESTED.replace(
        '  <hdml-join type="full" left="a" right="b">' +
          "</hdml-join>\n",
        "",
      ),
    );
    expect(withoutJoin.d0).toBe("hdml-model[0]/hdml-dataset[0]");
    expect(withoutJoin.d0).toBe(withJoin.d0);
    expect(withoutJoin.f1).toBe(withJoin.f1);
  });

  it("returns `null` for a node with no parent", () => {
    const orphan = hdmlTreeAdapter.createElement(
      HDML_TAG_NAMES.MODEL,
      html.NS.HTML,
      [],
    );
    expect(orphan.parentNode).toBeNull();
    expect(elementPath(orphan)).toBeNull();
  });

  it("returns `null` for `null`", () => {
    expect(elementPath(null)).toBeNull();
  });

  it("gives a synthesised node no path of its own", () => {
    // `</br>` makes `parse5` synthesise a `<br>`
    // (`parse5/dist/parser/index.js:309`), which survives in the
    // returned tree, unlike the fake fragment root.
    const els = elementsOf(
      parse('<hdml-model name="m"></hdml-model></br>'),
    );
    const br = els.find((e) => e.tagName === "br");
    expect(br === undefined).toBe(false);
    expect(br?.loc).toBeNull();
    expect(br?.path).toBeNull();
  });
});

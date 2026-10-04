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
    if (el.path === null) {
      continue;
    }
    const key = String(
      el.attrs.find((a) => a.name === "name")?.value ?? el.tagName,
    );
    out[key] = el.path;
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

  it("gives a non-HDML element no path", () => {
    // Includes the nodes `parse5` invents -- here the `<br>` that
    // `</br>` synthesises (`parse5/dist/parser/index.js:309`) --
    // which need no special case, because none of them is an HDML
    // tag.
    const els = elementsOf(
      parse('<div><hdml-model name="m"></hdml-model></div></br>'),
    );
    for (const tag of ["div", "br"]) {
      const el = els.find((e) => e.tagName === tag);
      expect(el === undefined).toBe(false);
      expect(el?.path).toBeNull();
    }
  });

  it("ignores the HTML between two HDML elements", () => {
    // The parser's own `getHdmlParentTag` climbs through ANY
    // element, so both fields belong to the dataset. Counting the
    // wrappers would make BOTH read `hdml-field[0]`, and would
    // move every path when a wrapper is added.
    const paths = pathsOf(
      '<body><div id="x"><div>' +
        '<hdml-model name="m">' +
        '<hdml-dataset name="d" type="table" identifier="i">' +
        '<div class="w"><hdml-field name="a"></hdml-field></div>' +
        '<div class="w"><hdml-field name="b"></hdml-field></div>' +
        "</hdml-dataset></hdml-model></div></div></body>",
    );
    expect(paths.m).toBe("hdml-model[0]");
    expect(paths.d).toBe("hdml-model[0]/hdml-dataset[0]");
    expect(paths.a).toBe(
      "hdml-model[0]/hdml-dataset[0]/hdml-field[0]",
    );
    expect(paths.b).toBe(
      "hdml-model[0]/hdml-dataset[0]/hdml-field[1]",
    );
  });

  it("is unmoved by table markup parse5 completes", () => {
    // `<table><tr>` makes `parse5` insert a `<tbody>` that SURVIVES
    // in the tree. An HTML-bearing path would both skip it and
    // collide with the `<table>`'s own.
    const paths = pathsOf(
      "<table><tr><td>" +
        '<hdml-model name="m"></hdml-model>' +
        "</td></tr></table>",
    );
    expect(paths.m).toBe("hdml-model[0]");
  });

  it("does not treat a misspelled tag as vocabulary", () => {
    const els = elementsOf(parse('<hdml-fild name="x"></hdml-fild>'));
    const bad = els.find((e) => e.tagName === "hdml-fild");
    expect(bad === undefined).toBe(false);
    expect(bad?.path).toBeNull();
  });
});

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDML_TAG_NAMES, Table } from "@hdml/types";
import { html, parseFragment } from "parse5";
import { hdmlTreeAdapter } from "./hdmlTreeAdapter";
import { sortFrames } from "../sortFrames";

const HDML_TAGS = new Set<string>(Object.values(HDML_TAG_NAMES));
import {
  Element,
  ParentNode,
  HDMLTreeAdapterMap,
} from "../types/HDMLTreeAdapterMap";

function parseTree(src: string): ParentNode {
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

/**
 * Collects the elements of an ALREADY-PARSED tree by tag name. The
 * `tagName` parameter is a plain `string` on purpose: comparing
 * `Element.tagName` to an `HDML_TAG_NAMES` member directly is an
 * `@typescript-eslint/no-unsafe-enum-comparison` error.
 */
function tagsOf(parent: ParentNode, tagName: string): Element[] {
  return elementsOf(parent).filter((e) => e.tagName === tagName);
}

function firstOf(src: string, tagName: string): Element {
  const hit = elementsOf(parseTree(src)).find(
    (e) => e.tagName === tagName,
  );
  if (!hit) {
    throw new Error(`no <${tagName}> in ${JSON.stringify(src)}`);
  }
  return hit;
}

/**
 * Walks a tag-and-ordinal path back to the element it names.
 * ★ Descends THROUGH non-HDML elements and stops at HDML ones,
 * mirroring `elementPath`: a path names HDML elements only, so a
 * resolver that looked at direct children alone would miss an
 * `<hdml-field>` an author wrapped in a `<div>`.
 */
function resolvePath(root: ParentNode, path: string): null | Element {
  let node: ParentNode = root;
  for (const segment of path.split("/")) {
    const parsed = /^(.+)\[(\d+)\]$/.exec(segment);
    if (!parsed) {
      return null;
    }
    const tagName = parsed[1];
    const wanted = Number(parsed[2]);
    let seen = 0;
    let found: null | Element = null;
    const visit = (parent: ParentNode): void => {
      for (const child of parent.childNodes) {
        if (found || !child) {
          continue;
        }
        if (HDML_TAGS.has(child.tagName)) {
          if (child.tagName === tagName) {
            if (seen === wanted) {
              found = child;
              return;
            }
            seen++;
          }
          continue;
        }
        visit(child);
      }
    };
    visit(node);
    if (!found) {
      return null;
    }
    node = found;
  }
  return node === root ? null : (node as Element);
}

const MODEL = '<hdml-model name="m"></hdml-model>';

describe("The parse anchor", () => {
  // (a)
  it("stamps an element with its own start tag", () => {
    const el = firstOf(MODEL, HDML_TAG_NAMES.MODEL);
    const loc = hdmlTreeAdapter.getNodeSourceCodeLocation(el);
    expect(loc).not.toBeNull();
    expect(loc).not.toBeUndefined();
    expect(loc?.startTag).toBeDefined();
    expect(loc?.startLine).toBe(1);
    expect(loc?.startCol).toBe(1);
    expect(loc?.startOffset).toBe(0);
    expect(loc?.endOffset).toBe(MODEL.length);
  });

  // (a), the per-attribute positions `LocationWithAttributes` adds
  it("stamps a position for each attribute", () => {
    const el = firstOf(MODEL, HDML_TAG_NAMES.MODEL);
    const loc = hdmlTreeAdapter.getNodeSourceCodeLocation(el);
    expect(loc?.attrs?.name).toBeDefined();
    expect(loc?.attrs?.name.startOffset).toBe(
      MODEL.indexOf('name="m"'),
    );
    expect(loc?.attrs?.name.startLine).toBe(1);
  });

  // (b)
  it("is not widened by the whitespace that follows it", () => {
    const el = firstOf(`${MODEL}\n\n  `, HDML_TAG_NAMES.MODEL);
    const loc = hdmlTreeAdapter.getNodeSourceCodeLocation(el);
    // The end of `</hdml-model>`, never the end of the run.
    expect(loc?.endOffset).toBe(MODEL.length);
    expect(loc?.endTag?.endOffset).toBe(MODEL.length);
  });

  // (b), the control: the same expectation with no run at all, so
  // the assertion above cannot pass by reading a stale value.
  it("has that same end with no whitespace at all", () => {
    const el = firstOf(MODEL, HDML_TAG_NAMES.MODEL);
    const loc = hdmlTreeAdapter.getNodeSourceCodeLocation(el);
    expect(loc?.endOffset).toBe(MODEL.length);
  });

  // (c)
  it("stamps a path that survives `sortFrames`", () => {
    const src = ["c", "b", "a"]
      .map(
        (n) =>
          `<hdml-frame name="${n}" ` +
          `source="/p?hdml-model=m"></hdml-frame>`,
      )
      .join("\n");
    const tree = parseTree(src);
    const els = tagsOf(tree, HDML_TAG_NAMES.FRAME);
    expect(els.length).toBe(3);
    const hddm = els[0].rootNode?.hddm;
    expect(hddm).toBeDefined();
    const unsorted = hddm ? hddm.frames : [];
    expect(unsorted.map((f) => f.name)).toEqual(["c", "b", "a"]);
    const anchors = els.map((e) => ({
      frame: unsorted[els.indexOf(e)],
      path: String(e.path),
      element: e,
    }));
    const sorted = sortFrames(unsorted);
    expect(sorted.map((f) => f.name)).toEqual(["a", "b", "c"]);
    for (const anchor of anchors) {
      // Identity as a boolean: an `Element` operand in a failed
      // assertion is circular through `rootNode`, and jest's
      // worker dies serialising it, so the suite would report
      // "failed to run" and name no gate.
      const hit = resolvePath(tree, anchor.path);
      expect(hit === anchor.element).toBe(true);
      expect(hit?.hddmData === anchor.frame).toBe(true);
    }
  });

  // (c), the negative control: the reason an index is illegal.
  it("outlives a frames-array index, which does not", () => {
    const src = ["c", "b", "a"]
      .map(
        (n) =>
          `<hdml-frame name="${n}" ` +
          `source="/p?hdml-model=m"></hdml-frame>`,
      )
      .join("\n");
    const tree = parseTree(src);
    const els = tagsOf(tree, HDML_TAG_NAMES.FRAME);
    const hddm = els[0].rootNode?.hddm;
    const unsorted = hddm ? hddm.frames : [];
    const sorted = sortFrames(unsorted);
    const moved = unsorted.filter((f, i) => sorted.indexOf(f) !== i);
    expect(moved.length).toBeGreaterThan(0);
    expect(sorted.indexOf(unsorted[0])).not.toBe(0);
    // while every path still resolves
    for (const el of els) {
      expect(resolvePath(tree, String(el.path)) === el).toBe(true);
    }
  });

  // ★ The path agrees with the parser's own nesting, and
  // round-trips through the HTML the parser ignores.
  it("anchors through the HTML the parser ignores", () => {
    const src =
      '<body><div id="x"><div>' +
      '<hdml-model name="m">' +
      '<hdml-dataset name="d" type="table" identifier="i">' +
      '<div class="w"><hdml-field name="a"></hdml-field></div>' +
      '<div class="w"><hdml-field name="b"></hdml-field></div>' +
      "</hdml-dataset></hdml-model></div></div></body>";
    const tree = parseTree(src);
    const fields = tagsOf(tree, HDML_TAG_NAMES.FIELD);
    expect(fields.length).toBe(2);
    // Both wrappers are discarded, so the two fields are siblings
    // of the dataset and their ordinals DIFFER. Counting the
    // `<div>`s would make both of them `hdml-field[0]`.
    expect(fields[0].path).toBe(
      "hdml-model[0]/hdml-dataset[0]/hdml-field[0]",
    );
    expect(fields[1].path).toBe(
      "hdml-model[0]/hdml-dataset[0]/hdml-field[1]",
    );
    // and each still resolves back to its own element
    for (const field of fields) {
      const hit = resolvePath(tree, String(field.path));
      expect(hit === field).toBe(true);
    }
    // the dataset really does hold both, which is the semantics
    // the path has to agree with
    const model = tagsOf(tree, HDML_TAG_NAMES.MODEL)[0];
    const data = model.hddmData as null | { tables: Table[] };
    expect(data?.tables[0].fields.map((f) => f.name)).toEqual([
      "a",
      "b",
    ]);
  });

  // (d), `:309` -- a fake element, in the returned tree
  it("records a synthesised element as `null`", () => {
    const els = elementsOf(parseTree(`${MODEL}</br>`));
    const br = els.find((e) => e.tagName === "br");
    expect(br === undefined).toBe(false);
    expect(br?.loc).toBeNull();
    expect(br?.loc).not.toBeUndefined();
    expect(
      br ? hdmlTreeAdapter.getNodeSourceCodeLocation(br) : 0,
    ).toBeNull();
  });

  // (d), and the mirror of (b): the ONLY observable that catches
  // `setNodeSourceCodeLocation` losing its `startTag` guard. A
  // real element always has a location by the time a run reaches
  // it, so `:367` never touches one -- but a SYNTHESISED element
  // reads falsy, so the run's location is stamped onto it,
  // fabricating a source position for a node that has none.
  it("does not fabricate a location for a synthesised node", () => {
    const els = elementsOf(parseTree(`${MODEL}</br>\n  `));
    const br = els.find((e) => e.tagName === "br");
    expect(br === undefined).toBe(false);
    expect(br?.loc).toBeNull();
    // ★ `loc` is the whole gate. `br.path` is `null` either
    // way, because a `<br>` is not an HDML tag, so asserting
    // it here would look like a clause and discriminate
    // nothing.
  });

  // (d), `:326` -- the fake fragment root, asserted at unit level
  // because `parseFragment` adopts the authored elements out of it
  // and never returns it.
  it("accepts a `null` location without fabricating one", () => {
    const el = firstOf(MODEL, HDML_TAG_NAMES.MODEL);
    hdmlTreeAdapter.setNodeSourceCodeLocation(el, null);
    expect(el.loc).toBeNull();
    expect(hdmlTreeAdapter.getNodeSourceCodeLocation(el)).toBeNull();
  });

  // (d), `:320` -- a `template`'s content, which is an
  // `HDMLDocument` and carries no `loc` field at all.
  it("ignores a `null` stamp on a non-element node", () => {
    const content = hdmlTreeAdapter.createDocumentFragment();
    expect(() =>
      hdmlTreeAdapter.setNodeSourceCodeLocation(content, null),
    ).not.toThrow();
    expect(content).toEqual({
      nodeName: "#hdml-document",
      childNodes: [],
    });
  });

  // `:367` hands the setter `siblings[-1]`, i.e. `undefined`,
  // whenever the run has no preceding sibling.
  it("ignores a stamp on an absent node", () => {
    expect(() =>
      hdmlTreeAdapter.setNodeSourceCodeLocation(null, null),
    ).not.toThrow();
    expect(
      hdmlTreeAdapter.getNodeSourceCodeLocation(null),
    ).toBeNull();
  });
});

describe("The `hdmlTreeAdapter` object", () => {
  it("`getHdmlParentTag` method should return `null` if `element` is equal to null", () => {
    expect(
      hdmlTreeAdapter.getHdmlParentTag(null, [HDML_TAG_NAMES.MODEL]),
    ).toBeNull();
  });

  it("`getHdmlParentTag` method should return `null` if specified parent wasn't found", () => {
    expect(
      hdmlTreeAdapter.getHdmlParentTag(
        {
          nodeName: "nodeName",
          tagName: "tagName",
          attrs: [],
          rootNode: null,
          parentNode: null,
          hddm: null,
          hddmData: null,
          loc: null,
          path: null,
          childNodes: [],
        },
        [HDML_TAG_NAMES.MODEL],
      ),
    ).toBeNull();
  });

  it("`getParentNode` method should return `null` if `element` is equal to null", () => {
    expect(hdmlTreeAdapter.getParentNode(null)).toBeNull();
  });

  it("should return valid result if `createDocument` method was called", () => {
    expect(hdmlTreeAdapter.createDocument()).toEqual({
      nodeName: "#document",
      childNodes: [],
    });
  });

  it("should return valid result if `createCommentNode` method was called", () => {
    expect(hdmlTreeAdapter.createCommentNode("string")).toBeNull();
  });

  it("should return valid result if `createTextNode` method was called", () => {
    expect(hdmlTreeAdapter.createTextNode("string")).toBeNull();
  });

  it("should return valid result if `insertBefore` method was called", () => {
    expect(
      hdmlTreeAdapter.insertBefore(
        {
          nodeName: "nodeName",
          tagName: "tagName",
          attrs: [],
          rootNode: null,
          parentNode: null,
          hddm: null,
          hddmData: null,
          loc: null,
          path: null,
          childNodes: [],
        },
        {
          nodeName: "nodeName",
          tagName: "tagName",
          attrs: [],
          rootNode: null,
          parentNode: null,
          hddm: null,
          hddmData: null,
          loc: null,
          path: null,
          childNodes: [],
        },
        {
          nodeName: "nodeName",
          tagName: "tagName",
          attrs: [],
          rootNode: null,
          parentNode: null,
          hddm: null,
          hddmData: null,
          loc: null,
          path: null,
          childNodes: [],
        },
      ),
    ).toBeUndefined();
  });

  it("should return valid result if `setTemplateContent` method was called", () => {
    expect(
      hdmlTreeAdapter.setTemplateContent(
        {
          nodeName: "template",
          tagName: "template",
          content: {
            nodeName: "#hdml-document",
            childNodes: [],
          },
          attrs: [],
          rootNode: null,
          parentNode: null,
          childNodes: [],
          hddm: null,
          hddmData: null,
          loc: null,
          path: null,
        },
        {
          nodeName: "#hdml-document",
          childNodes: [],
        },
      ),
    ).toBeUndefined();
  });

  it("should return valid result if `getTemplateContent` method was called", () => {
    expect(
      hdmlTreeAdapter.getTemplateContent({
        nodeName: "template",
        tagName: "template",
        content: {
          nodeName: "#hdml-document",
          childNodes: [],
        },
        attrs: [],
        rootNode: null,
        parentNode: null,
        childNodes: [],
        hddm: null,
        hddmData: null,
        loc: null,
        path: null,
      }),
    ).toEqual({
      nodeName: "#hdml-document",
      childNodes: [],
    });
  });

  it("should return valid result if `setDocumentType` method was called", () => {
    expect(
      hdmlTreeAdapter.setDocumentType(
        {
          nodeName: "#document",
          childNodes: [],
        },
        "string",
        "string",
        "string",
      ),
    ).toBeUndefined();
  });

  it("should return valid result if `setDocumentMode` method was called", () => {
    expect(
      hdmlTreeAdapter.setDocumentMode(
        {
          nodeName: "#document",
          childNodes: [],
        },
        html.DOCUMENT_MODE.NO_QUIRKS,
      ),
    ).toBeUndefined();
  });

  it("should return valid result if `getDocumentMode` method was called", () => {
    expect(
      hdmlTreeAdapter.getDocumentMode({
        nodeName: "#document",
        childNodes: [],
      }),
    ).toBe(html.DOCUMENT_MODE.NO_QUIRKS);
  });

  it("should return valid result if `insertText` method was called", () => {
    expect(
      hdmlTreeAdapter.insertText(
        {
          nodeName: "#hdml-document",
          childNodes: [],
        },
        "",
      ),
    ).toBeUndefined();
  });

  it("should return valid result if `insertTextBefore` method was called", () => {
    expect(
      hdmlTreeAdapter.insertTextBefore(
        {
          nodeName: "#hdml-document",
          childNodes: [],
        },
        "",
        null,
      ),
    ).toBeUndefined();
  });

  it("should return valid result if `adoptAttributes` method was called", () => {
    expect(
      hdmlTreeAdapter.adoptAttributes(
        {
          nodeName: "template",
          tagName: "template",
          attrs: [],
          rootNode: null,
          parentNode: null,
          childNodes: [],
          hddm: null,
          hddmData: null,
          loc: null,
          path: null,
        },
        [],
      ),
    ).toBeUndefined();
  });

  it("should return valid result if `getAttrList` method was called", () => {
    expect(
      hdmlTreeAdapter.getAttrList({
        nodeName: "template",
        tagName: "template",
        attrs: [],
        rootNode: null,
        parentNode: null,
        childNodes: [],
        hddm: null,
        hddmData: null,
        loc: null,
        path: null,
      }),
    ).toEqual([]);
  });

  it("should return valid result if `getTextNodeContent` method was called", () => {
    expect(hdmlTreeAdapter.getTextNodeContent(null)).toBe("");
  });

  it("should return valid result if `getCommentNodeContent` method was called", () => {
    expect(hdmlTreeAdapter.getCommentNodeContent(null)).toBe("");
  });

  it("should return valid result if `getDocumentTypeNodeName` method was called", () => {
    expect(hdmlTreeAdapter.getDocumentTypeNodeName(null)).toBe("");
  });

  it("should return valid result if `getDocumentTypeNodePublicId` method was called", () => {
    expect(hdmlTreeAdapter.getDocumentTypeNodePublicId(null)).toBe(
      "",
    );
  });

  it("should return valid result if `getDocumentTypeNodeSystemId` method was called", () => {
    expect(hdmlTreeAdapter.getDocumentTypeNodeSystemId(null)).toBe(
      "",
    );
  });

  it("should return valid result if `isTextNode` method was called", () => {
    expect(hdmlTreeAdapter.isTextNode(null)).toBe(true);
  });

  it("should return valid result if `isCommentNode` method was called", () => {
    expect(hdmlTreeAdapter.isCommentNode(null)).toBe(true);
  });

  it("should return valid result if `isDocumentTypeNode` method was called", () => {
    expect(hdmlTreeAdapter.isDocumentTypeNode(null)).toBe(true);
  });

  it("should return valid result if `updateNodeSourceCodeLocation` method was called", () => {
    expect(
      hdmlTreeAdapter.updateNodeSourceCodeLocation(null, {}),
    ).toBeUndefined();
  });
});

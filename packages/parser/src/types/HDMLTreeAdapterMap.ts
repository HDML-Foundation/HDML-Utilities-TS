/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Token, TreeAdapterTypeMap } from "parse5";
import { HDOM } from "@hdml/types";
import { HDDMData } from "./HDDMData";

type Attribute = Token.Attribute;

export interface Document {
  /** The name of the node. */
  nodeName: "#document";
  /** The node's children. */
  childNodes: ChildNode[];
}

export interface HDMLDocument {
  /** The name of the node. */
  nodeName: "#hdml-document";
  /** The node's children. */
  childNodes: ChildNode[];
}

export interface Element {
  /** Element tag name. Same as {@link tagName}. */
  nodeName: string;
  /** Element tag name. Same as {@link nodeName}. */
  tagName: string;
  /** List of element attributes. */
  attrs: Attribute[];
  /** Root node. */
  rootNode: ChildNode | null;
  /** Parent node. */
  parentNode: ParentNode | null;
  /** The node's children. */
  childNodes: ChildNode[];
  /** HyperData Document Model. */
  hddm: null | HDOM;
  /** HDDM parent node. */
  hddmData: null | HDDMData;
  /**
   * Source-code location of the element's own start tag, widened to
   * its end tag when the document has one, with per-attribute
   * positions in `attrs`. `null` for a node `parse5` synthesised:
   * a fake element (`parse5/dist/parser/index.js:309`), a fake
   * fragment root (`:326`), or a `template`'s content (`:320` --
   * which is an `HDMLDocument` and so never carries this field at
   * all). Required-but-nullable on purpose: an optional field would
   * make "not stamped yet" and "synthesised" indistinguishable.
   */
  loc: null | Token.ElementLocation;
  /**
   * Tag-and-ordinal path from the document root, e.g.
   * `hdml-model[0]/hdml-dataset[1]/hdml-field[3]`. Ordinals count
   * SAME-TAG siblings only, so an unrelated sibling appearing
   * before this element does not shift it. `null` while the element
   * has no parent, and on `parse5`'s synthesised fragment root,
   * which is not part of the authored document.
   */
  path: null | string;
}

export interface Template extends Element {
  nodeName: "template";
  tagName: "template";
  /** The content of a `template` tag. */
  content: HDMLDocument;
}

export type ParentNode = Document | HDMLDocument | Element | Template;
export type ChildNode = null | Element | Template;
export type Node = ParentNode | ChildNode;

export type HDMLTreeAdapterMap = TreeAdapterTypeMap<
  Node,
  ParentNode,
  ChildNode,
  Document,
  HDMLDocument,
  Element,
  null,
  null,
  Template,
  null
>;

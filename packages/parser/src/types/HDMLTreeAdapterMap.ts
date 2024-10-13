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

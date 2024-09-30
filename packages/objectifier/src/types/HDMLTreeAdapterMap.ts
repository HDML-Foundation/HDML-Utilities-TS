/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Token } from "parse5";
import { IHDDM } from "@hdml/schemas";
import { TreeAdapterTypeMap } from "./TreeAdapterTypeMap";

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
  /** HDML document children. */
  hddm: IHDDM;
}

export interface Element {
  /** Element tag name. Same as {@link tagName}. */
  nodeName: string;
  /** Element tag name. Same as {@link nodeName}. */
  tagName: string;
  /** List of element attributes. */
  attrs: Attribute[];
  /** Parent node. */
  parentNode: ParentNode | null;
  /** The node's children. */
  childNodes: ChildNode[];
  /** HDML element flag. */
  isHdml: boolean;
  /** HDDM parent node. */
  hddmParentNode: ParentNode | null;
  /** The HDDM node's children. */
  hddmChildNodes: ChildNode[];
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

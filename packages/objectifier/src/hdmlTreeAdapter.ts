/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, Token } from "parse5";
import {
  HDMLTreeAdapterMap,
  Document,
  HDMLDocument,
  Element,
  Template,
  ParentNode,
  ChildNode,
  Node,
} from "./types/HDMLTreeAdapterMap";
import { TreeAdapter } from "./types/TreeAdapter";
import { HDML_TAG_NAMES } from "./types/HDML_TAG_NAMES";

const tags: string[] = [
  HDML_TAG_NAMES.CONNECTION,
  HDML_TAG_NAMES.CONNECTIVE,
  HDML_TAG_NAMES.FILTER_BY,
  HDML_TAG_NAMES.FRAME,
  HDML_TAG_NAMES.GROUP_BY,
  HDML_TAG_NAMES.INCLUDE,
  HDML_TAG_NAMES.JOIN,
  HDML_TAG_NAMES.MODEL,
  HDML_TAG_NAMES.SORT_BY,
  HDML_TAG_NAMES.SPLIT_BY,
  HDML_TAG_NAMES.TABLE,
];

export const hdmlTreeAdapter: TreeAdapter<HDMLTreeAdapterMap> = {
  //Node construction
  createDocument(): Document {
    return {
      nodeName: "#document",
      childNodes: [],
    };
  },

  createDocumentFragment(): HDMLDocument {
    return {
      nodeName: "#hdml-document",
      childNodes: [],
      hddm: {
        includes: [],
        connections: [],
        models: [],
        frames: [],
      },
    };
  },

  createElement(
    tagName: string,
    namespaceURI: html.NS,
    attrs: Token.Attribute[],
  ): Element {
    return {
      nodeName: tagName,
      tagName,
      attrs,
      childNodes: [],
      parentNode: null,
      isHdml: !!~tags.indexOf(tagName),
      hddmParentNode: null,
      hddmChildNodes: [],
    };
  },

  createCommentNode(): null {
    return null;
  },

  createTextNode(): null {
    return null;
  },

  //Tree mutation
  appendChild(parentNode: ParentNode, newNode: ChildNode): void {
    if (newNode) {
      parentNode.childNodes.push(newNode);
      newNode.parentNode = parentNode;
    }
  },

  insertBefore(
    parentNode: ParentNode,
    newNode: ChildNode,
    referenceNode: ChildNode,
  ): void {
    const insertionIdx = parentNode.childNodes.indexOf(referenceNode);

    if (newNode) {
      parentNode.childNodes.splice(insertionIdx, 0, newNode);
      newNode.parentNode = parentNode;
    }
  },

  setTemplateContent(
    templateElement: Template,
    contentElement: HDMLDocument,
  ): void {
    templateElement.content = contentElement;
  },

  getTemplateContent(templateElement: Template): HDMLDocument {
    return templateElement.content;
  },

  setDocumentType(): void {},

  setDocumentMode(): void {},

  getDocumentMode(): html.DOCUMENT_MODE {
    return html.DOCUMENT_MODE.NO_QUIRKS;
  },

  detachNode(node: ChildNode): void {
    if (node && node.parentNode) {
      const idx = node.parentNode.childNodes.indexOf(node);
      node.parentNode.childNodes.splice(idx, 1);
      node.parentNode = null;
    }
  },

  insertText(): void {},

  insertTextBefore(): void {},

  adoptAttributes(
    recipient: Element,
    attrs: Token.Attribute[],
  ): void {
    const recipientAttrsMap = new Set(
      recipient.attrs.map((attr) => attr.name),
    );
    for (let j = 0; j < attrs.length; j++) {
      if (!recipientAttrsMap.has(attrs[j].name)) {
        recipient.attrs.push(attrs[j]);
      }
    }
  },

  //Tree traversing
  getFirstChild(node: ParentNode): null | ChildNode {
    return node.childNodes[0];
  },

  getChildNodes(node: ParentNode): ChildNode[] {
    return node.childNodes;
  },

  getParentNode(node: ChildNode): null | ParentNode {
    return node ? node.parentNode : null;
  },

  getAttrList(element: Element): Token.Attribute[] {
    return element.attrs;
  },

  //Node data
  getTagName(element: Element): string {
    return element.tagName;
  },

  getNamespaceURI(): html.NS {
    return html.NS.HTML;
  },

  getTextNodeContent(): string {
    return "";
  },

  getCommentNodeContent(): string {
    return "";
  },

  getDocumentTypeNodeName(): string {
    return "";
  },

  getDocumentTypeNodePublicId(): string {
    return "";
  },

  getDocumentTypeNodeSystemId(): string {
    return "";
  },

  //Node types
  isTextNode(node: Node): node is null {
    return !node;
  },

  isCommentNode(node: Node): node is null {
    return !node;
  },

  isDocumentTypeNode(node: Node): node is null {
    return !node;
  },

  isElementNode(node: Node): node is Element {
    return Object.prototype.hasOwnProperty.call(node, "tagName");
  },

  // Source code location
  setNodeSourceCodeLocation(): void {},

  getNodeSourceCodeLocation():
    | Token.ElementLocation
    | undefined
    | null {
    return null;
  },

  updateNodeSourceCodeLocation(): void {},
};

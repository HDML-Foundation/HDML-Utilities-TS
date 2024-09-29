/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { html, Token } from "parse5";
import {
  HDMLTreeAdapterMap,
  Document,
  DocumentFragment,
  Element,
  CommentNode,
  TextNode,
  Template,
  DocumentType,
  ParentNode,
  ChildNode,
  Node,
} from "./types/HDMLTreeAdapterMap";
import { TreeAdapter } from "./types/TreeAdapter";

export const hdmlTreeAdapter: TreeAdapter<HDMLTreeAdapterMap> = {
  //Node construction
  createDocument(): Document {
    return {
      nodeName: "#document",
      mode: html.DOCUMENT_MODE.NO_QUIRKS,
      childNodes: [],
    };
  },

  createDocumentFragment(): DocumentFragment {
    return {
      nodeName: "#document-fragment",
      childNodes: [],
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
      namespaceURI,
      childNodes: [],
      parentNode: null,
    };
  },

  createCommentNode(data: string): CommentNode {
    return {
      nodeName: "#comment",
      data,
      parentNode: null,
    };
  },

  createTextNode(value: string): TextNode {
    return {
      nodeName: "#text",
      value,
      parentNode: null,
    };
  },

  //Tree mutation
  appendChild(parentNode: ParentNode, newNode: ChildNode): void {
    parentNode.childNodes.push(newNode);
    newNode.parentNode = parentNode;
  },

  insertBefore(
    parentNode: ParentNode,
    newNode: ChildNode,
    referenceNode: ChildNode,
  ): void {
    const insertionIdx = parentNode.childNodes.indexOf(referenceNode);

    parentNode.childNodes.splice(insertionIdx, 0, newNode);
    newNode.parentNode = parentNode;
  },

  setTemplateContent(
    templateElement: Template,
    contentElement: DocumentFragment,
  ): void {
    templateElement.content = contentElement;
  },

  getTemplateContent(templateElement: Template): DocumentFragment {
    return templateElement.content;
  },

  setDocumentType(
    document: Document,
    name: string,
    publicId: string,
    systemId: string,
  ): void {
    const doctypeNode = document.childNodes.find(
      (node): node is DocumentType =>
        node.nodeName === "#documentType",
    );

    if (doctypeNode) {
      doctypeNode.name = name;
      doctypeNode.publicId = publicId;
      doctypeNode.systemId = systemId;
    } else {
      const node: DocumentType = {
        nodeName: "#documentType",
        name,
        publicId,
        systemId,
        parentNode: null,
      };
      hdmlTreeAdapter.appendChild(document, node);
    }
  },

  setDocumentMode(
    document: Document,
    mode: html.DOCUMENT_MODE,
  ): void {
    document.mode = mode;
  },

  getDocumentMode(document: Document): html.DOCUMENT_MODE {
    return document.mode;
  },

  detachNode(node: ChildNode): void {
    if (node.parentNode) {
      const idx = node.parentNode.childNodes.indexOf(node);

      node.parentNode.childNodes.splice(idx, 1);
      node.parentNode = null;
    }
  },

  insertText(parentNode: ParentNode, text: string): void {
    if (parentNode.childNodes.length > 0) {
      const prevNode =
        parentNode.childNodes[parentNode.childNodes.length - 1];

      if (hdmlTreeAdapter.isTextNode(prevNode)) {
        prevNode.value += text;
        return;
      }
    }

    hdmlTreeAdapter.appendChild(
      parentNode,
      hdmlTreeAdapter.createTextNode(text),
    );
  },

  insertTextBefore(
    parentNode: ParentNode,
    text: string,
    referenceNode: ChildNode,
  ): void {
    const prevNode =
      parentNode.childNodes[
        parentNode.childNodes.indexOf(referenceNode) - 1
      ];

    if (prevNode && hdmlTreeAdapter.isTextNode(prevNode)) {
      prevNode.value += text;
    } else {
      hdmlTreeAdapter.insertBefore(
        parentNode,
        hdmlTreeAdapter.createTextNode(text),
        referenceNode,
      );
    }
  },

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
    return node.parentNode;
  },

  getAttrList(element: Element): Token.Attribute[] {
    return element.attrs;
  },

  //Node data
  getTagName(element: Element): string {
    return element.tagName;
  },

  getNamespaceURI(element: Element): html.NS {
    return element.namespaceURI;
  },

  getTextNodeContent(textNode: TextNode): string {
    return textNode.value;
  },

  getCommentNodeContent(commentNode: CommentNode): string {
    return commentNode.data;
  },

  getDocumentTypeNodeName(doctypeNode: DocumentType): string {
    return doctypeNode.name;
  },

  getDocumentTypeNodePublicId(doctypeNode: DocumentType): string {
    return doctypeNode.publicId;
  },

  getDocumentTypeNodeSystemId(doctypeNode: DocumentType): string {
    return doctypeNode.systemId;
  },

  //Node types
  isTextNode(node: Node): node is TextNode {
    return node.nodeName === "#text";
  },

  isCommentNode(node: Node): node is CommentNode {
    return node.nodeName === "#comment";
  },

  isDocumentTypeNode(node: Node): node is DocumentType {
    return node.nodeName === "#documentType";
  },

  isElementNode(node: Node): node is Element {
    return Object.prototype.hasOwnProperty.call(node, "tagName");
  },

  // Source code location
  setNodeSourceCodeLocation(
    node: Node,
    location: Token.ElementLocation | null,
  ): void {
    node.sourceCodeLocation = location;
  },

  getNodeSourceCodeLocation(
    node: Node,
  ): Token.ElementLocation | undefined | null {
    return node.sourceCodeLocation;
  },

  updateNodeSourceCodeLocation(
    node: Node,
    endLocation: Token.ElementLocation,
  ): void {
    node.sourceCodeLocation = {
      ...node.sourceCodeLocation,
      ...endLocation,
    };
  },
};

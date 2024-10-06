/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IConnection, IFrame, IInclude, IModel } from "@hdml/schemas";
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
} from "../types/HDMLTreeAdapterMap";
import { HDMLTreeAdapter } from "../types/HDMLTreeAdapter";
import { HDML_TAG_NAMES } from "../enums/HDML_TAG_NAMES";
import { HDDMData } from "../types/HDDMData";
import { getIncludeData } from "./getIncludeData";
import { getConnectionData } from "./getConnectionData";
import { getModelData } from "./getModelData";
import { getTableData } from "./getTableData";
import { getFrameData } from "./getFrameData";

export const hdmlTreeAdapter: HDMLTreeAdapter<HDMLTreeAdapterMap> = {
  // HDML related methods
  createDocumentFragment(): HDMLDocument {
    return {
      nodeName: "#hdml-document",
      childNodes: [],
    };
  },

  createElement(
    tagName: string,
    namespaceURI: html.NS,
    attrs: Token.Attribute[],
  ): Element {
    let hddmData: null | HDDMData = null;

    switch (tagName as HDML_TAG_NAMES) {
      case HDML_TAG_NAMES.INCLUDE:
        hddmData = getIncludeData(attrs);
        break;
      case HDML_TAG_NAMES.CONNECTION:
        hddmData = getConnectionData(attrs);
        break;
      case HDML_TAG_NAMES.MODEL:
        hddmData = getModelData(attrs);
        break;
      case HDML_TAG_NAMES.TABLE:
        hddmData = getTableData(attrs);
        break;
      case HDML_TAG_NAMES.FRAME:
        hddmData = getFrameData(attrs);
        break;
    }

    return {
      nodeName: tagName,
      tagName,
      attrs,
      rootNode: null,
      parentNode: null,
      childNodes: [],
      hddm: null,
      hddmData,
    };
  },

  appendChild(parentNode: ParentNode, newNode: ChildNode): void {
    if (
      parentNode &&
      hdmlTreeAdapter.isElementNode(parentNode) &&
      parentNode.parentNode === null
    ) {
      parentNode.rootNode = parentNode;
      parentNode.hddm = {
        includes: [],
        connections: [],
        models: [],
        frames: [],
      };
    }
    if (newNode) {
      if (hdmlTreeAdapter.isElementNode(parentNode)) {
        newNode.rootNode = parentNode.rootNode;
      }
      parentNode.childNodes.push(newNode);
      newNode.parentNode = parentNode;
      hdmlTreeAdapter.appendHddmChild(newNode);
    }
  },

  appendHddmChild(element: ChildNode): void {
    switch (element?.nodeName) {
      case HDML_TAG_NAMES.INCLUDE:
        if (
          element.hddmData &&
          element.rootNode &&
          element.rootNode.hddm &&
          !~element.rootNode.hddm.includes.indexOf(
            element.hddmData as IInclude,
          )
        ) {
          element.rootNode?.hddm?.includes.push(
            element.hddmData as IInclude,
          );
        }
        break;
      case HDML_TAG_NAMES.CONNECTION:
        if (
          element.hddmData &&
          element.rootNode &&
          element.rootNode.hddm &&
          !~element.rootNode.hddm.connections.indexOf(
            element.hddmData as IConnection,
          )
        ) {
          element.rootNode?.hddm?.connections.push(
            element.hddmData as IConnection,
          );
        }
        break;
      case HDML_TAG_NAMES.MODEL:
        if (
          element.hddmData &&
          element.rootNode &&
          element.rootNode.hddm &&
          !~element.rootNode.hddm.models.indexOf(
            element.hddmData as IModel,
          )
        ) {
          element.rootNode.hddm.models.push(
            element.hddmData as IModel,
          );
        }
        break;
      case HDML_TAG_NAMES.TABLE:
        //   const model = hdmlTreeAdapter.hddmLookupParentTag(
        //     element,
        //     HDML_TAG_NAMES.MODEL,
        //   );
        break;
      case HDML_TAG_NAMES.FRAME:
        if (
          element.hddmData &&
          element.rootNode &&
          element.rootNode.hddm &&
          !~element.rootNode.hddm.frames.indexOf(
            element.hddmData as IFrame,
          )
        ) {
          element.rootNode.hddm.frames.push(
            element.hddmData as IFrame,
          );
        }
        break;
    }
  },

  getHdmlParentTag(
    element: ChildNode,
    hdmlTag: HDML_TAG_NAMES,
  ): null | ChildNode {
    if (!element) {
      return null;
    } else {
      let parent = element.parentNode;
      while (parent && hdmlTreeAdapter.isElementNode(parent)) {
        if (parent.nodeName === <string>hdmlTag) {
          return parent;
        } else {
          parent = parent.parentNode;
        }
      }
      return null;
    }
  },

  detachNode(node: ChildNode): void {
    if (node && node.parentNode) {
      const idx = node.parentNode.childNodes.indexOf(node);
      node.parentNode.childNodes.splice(idx, 1);
      node.parentNode = null;
    }
  },

  getFirstChild(node: ParentNode): null | ChildNode {
    return node.childNodes[0];
  },

  getChildNodes(node: ParentNode): ChildNode[] {
    return node.childNodes;
  },

  getParentNode(node: ChildNode): null | ParentNode {
    return node ? node.parentNode : null;
  },

  getTagName(element: Element): string {
    return element.tagName;
  },

  getNamespaceURI(): html.NS {
    return html.NS.HTML;
  },

  isElementNode(node: Node): node is Element {
    return Object.prototype.hasOwnProperty.call(node, "tagName");
  },

  setNodeSourceCodeLocation(): void {},

  getNodeSourceCodeLocation():
    | Token.ElementLocation
    | undefined
    | null {
    return null;
  },

  // Default methods (not in use for the HDML parsing)

  //Node construction
  createDocument(): Document {
    return {
      nodeName: "#document",
      childNodes: [],
    };
  },

  createCommentNode(): null {
    return null;
  },

  createTextNode(): null {
    return null;
  },

  //Tree mutation
  insertBefore(): void {},

  setTemplateContent(): void {},

  getTemplateContent(templateElement: Template): HDMLDocument {
    return templateElement.content;
  },

  setDocumentType(): void {},

  setDocumentMode(): void {},

  getDocumentMode(): html.DOCUMENT_MODE {
    return html.DOCUMENT_MODE.NO_QUIRKS;
  },

  insertText(): void {},

  insertTextBefore(): void {},

  adoptAttributes(): void {},

  //Tree traversing
  getAttrList(element: Element): Token.Attribute[] {
    return element.attrs;
  },

  //Node data

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

  updateNodeSourceCodeLocation(): void {},
};

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Connection,
  Field,
  Frame,
  Join,
  Model,
  Table,
  FilterClause,
  Filter,
  HDML_TAG_NAMES,
} from "@hdml/types";
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
import { HDDMData } from "../types/HDDMData";
import { getConnectionData } from "./getConnectionData";
import { getModelData } from "./getModelData";
import { getTableData } from "./getTableData";
import { getFrameData } from "./getFrameData";
import { getFieldData } from "./getFieldData";
import { getJoinData } from "./getJoinData";
import { getConnectiveData } from "./getConnectiveData";
import { getFilterData } from "./getFilterData";
import { elementPath } from "./elementPath";

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
      case HDML_TAG_NAMES.CONNECTION:
        hddmData = getConnectionData(attrs);
        break;
      case HDML_TAG_NAMES.MODEL:
        hddmData = getModelData(attrs);
        break;
      case HDML_TAG_NAMES.DATASET:
        hddmData = getTableData(attrs);
        break;
      case HDML_TAG_NAMES.FRAME:
        hddmData = getFrameData(attrs);
        break;
      case HDML_TAG_NAMES.JOIN:
        hddmData = getJoinData(attrs);
        break;
      case HDML_TAG_NAMES.CONNECTIVE:
        hddmData = getConnectiveData(attrs);
        break;
      case HDML_TAG_NAMES.FILTER:
        hddmData = getFilterData(attrs);
        break;
      case HDML_TAG_NAMES.FIELD:
        hddmData = getFieldData(attrs);
        break;
      case HDML_TAG_NAMES.FILTER_BY:
      case HDML_TAG_NAMES.GROUP_BY:
      case HDML_TAG_NAMES.SORT_BY:
      case HDML_TAG_NAMES.SPLIT_BY:
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
      loc: null,
      path: null,
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
      // The first moment the child<->parent link exists in both
      // directions, and `appendChild` only appends, so the node's
      // count of preceding same-tag siblings is already final.
      newNode.path = elementPath(newNode);
      hdmlTreeAdapter.appendHddmChild(newNode);
    }
  },

  appendHddmChild(element: ChildNode): void {
    let parent: null | ChildNode = null;
    let data: null | Model | Table | Frame | Join | FilterClause =
      null;
    switch (element?.nodeName) {
      case HDML_TAG_NAMES.CONNECTION:
        if (
          element.hddmData &&
          element.rootNode &&
          element.rootNode.hddm &&
          !~element.rootNode.hddm.connections.indexOf(
            element.hddmData as Connection,
          )
        ) {
          element.rootNode?.hddm?.connections.push(
            element.hddmData as Connection,
          );
        }
        break;
      case HDML_TAG_NAMES.MODEL:
        if (
          element.hddmData &&
          element.rootNode &&
          element.rootNode.hddm &&
          !~element.rootNode.hddm.models.indexOf(
            element.hddmData as Model,
          )
        ) {
          element.rootNode.hddm.models.push(
            element.hddmData as Model,
          );
        }
        break;
      case HDML_TAG_NAMES.DATASET:
        if (element.hddmData) {
          parent = hdmlTreeAdapter.getHdmlParentTag(element, [
            HDML_TAG_NAMES.MODEL,
          ]);
          if (parent) {
            data = parent.hddmData as Model;
            data.tables.push(element.hddmData as Table);
          }
        }
        break;
      case HDML_TAG_NAMES.FRAME:
        if (
          element.hddmData &&
          element.rootNode &&
          element.rootNode.hddm &&
          !~element.rootNode.hddm.frames.indexOf(
            element.hddmData as Frame,
          )
        ) {
          element.rootNode.hddm.frames.push(
            element.hddmData as Frame,
          );
        }
        break;
      case HDML_TAG_NAMES.JOIN:
        if (element.hddmData) {
          parent = hdmlTreeAdapter.getHdmlParentTag(element, [
            HDML_TAG_NAMES.MODEL,
          ]);
          if (parent) {
            data = parent.hddmData as Model;
            data.joins.push(element.hddmData as Join);
          }
        }
        break;
      case HDML_TAG_NAMES.CONNECTIVE:
        parent = hdmlTreeAdapter.getHdmlParentTag(element, [
          HDML_TAG_NAMES.JOIN,
          HDML_TAG_NAMES.FRAME,
          HDML_TAG_NAMES.CONNECTIVE,
        ]);
        if (parent) {
          switch (parent.nodeName as HDML_TAG_NAMES) {
            case HDML_TAG_NAMES.JOIN:
              data = parent.hddmData as Join;
              data.clause = element.hddmData as FilterClause;
              break;
            case HDML_TAG_NAMES.FRAME:
              data = parent.hddmData as Frame;
              data.filter_by = element.hddmData as FilterClause;
              break;
            case HDML_TAG_NAMES.CONNECTIVE:
              data = parent.hddmData as FilterClause;
              data.children.push(element.hddmData as FilterClause);
              break;
          }
        }
        break;
      case HDML_TAG_NAMES.FILTER:
        if (element.hddmData) {
          parent = hdmlTreeAdapter.getHdmlParentTag(element, [
            HDML_TAG_NAMES.CONNECTIVE,
          ]);
          if (parent) {
            data = parent.hddmData as FilterClause;
            data.filters.push(element.hddmData as Filter);
          }
        }
        break;
      case HDML_TAG_NAMES.FIELD:
        if (element.hddmData) {
          parent = hdmlTreeAdapter.getHdmlParentTag(element, [
            HDML_TAG_NAMES.DATASET,
            HDML_TAG_NAMES.FRAME,
            HDML_TAG_NAMES.GROUP_BY,
            HDML_TAG_NAMES.SORT_BY,
            HDML_TAG_NAMES.SPLIT_BY,
          ]);
          if (parent) {
            switch (parent.nodeName as HDML_TAG_NAMES) {
              case HDML_TAG_NAMES.DATASET:
              case HDML_TAG_NAMES.FRAME:
                data = parent.hddmData as Table | Frame;
                data.fields.push(element.hddmData as Field);
                break;
              case HDML_TAG_NAMES.GROUP_BY:
                parent = hdmlTreeAdapter.getHdmlParentTag(element, [
                  HDML_TAG_NAMES.FRAME,
                ]);
                if (parent) {
                  data = parent.hddmData as Frame;
                  data.group_by.push(element.hddmData as Field);
                }
                break;
              case HDML_TAG_NAMES.SORT_BY:
                parent = hdmlTreeAdapter.getHdmlParentTag(element, [
                  HDML_TAG_NAMES.FRAME,
                ]);
                if (parent) {
                  data = parent.hddmData as Frame;
                  data.sort_by.push(element.hddmData as Field);
                }
                break;
              case HDML_TAG_NAMES.SPLIT_BY:
                parent = hdmlTreeAdapter.getHdmlParentTag(element, [
                  HDML_TAG_NAMES.FRAME,
                ]);
                if (parent) {
                  data = parent.hddmData as Frame;
                  data.split_by.push(element.hddmData as Field);
                }
                break;
            }
          }
        }
        break;
      case HDML_TAG_NAMES.FILTER_BY:
        break;
    }
  },

  getHdmlParentTag(
    element: ChildNode,
    hdmlTag: HDML_TAG_NAMES[],
  ): null | ChildNode {
    if (!element) {
      return null;
    } else {
      let parent = element.parentNode;
      while (parent && hdmlTreeAdapter.isElementNode(parent)) {
        if (~hdmlTag.indexOf(parent.nodeName as HDML_TAG_NAMES)) {
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

  setNodeSourceCodeLocation(
    node: Node,
    location: Token.ElementLocation | null,
  ): void {
    // `insertText` appends nothing, so a whitespace run never
    // becomes a sibling of its own and `parse5` resolves
    // `siblings[idx - 1]` to the element PRECEDING the run, then
    // stamps the run's location onto it
    // (`parse5/dist/parser/index.js:359-367`).
    // `_attachElementToTree` always sets `startTag` when it has a
    // location (`:279`); the character-token stamp at `:367` never
    // does. So `startTag` is the exact discriminator between "this
    // is my own start tag" and "this is a run misfiled onto me".
    // Measured: deleting this guard does NOT move a real
    // element, because one always has a location by the time a
    // run reaches it, so `:367` is never called on it. What it
    // moves is a SYNTHESISED element, which reads falsy and so is
    // handed the run's location -- fabricating a source position,
    // and a path, for a node that has neither (RFC 019/002 §3.3).
    if (location !== null && location.startTag === undefined) {
      return;
    }
    // `:367` also passes `siblings[-1]`, i.e. `undefined`, when the
    // run has no preceding sibling; and `:320` passes a
    // `template`'s content, which is an `HDMLDocument` and has no
    // `loc`. A `null` location is legal and records that `parse5`
    // synthesised the node (`:309`, `:320`, `:326`).
    if (!node || !hdmlTreeAdapter.isElementNode(node)) {
      return;
    }
    node.loc = location;
  },

  getNodeSourceCodeLocation(
    node: Node,
  ): Token.ElementLocation | undefined | null {
    if (!node || !hdmlTreeAdapter.isElementNode(node)) {
      return null;
    }
    return node.loc;
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

  updateNodeSourceCodeLocation(
    node: Node,
    location: Partial<Token.ElementLocation>,
  ): void {
    // An element's extent is its own start tag, widened only by its
    // own end tag -- so an update that carries no `endTag` is not
    // about this element's extent and is dropped. `parse5` makes
    // exactly two such calls and they are identical in shape, a
    // bare `{endLine, endCol, endOffset}` triple: the destructive
    // one from `_insertCharacters` (`index.js:364`, a whitespace
    // run misfiled onto the preceding element) and the legitimate
    // one from `_setEndLocation`'s implied-close branch. Nothing
    // distinguishes them, so neither is taken: an element the
    // author never closed reports `endTag: undefined` and its
    // start tag's extent, which is honest, where an element whose
    // extent silently swallowed the next newline is not.
    if (location.endTag === undefined) {
      return;
    }
    if (!node || !hdmlTreeAdapter.isElementNode(node)) {
      return;
    }
    if (node.loc === null) {
      return;
    }
    Object.assign(node.loc, location);
  },
};

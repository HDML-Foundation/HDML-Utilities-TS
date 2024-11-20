/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDML_TAG_NAMES } from "@hdml/types";
import { html } from "parse5";
import { hdmlTreeAdapter } from "./hdmlTreeAdapter";

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

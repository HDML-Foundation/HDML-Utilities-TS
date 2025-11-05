/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { parseHTML, HTMLElement } from "@hdml/parser";
import { readJson } from "../io/readJson";
import { writeString } from "../io/writeString";
import { onDocumentSave } from "./onDocumentSave";

(() => {
  const { ctx, html } = readJson<{ ctx: unknown; html: string }>();
  const dom = parseHTML(html);
  const updatedDom: HTMLElement = onDocumentSave(ctx, dom);
  const updatedHtml = updatedDom.outerHTML;
  writeString(updatedHtml);
})();

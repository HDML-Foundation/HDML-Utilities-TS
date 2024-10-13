/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { parse, HTMLElement } from "node-html-parser";

/**
 * Parse the data provided, and return the root of the generated DOM
 * enabling further manipulation and traversal of the document's
 * structure.
 *
 * @param content The HTML content represented as a string.
 *
 * @returns The parsed `DOM` structure.
 *
 * ## Example:
 *
 * ```ts
 * const html = "<html>...</html>";
 * const dom = parseHTML(html);
 * console.log(dom);
 */
export function parseHTML(content: string): HTMLElement {
  return parse(content, {
    lowerCaseTagName: false,
    comment: false,
    voidTag: {
      tags: [
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
      ],
      closingSlash: true,
    },
    blockTextElements: {
      script: false,
      noscript: false,
      style: false,
      pre: true,
    },
  });
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { parse, HTMLElement } from "node-html-parser";

/**
 * Parse the data provided, and return the root of the generated DOM.
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

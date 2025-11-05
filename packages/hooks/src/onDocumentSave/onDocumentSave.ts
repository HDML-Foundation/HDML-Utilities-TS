/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HTMLElement } from "@hdml/parser";

export function onDocumentSave(
  ctx: unknown,
  dom: HTMLElement,
): HTMLElement {
  return dom;
}

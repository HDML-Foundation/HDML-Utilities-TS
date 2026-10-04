/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Element,
  ParentNode,
  ChildNode,
} from "../types/HDMLTreeAdapterMap";

/**
 * Narrows a node to an `Element`. Local on purpose: importing
 * `hdmlTreeAdapter` here would close an import cycle, because the
 * adapter imports `elementPath`.
 */
function isElement(node: null | ParentNode): node is Element {
  return (
    !!node && Object.prototype.hasOwnProperty.call(node, "tagName")
  );
}

/**
 * Counts the `element`'s 0-based position among its SAME-TAG
 * siblings in `parent`.
 */
function ordinalOf(parent: ParentNode, element: Element): number {
  let ordinal = 0;
  for (const sibling of parent.childNodes) {
    if (sibling === element) {
      break;
    }
    if (sibling && sibling.tagName === element.tagName) {
      ordinal++;
    }
  }
  return ordinal;
}

/**
 * Builds the tag-and-ordinal path of the `element`, root-ward, as
 * `hdml-model[0]/hdml-dataset[1]/hdml-field[3]` (RFC 019/002 §3.4).
 *
 * The ordinal counts **same-tag** siblings rather than all
 * children, so an unrelated sibling appearing before the element
 * does not shift it: an `hdml-field`'s path does not change when
 * an `hdml-join` is authored above it. And `appendChild` only ever
 * appends, so a node's count of *preceding* same-tag siblings is
 * final the moment it is linked -- which is why the path can be
 * stamped there.
 *
 * ★ A node `parse5` synthesised -- one whose `loc` is `null` --
 * contributes no segment. That is not cosmetic: `parseFragment`
 * wraps the document in a context element and a fake root
 * (`parse5/dist/parser/index.js:326`) and then adopts the authored
 * elements out of them, so the layer this skips is exactly the
 * layer the returned fragment does not have. Skipping it is what
 * makes the path resolvable against the tree a caller actually
 * holds. The one case it cannot describe is an element whose
 * synthesised ancestor DOES survive in the tree -- a `tbody`
 * `parse5` inserts into a literal `<table>` -- which no HDML tag
 * is ever subject to.
 *
 * @param element The element to describe.
 *
 * @returns The path, or `null` if the element has no parent or was
 * itself synthesised by `parse5`.
 */
export function elementPath(element: ChildNode): null | string {
  if (!element || !element.parentNode) {
    return null;
  }
  const segments: string[] = [];
  let node: null | Element = element;
  while (node) {
    const parent: null | ParentNode = node.parentNode;
    if (!parent) {
      break;
    }
    if (node.loc !== null) {
      segments.push(`${node.tagName}[${ordinalOf(parent, node)}]`);
    }
    node = isElement(parent) ? parent : null;
  }
  if (segments.length === 0) {
    return null;
  }
  return segments.reverse().join("/");
}

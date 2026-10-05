/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDML_TAG_NAMES } from "@hdml/types";
import {
  Element,
  ParentNode,
  ChildNode,
} from "../types/HDMLTreeAdapterMap";

const HDML_TAGS = new Set<string>(Object.values(HDML_TAG_NAMES));

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
 * Whether the node is one of the 34 HDML elements. Membership of
 * `HDML_TAG_NAMES` rather than an `hdml-` prefix test, so a
 * misspelled `<hdml-fild>` is not treated as vocabulary.
 */
function isHdml(node: null | ParentNode): boolean {
  // Not a `node is Element` guard: every caller has already
  // narrowed, and a guard would narrow the FALSE branch to `never`.
  return isElement(node) && HDML_TAGS.has(node.tagName);
}

/**
 * The element's nearest HDML ancestor, or `null` if it has none.
 * ★ This is deliberately the same walk as the adapter's
 * `getHdmlParentTag`: it climbs through ANY intervening element, so
 * a wrapper `<div>` is not a boundary. The path has to agree with
 * that, because that is the nesting the parser itself builds.
 */
function hdmlParentOf(element: Element): null | Element {
  let parent = element.parentNode;
  while (isElement(parent)) {
    if (isHdml(parent)) {
      return parent;
    }
    parent = parent.parentNode;
  }
  return null;
}

/**
 * The node to scan for an element's siblings when it has no HDML
 * ancestor: the topmost container reachable upwards.
 */
function topOf(element: Element): ParentNode {
  let node: ParentNode = element;
  while (isElement(node) && node.parentNode) {
    node = node.parentNode;
  }
  return node;
}

/**
 * Counts the HDML elements before `element` that share its tag AND
 * its nearest HDML ancestor, by scanning `scope` in document order
 * and never descending through an HDML element -- which is what
 * makes each one its own addressing level.
 */
function ordinalOf(
  scope: ParentNode,
  element: Element,
  parent: null | Element,
): number {
  let ordinal = 0;
  let done = false;
  const visit = (node: ParentNode): void => {
    if (done) {
      return;
    }
    for (const child of node.childNodes) {
      if (done || !child) {
        continue;
      }
      if (child === element) {
        done = true;
        return;
      }
      if (isHdml(child)) {
        if (child.tagName === element.tagName) {
          ordinal++;
        }
        // An HDML element opens its own level, so its subtree
        // cannot hold a sibling of this one.
        continue;
      }
      visit(child);
    }
  };
  visit(parent ?? scope);
  return ordinal;
}

/**
 * Builds the tag-and-ordinal path of the `element`, root-ward, as
 * `hdml-model[0]/hdml-dataset[1]/hdml-field[3]` (RFC 019/002 §3.4).
 *
 * ★ **Every segment is an HDML element, and nothing else is.** The
 * parser ignores the surrounding HTML -- `getHdmlParentTag` climbs
 * through any intervening element -- so two `<hdml-field>`s in
 * different wrapper `<div>`s are siblings of the same
 * `<hdml-dataset>`, and the path says so. Including the HTML would
 * make the path disagree with the document the parser actually
 * built: both fields would read `hdml-field[0]`, distinguished only
 * by a `div` ordinal the semantics discard, and wrapping the markup
 * in one more element would rewrite every path beneath it.
 *
 * ★ It also means no special case is needed for the nodes `parse5`
 * invents -- a fake root, a fake `<br>`, the `<tbody>` it inserts
 * into a literal `<table>` -- because none of them is an HDML tag.
 *
 * The ordinal counts **same-tag** siblings rather than all
 * children, so an `hdml-field`'s path does not change when an
 * `hdml-join` is authored above it. And `appendChild` only ever
 * appends, so a node's count of *preceding* siblings is final the
 * moment it is linked, which is why the path can be stamped there.
 *
 * @param element The element to describe.
 *
 * @returns The path, or `null` if the element is not an HDML
 * element or is not linked to a parent.
 */
export function elementPath(element: ChildNode): null | string {
  if (!element || !element.parentNode || !isHdml(element)) {
    return null;
  }
  const scope = topOf(element);
  const segments: string[] = [];
  let node: null | Element = element;
  while (node) {
    const parent = hdmlParentOf(node);
    segments.push(
      `${node.tagName}[${ordinalOf(scope, node, parent)}]`,
    );
    node = parent;
  }
  return segments.reverse().join("/");
}

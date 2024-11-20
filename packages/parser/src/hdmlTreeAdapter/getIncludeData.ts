/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Include, INCLUDE_ATTRS_LIST } from "@hdml/types";
import { Token } from "parse5";

export function getIncludeData(
  attrs: Token.Attribute[],
): null | Include {
  let include: null | Include = null;
  attrs.forEach((attr) => {
    switch (attr.name as INCLUDE_ATTRS_LIST) {
      case INCLUDE_ATTRS_LIST.PATH:
        include = { path: attr.value };
        break;
    }
  });
  return include;
}

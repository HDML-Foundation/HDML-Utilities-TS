/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IInclude } from "@hdml/schemas";
import { Token } from "parse5";

export function getIncludeData(
  attrs: Token.Attribute[],
): null | IInclude {
  let include: null | IInclude = null;
  attrs.forEach((attr) => {
    if (attr.name === "path") {
      include = { path: attr.value };
    }
  });
  return include;
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IModel } from "@hdml/schemas";
import { Token } from "parse5";

export function getModelData(
  attrs: Token.Attribute[],
): null | IModel {
  let model: null | IModel = null;
  attrs.forEach((attr) => {
    if (attr.name === "name") {
      model = {
        name: attr.value,
        tables: [],
        joins: [],
      };
    }
  });
  return model;
}

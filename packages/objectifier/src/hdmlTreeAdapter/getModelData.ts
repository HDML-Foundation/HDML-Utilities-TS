/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IModel } from "@hdml/schemas";
import { Token } from "parse5";
import { MODEL_ATTRS_LIST } from "../enums/MODEL_ATTR_LIST";

export function getModelData(
  attrs: Token.Attribute[],
): null | IModel {
  let model: null | IModel = null;
  attrs.forEach((attr) => {
    switch (attr.name as MODEL_ATTRS_LIST) {
      case MODEL_ATTRS_LIST.NAME:
        model = {
          name: attr.value,
          tables: [],
          joins: [],
        };
        break;
    }
  });
  return model;
}

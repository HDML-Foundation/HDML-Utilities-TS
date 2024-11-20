/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Model, MODEL_ATTRS_LIST } from "@hdml/types";
import { Token } from "parse5";

export function getModelData(attrs: Token.Attribute[]): null | Model {
  let name: null | string = null;
  let description: null | string = null;
  attrs.forEach((attr) => {
    switch (attr.name as MODEL_ATTRS_LIST) {
      case MODEL_ATTRS_LIST.NAME:
        name = attr.value;
        break;
      case MODEL_ATTRS_LIST.DESCRIPTION:
        description = attr.value;
        break;
    }
  });

  if (!name) {
    return null;
  }

  return {
    name,
    description,
    tables: [],
    joins: [],
  };
}

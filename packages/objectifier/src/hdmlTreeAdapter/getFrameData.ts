/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { IFrame } from "@hdml/schemas";
import { Token } from "parse5";

// {
//   name: string;
//   source: string;
//   offset: number;
//   limit: number;
//   fields: Field[];
//   filter_by: FilterClause;
//   group_by: Field[];
//   split_by: Field[];
//   sort_by: Field[];
// }

export function getFrameData(
  attrs: Token.Attribute[],
): null | IFrame {
  let model: null | IFrame = null;
  // attrs.forEach((attr) => {
  //   if (attr.name === "name") {
  //     model = {
  //       name: attr.value,
  //       tables: [],
  //       joins: [],
  //     };
  //   }
  // });
  return model;
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { FrameStruct } from "@hdml/schemas";
import { Frame } from "@hdml/types";
import { objectifyField } from "./objectifyField";
import { objectifyFilterClause } from "./objectifyFilterClause";

/**
 * Converts a FlatBuffers `FrameStruct` to a TypeScript `Frame`
 * object.
 *
 * This function deserializes a FlatBuffers `FrameStruct` structure
 * into a TypeScript `Frame` interface object. The frame represents
 * a query structure defined over a Model or another Frame.
 *
 * @param frameStruct The FlatBuffers `FrameStruct` object to convert.
 *
 * @returns The converted `Frame` object.
 *
 * @example
 * ```ts
 * const frameStruct: FrameStruct = ...;
 * const frame = objectifyFrame(frameStruct);
 * ```
 */
export function objectifyFrame(frameStruct: FrameStruct): Frame {
  const name = frameStruct.name() || "";
  const description = frameStruct.description();
  const source = frameStruct.source() || "";
  const offset = Number(frameStruct.offset());
  const limit = Number(frameStruct.limit());

  const fields = [];
  for (let i = 0; i < frameStruct.fieldsLength(); i++) {
    const fieldStruct = frameStruct.fields(i);
    if (fieldStruct) {
      fields.push(objectifyField(fieldStruct));
    }
  }

  const groupBy = [];
  for (let i = 0; i < frameStruct.groupByLength(); i++) {
    const fieldStruct = frameStruct.groupBy(i);
    if (fieldStruct) {
      groupBy.push(objectifyField(fieldStruct));
    }
  }

  const splitBy = [];
  for (let i = 0; i < frameStruct.splitByLength(); i++) {
    const fieldStruct = frameStruct.splitBy(i);
    if (fieldStruct) {
      splitBy.push(objectifyField(fieldStruct));
    }
  }

  const sortBy = [];
  for (let i = 0; i < frameStruct.sortByLength(); i++) {
    const fieldStruct = frameStruct.sortBy(i);
    if (fieldStruct) {
      sortBy.push(objectifyField(fieldStruct));
    }
  }

  const filterByStruct = frameStruct.filterBy();
  if (!filterByStruct) {
    throw new Error("Filter by clause is required");
  }
  const filterBy = objectifyFilterClause(filterByStruct);

  return {
    name,
    description,
    source,
    offset,
    limit,
    fields,
    filter_by: filterBy,
    group_by: groupBy,
    split_by: splitBy,
    sort_by: sortBy,
  };
}

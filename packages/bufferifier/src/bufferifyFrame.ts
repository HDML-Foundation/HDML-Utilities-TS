/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { FrameStruct } from "@hdml/schemas";
import { Frame } from "@hdml/types";
import { bufferifyField } from "./bufferifyField";
import { bufferifyFilterClause } from "./bufferifyFilterClause";

/**
 * Converts a TypeScript `Frame` object into a FlatBuffers
 * `FrameStruct`.
 *
 * This function takes an `Frame` object, which represents a query
 * structure in a data model, and serializes it into a FlatBuffers
 * `FrameStruct` structure. The `FrameStruct` structure contains
 * information about the fields to retrieve, filtering, grouping,
 * sorting, and other query conditions.
 *
 * The function recursively converts nested fields, such as
 * `filter_by` ensuring all components of the `FrameStruct` object are
 * serialized into their FlatBuffers counterparts.
 *
 * @param builder The FlatBuffers `Builder` instance used to build and
 * serialize the `FrameStruct` object.
 *
 * @param frame The TypeScript `FrameStruct` object to convert. This
 * object contains information about fields, filters, grouping,
 * sorting, and more.
 *
 * @returns The offset of the serialized `FrameStruct` structure,
 * which is used by FlatBuffers to construct the final buffer.
 *
 * ## Example:
 * ```typescript
 * const builder = new Builder(1024);
 * const frame: FrameStruct = {
 *   name: "sales_frame",
 *   source: "sales_model",
 *   offset: 0,
 *   limit: 100,
 *   fields: [{ name: "total_sales", type: "float" }],
 *   filter_by: { type: "expression", filters: [] },
 *   group_by: [],
 *   split_by: [],
 *   sort_by: [],
 * };
 * const frameOffset = bufferifyFrame(builder, frame);
 * builder.finish(frameOffset);
 * ```
 */
export function bufferifyFrame(
  builder: Builder,
  frame: Frame,
): number {
  const nameOffset = builder.createString(frame.name);
  const sourceOffset = builder.createString(frame.source);
  const fieldOffsets = frame.fields.map((f) =>
    bufferifyField(builder, f),
  );
  const fieldsVector = FrameStruct.createFieldsVector(
    builder,
    fieldOffsets,
  );
  const groupByOffsets = frame.group_by.map((f) =>
    bufferifyField(builder, f),
  );
  const groupByVector = FrameStruct.createGroupByVector(
    builder,
    groupByOffsets,
  );
  const splitByOffsets = frame.split_by.map((f) =>
    bufferifyField(builder, f),
  );
  const splitByVector = FrameStruct.createSplitByVector(
    builder,
    splitByOffsets,
  );
  const sortByOffsets = frame.sort_by.map((f) =>
    bufferifyField(builder, f),
  );
  const sortByVector = FrameStruct.createSortByVector(
    builder,
    sortByOffsets,
  );
  const filterByOffset = bufferifyFilterClause(
    builder,
    frame.filter_by,
  );

  FrameStruct.startFrameStruct(builder);
  FrameStruct.addName(builder, nameOffset);
  FrameStruct.addSource(builder, sourceOffset);
  FrameStruct.addOffset(builder, BigInt(frame.offset));
  FrameStruct.addLimit(builder, BigInt(frame.limit));
  FrameStruct.addFields(builder, fieldsVector);
  FrameStruct.addFilterBy(builder, filterByOffset);
  FrameStruct.addGroupBy(builder, groupByVector);
  FrameStruct.addSplitBy(builder, splitByVector);
  FrameStruct.addSortBy(builder, sortByVector);

  return FrameStruct.endFrameStruct(builder);
}

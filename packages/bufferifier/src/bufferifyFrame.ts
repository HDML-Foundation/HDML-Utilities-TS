/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { IFrame, Frame } from "@hdml/schemas";
import { bufferifyField } from "./bufferifyField";
import { bufferifyFilterClause } from "./bufferifyFilterClause";

/**
 * Converts a TypeScript `IFrame` object into a FlatBuffers `Frame`.
 *
 * This function takes an `IFrame` object, which represents a query
 * structure in a data model, and serializes it into a FlatBuffers
 * `Frame` structure. The `Frame` structure contains information about
 * the fields to retrieve, filtering, grouping, sorting, and other
 * query conditions.
 *
 * The function recursively converts nested fields, such as
 * `filter_by` ensuring all components of the `Frame` object are
 * serialized into their FlatBuffers counterparts.
 *
 * @param builder - The FlatBuffers `Builder` instance used to build
 *                  and serialize the `Frame` object.
 * @param frame - The TypeScript `Frame` object to convert. This
 *                object contains information about fields, filters,
 *                grouping, sorting, and more.
 *
 * @returns The offset of the serialized `Frame` structure, which is
 *          used by FlatBuffers to construct the final buffer.
 *
 * ## Example:
 * ```typescript
 * const builder = new Builder(1024);
 * const frame: Frame = {
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
  frame: IFrame,
): number {
  const nameOffset = builder.createString(frame.name);
  const sourceOffset = builder.createString(frame.source);

  const fieldOffsets = frame.fields.map((f) =>
    bufferifyField(builder, f),
  );
  const fieldsVector = Frame.createFieldsVector(
    builder,
    fieldOffsets,
  );

  const groupByOffsets = frame.group_by.map((f) =>
    bufferifyField(builder, f),
  );
  const groupByVector = Frame.createGroupByVector(
    builder,
    groupByOffsets,
  );

  const splitByOffsets = frame.split_by.map((f) =>
    bufferifyField(builder, f),
  );
  const splitByVector = Frame.createSplitByVector(
    builder,
    splitByOffsets,
  );

  const sortByOffsets = frame.sort_by.map((f) =>
    bufferifyField(builder, f),
  );
  const sortByVector = Frame.createSortByVector(
    builder,
    sortByOffsets,
  );

  const filterByOffset = bufferifyFilterClause(
    builder,
    frame.filter_by,
  );

  Frame.startFrame(builder);
  Frame.addName(builder, nameOffset);
  Frame.addSource(builder, sourceOffset);
  Frame.addOffset(builder, BigInt(frame.offset));
  Frame.addLimit(builder, BigInt(frame.limit));
  Frame.addFields(builder, fieldsVector);
  Frame.addFilterBy(builder, filterByOffset);
  Frame.addGroupBy(builder, groupByVector);
  Frame.addSplitBy(builder, splitByVector);
  Frame.addSortBy(builder, sortByVector);
  return Frame.endFrame(builder);
}

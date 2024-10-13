/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import {
  FilterTypeEnum,
  FilterOptionsStruct,
  FilterClauseStruct,
  KeysParametersStruct,
  ExpressionParametersStruct,
  NamedParametersStruct,
  FilterStruct,
} from "@hdml/schemas";
import {
  FilterClause,
  Filter,
  KeysParameters,
  ExpressionParameters,
  NamedParameters,
} from "@hdml/types";

/**
 * Converts a `FilterClause` object into a FlatBuffers
 * `FilterClauseStruct`.
 *
 * This function serializes a `FilterClause` object, which consists
 * of filter conditions and optional nested child clauses, into a
 * corresponding FlatBuffers `FilterClauseStruct` structure. It
 * processes two main elements of the clause: `filters` (the array of
 * filter conditions) and `children` (the nested `FilterClauseStruct`
 * instances within the parent clause). Each element is serialized and
 * stored as a vector in FlatBuffers, which can later be deserialized
 * to reconstruct the original `FilterClauseStruct` object.
 *
 * @param builder The FlatBuffers `Builder` instance, responsible
 * for constructing the serialized buffer.
 *
 * @param clause The `FilterClause` object to convert. This object
 * contains an array of `Filter` objects and potentially an array
 * of nested `FilterClauseStruct` instances (`children`), which are
 * all serialized into FlatBuffers structures.
 *
 * @returns The offset of the serialized `FilterClauseStruct`
 * structure. This offset is used by FlatBuffers to locate the
 * `FilterClauseStruct` within the generated binary buffer.
 *
 * ## Example:
 *
 * ```typescript
 * const builder = new flatbuffers.Builder(1024);
 * const filterClause: FilterClause = {
 *   type: FilterOperator.And,
 *   filters: [{ type: FilterTypeEnum.Keys, options: {...} }],
 *   children: []
 * };
 * const clauseOffset = bufferifyFilterClause(builder, filterClause);
 * builder.finish(clauseOffset);
 * ```
 */
export function bufferifyFilterClause(
  builder: Builder,
  clause: FilterClause,
): number {
  const filtersOffsets = clause.filters.map((f) =>
    bufferifyFilter(builder, f),
  );
  const filtersVector = FilterClauseStruct.createFiltersVector(
    builder,
    filtersOffsets,
  );
  const childrenOffsets = clause.children.map((c) =>
    bufferifyFilterClause(builder, c),
  );
  const childrenVector = FilterClauseStruct.createChildrenVector(
    builder,
    childrenOffsets,
  );
  return FilterClauseStruct.createFilterClauseStruct(
    builder,
    clause.type,
    filtersVector,
    childrenVector,
  );
}

/**
 * Converts an `Filter` object into a FlatBuffers `FilterStruct`.
 *
 * @param builder The FlatBuffers `Builder` instance.
 *
 * @param filter The `Filter` object to convert.
 *
 * @returns The offset of the serialized `FilterStruct` structure.
 */
function bufferifyFilter(builder: Builder, filter: Filter): number {
  let filterOffset = 0;
  let optionsOffset: number;
  switch (filter.type) {
    case FilterTypeEnum.Keys:
      optionsOffset = createKeysOptions(builder, filter.options);
      filterOffset = FilterStruct.createFilterStruct(
        builder,
        filter.type,
        FilterOptionsStruct.KeysParametersStruct,
        optionsOffset,
      );
      break;
    case FilterTypeEnum.Expression:
      optionsOffset = createExpressionOptions(
        builder,
        filter.options,
      );
      filterOffset = FilterStruct.createFilterStruct(
        builder,
        filter.type,
        FilterOptionsStruct.ExpressionParametersStruct,
        optionsOffset,
      );
      break;
    case FilterTypeEnum.Named:
      optionsOffset = createNamedOptions(builder, filter.options);
      filterOffset = FilterStruct.createFilterStruct(
        builder,
        filter.type,
        FilterOptionsStruct.NamedParametersStruct,
        optionsOffset,
      );
      break;
  }
  return filterOffset;
}

/**
 * Creates FlatBuffers `KeysParametersStruct` for a `Keys` filter
 * type.
 *
 * @param builder The FlatBuffers `Builder` instance.
 *
 * @param parameters The `KeysParameters` object containing left
 * and right keys.
 *
 * @returns The offset for the serialized `KeysParametersStruct`
 * structure.
 */
function createKeysOptions(
  builder: Builder,
  parameters: KeysParameters,
): number {
  const leftOffset = builder.createString(parameters.left);
  const rightOffset = builder.createString(parameters.right);
  return KeysParametersStruct.createKeysParametersStruct(
    builder,
    leftOffset,
    rightOffset,
  );
}

/**
 * Creates FlatBuffers `ExpressionParametersStruct` for an
 * `Expression` filter.
 *
 * @param builder The FlatBuffers `Builder` instance.
 *
 * @param parameters The `ExpressionParameters` object containing
 * the clause.
 *
 * @returns The offset for the serialized `ExpressionParametersStruct`
 * structure.
 */
function createExpressionOptions(
  builder: Builder,
  parameters: ExpressionParameters,
): number {
  const clauseOffset = builder.createString(parameters.clause);
  const s =
    ExpressionParametersStruct.createExpressionParametersStruct(
      builder,
      clauseOffset,
    );
  return s;
}

/**
 * Creates FlatBuffers `NamedParametersStruct` for a `Named` filter
 * type.
 *
 * @param builder The FlatBuffers `Builder` instance.
 *
 * @param parameters The `NamedParameters` object containing the
 * name, field, and values.
 *
 * @returns The offset for the serialized `NamedParametersStruct`
 * structure.
 */
function createNamedOptions(
  builder: Builder,
  parameters: NamedParameters,
): number {
  const fieldOffset = builder.createString(parameters.field);
  const valuesOffsets = parameters.values.map((v) =>
    builder.createString(v),
  );
  const valuesVector = NamedParametersStruct.createValuesVector(
    builder,
    valuesOffsets,
  );
  return NamedParametersStruct.createNamedParametersStruct(
    builder,
    parameters.name,
    fieldOffset,
    valuesVector,
  );
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import {
  // enums
  FilterType,
  FilterOptions,
  // interfaces
  IFilterClause,
  IFilter,
  IKeysParameters,
  IExpressionParameters,
  INamedParameters,
  // structures
  FilterClause,
  KeysParameters,
  ExpressionParameters,
  NamedParameters,
  Filter,
} from "@hdml/schemas";

/**
 * Converts a `IFilterClause` object into a FlatBuffers
 * `FilterClause`.
 *
 * This function serializes a `IFilterClause` object, which consists
 * of filter conditions and optional nested child clauses, into a
 * corresponding FlatBuffers `FilterClause` structure. It processes
 * two main elements of the clause: `filters` (the array of filter
 * conditions) and `children` (the nested `FilterClause` instances
 * within the parent clause). Each element is serialized and stored
 * as a vector in FlatBuffers, which can later be deserialized to
 * reconstruct the original `FilterClause` object.
 *
 * @param builder - The FlatBuffers `Builder` instance, responsible
 * for constructing the serialized buffer.
 *
 * @param clause - The `IFilterClause` object to convert. This object
 * contains an array of `IFilter` objects and potentially an array
 * of nested `FilterClause` instances (`children`), which are all
 * serialized into FlatBuffers structures.
 *
 * @returns The offset of the serialized `FilterClause` structure.
 * This offset is used by FlatBuffers to locate the `FilterClause`
 * within the generated binary buffer.
 *
 * ## Example:
 *
 * ```typescript
 * const builder = new flatbuffers.Builder(1024);
 * const filterClause: IFilterClause = {
 *   type: FilterOperator.And,
 *   filters: [{ type: FilterType.Keys, options: {...} }],
 *   children: []
 * };
 * const clauseOffset = bufferifyFilterClause(builder, filterClause);
 * builder.finish(clauseOffset);
 * ```
 */
export function bufferifyFilterClause(
  builder: Builder,
  clause: IFilterClause,
): number {
  const filtersOffsets = clause.filters.map((f) =>
    bufferifyFilter(builder, f),
  );
  const filtersVector = FilterClause.createFiltersVector(
    builder,
    filtersOffsets,
  );
  const childrenOffsets = clause.children.map((c) =>
    bufferifyFilterClause(builder, c),
  );
  const childrenVector = FilterClause.createChildrenVector(
    builder,
    childrenOffsets,
  );
  return FilterClause.createFilterClause(
    builder,
    clause.type,
    filtersVector,
    childrenVector,
  );
}

/**
 * Converts an `IFilter` object into a FlatBuffers `Filter`.
 *
 * @param builder - The FlatBuffers `Builder` instance.
 * @param filter - The `IFilter` object to convert.
 *
 * @returns The offset of the serialized `Filter` structure.
 */
function bufferifyFilter(builder: Builder, filter: IFilter): number {
  let filterOffset = 0;
  let optionsOffset: number;
  switch (filter.type) {
    case FilterType.Keys:
      optionsOffset = createKeysOptions(builder, filter.options);
      filterOffset = Filter.createFilter(
        builder,
        filter.type,
        FilterOptions.KeysParameters,
        optionsOffset,
      );
      break;
    case FilterType.Expression:
      optionsOffset = createExpressionOptions(
        builder,
        filter.options,
      );
      filterOffset = Filter.createFilter(
        builder,
        filter.type,
        FilterOptions.ExpressionParameters,
        optionsOffset,
      );
      break;
    case FilterType.Named:
      optionsOffset = createNamedOptions(builder, filter.options);
      filterOffset = Filter.createFilter(
        builder,
        filter.type,
        FilterOptions.NamedParameters,
        optionsOffset,
      );
      break;
  }
  return filterOffset;
}

/**
 * Creates FlatBuffers `KeysParameters` for a `Keys` filter type.
 *
 * @param builder - The FlatBuffers `Builder` instance.
 * @param parameters - The `IKeysParameters` object containing left
 *                     and right keys.
 *
 * @returns The offset for the serialized `KeysParameters` structure.
 */
function createKeysOptions(
  builder: Builder,
  parameters: IKeysParameters,
): number {
  const leftOffset = builder.createString(parameters.left);
  const rightOffset = builder.createString(parameters.right);
  return KeysParameters.createKeysParameters(
    builder,
    leftOffset,
    rightOffset,
  );
}

/**
 * Creates FlatBuffers `ExpressionParameters` for an `Expression`
 * filter.
 *
 * @param builder - The FlatBuffers `Builder` instance.
 * @param parameters - The `IExpressionParameters` object containing
 *                     the clause.
 *
 * @returns The offset for the serialized `ExpressionParameters`
 * structure.
 */
function createExpressionOptions(
  builder: Builder,
  parameters: IExpressionParameters,
): number {
  const clauseOffset = builder.createString(parameters.clause);
  return ExpressionParameters.createExpressionParameters(
    builder,
    clauseOffset,
  );
}

/**
 * Creates FlatBuffers `NamedParameters` for a `Named` filter type.
 *
 * @param builder - The FlatBuffers `Builder` instance.
 * @param parameters - The `INamedParameters` object containing the
 *                     name, field, and values.
 *
 * @returns The offset for the serialized `NamedParameters` structure.
 */
function createNamedOptions(
  builder: Builder,
  parameters: INamedParameters,
): number {
  const fieldOffset = builder.createString(parameters.field);
  const valuesOffsets = parameters.values.map((v) =>
    builder.createString(v),
  );
  const valuesVector = NamedParameters.createValuesVector(
    builder,
    valuesOffsets,
  );
  return NamedParameters.createNamedParameters(
    builder,
    parameters.name,
    fieldOffset,
    valuesVector,
  );
}

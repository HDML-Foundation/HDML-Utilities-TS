/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  FilterClauseStruct,
  FilterStruct,
  ExpressionParametersStruct,
  KeysParametersStruct,
  NamedParametersStruct,
  FilterTypeEnum,
} from "@hdml/schemas";
import {
  FilterClause,
  Filter,
  ExpressionParameters,
  KeysParameters,
  NamedParameters,
} from "@hdml/types";

/**
 * Converts a FlatBuffers `FilterClauseStruct` to a TypeScript
 * `FilterClause` object.
 *
 * This function deserializes a FlatBuffers `FilterClauseStruct`
 * structure into a TypeScript `FilterClause` interface object. The
 * clause consists of filter conditions and optional nested child
 * clauses.
 *
 * @param clauseStruct The FlatBuffers `FilterClauseStruct` object
 * to convert.
 *
 * @returns The converted `FilterClause` object.
 *
 * @example
 * ```ts
 * const clauseStruct: FilterClauseStruct = ...;
 * const clause = objectifyFilterClause(clauseStruct);
 * ```
 */
export function objectifyFilterClause(
  clauseStruct: FilterClauseStruct,
): FilterClause {
  const type = clauseStruct.type();

  const filters: Filter[] = [];
  for (let i = 0; i < clauseStruct.filtersLength(); i++) {
    const filterStruct = clauseStruct.filters(i);
    if (filterStruct) {
      filters.push(objectifyFilter(filterStruct));
    }
  }

  const children: FilterClause[] = [];
  for (let i = 0; i < clauseStruct.childrenLength(); i++) {
    const childStruct = clauseStruct.children(i);
    if (childStruct) {
      children.push(objectifyFilterClause(childStruct));
    }
  }

  return {
    type,
    filters,
    children,
  };
}

/**
 * Converts a FlatBuffers `FilterStruct` to a TypeScript `Filter`
 * object.
 *
 * @param filterStruct The FlatBuffers `FilterStruct` object to
 * convert.
 *
 * @returns The converted `Filter` object.
 */
function objectifyFilter(filterStruct: FilterStruct): Filter {
  const filterType = filterStruct.type();

  switch (filterType) {
    case FilterTypeEnum.Keys: {
      const params = filterStruct.options(
        new KeysParametersStruct(),
      ) as unknown as KeysParametersStruct;
      if (!params) {
        throw new Error("Keys parameters struct is invalid");
      }
      const keysParams: KeysParameters = {
        left: params.left() || "",
        right: params.right() || "",
      };
      return {
        type: filterType,
        options: keysParams,
      };
    }

    case FilterTypeEnum.Expression: {
      const params = filterStruct.options(
        new ExpressionParametersStruct(),
      ) as unknown as ExpressionParametersStruct;
      if (!params) {
        throw new Error("Expression parameters struct is invalid");
      }
      const exprParams: ExpressionParameters = {
        clause: params.clause() || "",
      };
      return {
        type: filterType,
        options: exprParams,
      };
    }

    case FilterTypeEnum.Named: {
      const params = filterStruct.options(
        new NamedParametersStruct(),
      ) as unknown as NamedParametersStruct;
      if (!params) {
        throw new Error("Named parameters struct is invalid");
      }
      const values: string[] = [];
      for (let i = 0; i < params.valuesLength(); i++) {
        const value = params.values(i);
        if (value) {
          values.push(value);
        }
      }
      const namedParams: NamedParameters = {
        name: params.name(),
        field: params.field() || "",
        values,
      };
      return {
        type: filterType,
        options: namedParams,
      };
    }

    default: {
      const _exhaustive: never = filterType;
      throw new Error(
        `Unsupported filter type: ${String(_exhaustive)}`,
      );
    }
  }
}

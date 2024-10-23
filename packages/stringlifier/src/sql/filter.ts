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

export function objectifyJoinClause(
  clause: FilterClauseStruct,
): FilterClause {
  const type = clause.type();
  const filters: Filter[] = [];
  const children: FilterClause[] = [];
  for (let i = 0; i < clause.filtersLength(); i++) {
    const filter = clause.filters(i);
    if (filter) {
      filters.push(<Filter>{
        type: filter.type(),
        options: objectifyFilterOptions(filter),
      });
    }
  }
  for (let i = 0; i < clause.childrenLength(); i++) {
    const child = clause.children(i)!;
    children.push(objectifyJoinClause(child));
  }
  return {
    type,
    filters,
    children,
  };
}

export function objectifyFilterOptions(
  filter: FilterStruct,
): ExpressionParameters | KeysParameters | NamedParameters {
  let opts: unknown;
  let data: ExpressionParameters | KeysParameters | NamedParameters;
  switch (filter.type()) {
    case FilterTypeEnum.Expression:
      opts = filter.options(new ExpressionParametersStruct());
      data = {
        clause: (<ExpressionParametersStruct>opts).clause() || "",
      };
      return data;
    case FilterTypeEnum.Keys:
      opts = filter.options(new KeysParametersStruct());
      data = {
        left: (<KeysParametersStruct>opts).left() || "",
        right: (<KeysParametersStruct>opts).right() || "",
      };
      return data;
    case FilterTypeEnum.Named:
      opts = filter.options(new NamedParametersStruct());
      data = {
        name: (<NamedParametersStruct>opts).name(),
        field: (<NamedParametersStruct>opts).field() || "",
        values: [],
      };
      for (
        let i = 0;
        i < (<NamedParametersStruct>opts).valuesLength();
        i++
      ) {
        data.values.push((<NamedParametersStruct>opts).values(i));
      }
      return data;
  }
}

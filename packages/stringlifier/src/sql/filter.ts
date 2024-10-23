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
  FilterOperatorEnum,
} from "@hdml/schemas";
import {
  FilterClause,
  Filter,
  ExpressionParameters,
  KeysParameters,
  NamedParameters,
} from "@hdml/types";
import { t } from "../constants";

export function getFilterClauseSQL(
  clause: FilterClause,
  level = 0,
  join?: { left: string; right: string },
): string {
  const prefix = t.repeat(level);

  let op = "";
  let sql = "";

  switch (clause.type) {
    case FilterOperatorEnum.And:
      sql = sql + `${prefix}1 = 1\n`;
      op = `${prefix}and `;
      break;
    case FilterOperatorEnum.Or:
      sql = sql + `${prefix}1 != 1\n`;
      op = `${prefix}or `;
      break;
    case FilterOperatorEnum.None:
    default:
      op = `${prefix}`;
      break;
  }

  sql =
    sql +
    clause.filters
      .map((f) => `${op}${getFilterSQL(f, join)}\n`)
      .join("");

  clause.children.forEach((child) => {
    sql = sql + `${op}(\n`;
    sql = sql + getFilterClauseSQL(child, level + 1, join);
    sql = sql + `${prefix})\n`;
  });

  return sql;
}

export function getFilterSQL(
  filter: Filter,
  join?: { left: string; right: string },
): string {
  switch (filter.type) {
    case FilterTypeEnum.Keys:
      // if (
      //   !join?.left ||
      //   !join?.right ||
      //   !filter.options.left ||
      //   !filter.options.right
      // ) {
      //   return "";
      // }
      return getKeysFilterSQL(join, filter);
    case FilterTypeEnum.Expression:
      return getExpressionFilterSQL(filter);
    case FilterTypeEnum.Named:
      return getNamedFilterSQL(filter);
  }
}

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

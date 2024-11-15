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
  FilterNameEnum,
} from "@hdml/schemas";
import {
  FilterClause,
  Filter,
  ExpressionParameters,
  KeysParameters,
  NamedParameters,
} from "@hdml/types";
import { t } from "./constants";

export function getFilterClauseSQL(
  clause: FilterClause,
  level = 0,
  join?: { left: string; right: string },
): string {
  const prefix = t.repeat(level);

  let op = "";
  let sql = "";
  const filters =
    clause.type === FilterOperatorEnum.None
      ? clause.filters.length
        ? [clause.filters[0]]
        : []
      : clause.filters;
  const children =
    clause.type === FilterOperatorEnum.None ? [] : clause.children;

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
    filters.map((f) => `${op}${getFilterSQL(f, join)}\n`).join("");

  children.forEach((child) => {
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
      return getKeysFilterSQL(filter, join);
    case FilterTypeEnum.Expression:
      return getExpressionFilterSQL(filter);
    case FilterTypeEnum.Named:
      return getNamedFilterSQL(filter);
  }
}

export function getKeysFilterSQL(
  filter: Filter,
  join?: { left: string; right: string },
): string {
  const opts = <KeysParameters>filter.options;
  if (!join?.left || !join?.right || !opts.left || !opts.right) {
    return "false";
  } else {
    return (
      `"${join.left}"."${opts.left}" = ` +
      `"${join.right}"."${opts.right}"`
    );
  }
}

export function getExpressionFilterSQL(filter: Filter): string {
  const clause = (<ExpressionParameters>filter.options).clause;
  if (!clause) {
    return "false";
  } else {
    return clause;
  }
}

export function getNamedFilterSQL(filter: Filter): string {
  const strRE = /^(')(.*)(')$/gm;
  const opts = <NamedParameters>filter.options;
  let sql = "";
  let re: RegExpExecArray | null = null;
  if (
    !opts.field ||
    (!opts.values.length &&
      opts.name !== FilterNameEnum.IsNull &&
      opts.name !== FilterNameEnum.IsNotNull)
  ) {
    sql = "false";
  } else {
    switch (opts.name) {
      case FilterNameEnum.Equals:
        sql = `${opts.field} = ${opts.values[0]}`;
        break;
      case FilterNameEnum.NotEquals:
        sql = `${opts.field} != ${opts.values[0]}`;
        break;
      case FilterNameEnum.Contains:
      case FilterNameEnum.NotContains:
      case FilterNameEnum.StartsWith:
      case FilterNameEnum.EndsWith:
        re = strRE.exec(opts.values[0]);
        if (!re) {
          sql = "false";
        } else {
          switch (opts.name) {
            case FilterNameEnum.Contains:
              sql = `${opts.field} like '%${re[2]}%' escape '\\'`;
              break;
            case FilterNameEnum.NotContains:
              sql = `${opts.field} not like '%${re[2]}%' escape '\\'`;
              break;
            case FilterNameEnum.StartsWith:
              sql = `${opts.field} like '${re[2]}%' escape '\\'`;
              break;
            case FilterNameEnum.EndsWith:
              sql = `${opts.field} like '%${re[2]}' escape '\\'`;
              break;
          }
        }
        break;
      case FilterNameEnum.Greater:
        sql = `${opts.field} > ${opts.values[0]}`;
        break;
      case FilterNameEnum.GreaterEqual:
        sql = `${opts.field} >= ${opts.values[0]}`;
        break;
      case FilterNameEnum.Less:
        sql = `${opts.field} < ${opts.values[0]}`;
        break;
      case FilterNameEnum.LessEqual:
        sql = `${opts.field} <= ${opts.values[0]}`;
        break;
      case FilterNameEnum.IsNull:
        sql = `${opts.field} is null`;
        break;
      case FilterNameEnum.IsNotNull:
        sql = `${opts.field} is not null`;
        break;
      case FilterNameEnum.Between:
        sql =
          `${opts.field} between ` +
          `${opts.values[0]} and ${opts.values[1]}`;
        break;
    }
  }
  return sql;
}

export function getFilterClauseHTML(
  clause: FilterClause,
  level = 0,
  join?: { left: string; right: string },
): string {
  const prefix = t.repeat(level);

  let open = "";
  let close = "";
  let html = "";

  switch (clause.type) {
    case FilterOperatorEnum.And:
      open = `${prefix}<hdml-connective operator="and">\n`;
      close = `${prefix}</hdml-connective>\n`;
      break;

    case FilterOperatorEnum.Or:
      open = `${prefix}<hdml-connective operator="or">\n`;
      close = `${prefix}</hdml-connective>\n`;
      break;

    case FilterOperatorEnum.None:
      open = `${prefix}<hdml-connective operator="none">\n`;
      close = `${prefix}</hdml-connective>\n`;
      break;
  }

  html =
    html +
    open +
    clause.filters
      .map((f) => `${prefix}${t}${getFilterHTML(f)}\n`)
      .join("");

  clause.children.forEach((child) => {
    html = html + getFilterClauseHTML(child, level + 1, join);
  });

  html = html + `${close}`;
  return html;
}

export function getFilterHTML(filter: Filter): string {
  switch (filter.type) {
    case FilterTypeEnum.Keys:
      return getKeysFilterHTML(filter.options);

    case FilterTypeEnum.Expression:
      return getExpressionFilterHTML(filter.options);

    case FilterTypeEnum.Named:
      return getNamedFilterHTML(filter.options);
  }
}

export function getKeysFilterHTML(opts: KeysParameters): string {
  if (!opts.left || !opts.right) {
    return "<!-- incorrect filter options -->";
  }
  return (
    `<hdml-filter type="keys" left="${opts.left}" ` +
    `right="${opts.right}"></hdml-filter>`
  );
}

export function getExpressionFilterHTML(
  opts: ExpressionParameters,
): string {
  if (!opts.clause) {
    return "<!-- incorrect filter options -->";
  }
  return `<hdml-filter type="expr" clause="${opts.clause.replaceAll(
    '"',
    "`",
  )}"></hdml-filter>`;
}

export function getNamedFilterHTML(opts: NamedParameters): string {
  if (
    !opts.field ||
    (!opts.values.length &&
      opts.name !== FilterNameEnum.IsNull &&
      opts.name !== FilterNameEnum.IsNotNull)
  ) {
    return "<!-- incorrect filter options -->";
  }
  switch (opts.name) {
    case FilterNameEnum.Equals:
      return (
        `<hdml-filter type="named" name="equals" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.NotEquals:
      return (
        `<hdml-filter type="named" name="not-equals" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.Contains:
      return (
        `<hdml-filter type="named" name="contains" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.NotContains:
      return (
        `<hdml-filter type="named" name="not-contains" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.StartsWith:
      return (
        `<hdml-filter type="named" name="starts-with" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.EndsWith:
      return (
        `<hdml-filter type="named" name="ends-with" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.Greater:
      return (
        `<hdml-filter type="named" name="greater" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.GreaterEqual:
      return (
        `<hdml-filter type="named" name="greater-equal" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.Less:
      return (
        `<hdml-filter type="named" name="less" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.LessEqual:
      return (
        `<hdml-filter type="named" name="less-equal" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values[0].replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.IsNull:
      return (
        `<hdml-filter type="named" name="is-null" ` +
        `field="${opts.field.replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.IsNotNull:
      return (
        `<hdml-filter type="named" name="is-not-null" ` +
        `field="${opts.field.replaceAll('"', "`")}"` +
        `></hdml-filter>`
      );

    case FilterNameEnum.Between:
      return (
        `<hdml-filter type="named" name="between" ` +
        `field="${opts.field.replaceAll('"', "`")}" ` +
        `values="${opts.values
          .map((v) => v.replaceAll('"', "`"))
          .join(",")}"></hdml-filter>`
      );
  }
}

// export function sanitizeString(): void {
//   // https://trino.io/docs/current/language/types.html
//   // TODO (buntarb): maybe fork sqlstring for sanitizing?
//   const nullRE = /^(null|NULL)$/gm;
//   const boolRE = /^(true|false|TRUE|FALSE)$/gm;
//   const intRE = /^(-|\+)?\d+$/gm;
//   const hexRE = /^(-|\+)?0(x|X)(\d|[A-F])+$/gm;
//   const octRE = /^(-|\+)?0(o|O)([0-7])+$/gm;
//   const binRE = /^(-|\+)?0(b|B)([0-1])+$/gm;
//   const fltRE = /^(-|\+)?\d+\.\d+e\d+$/gm;
//   const decRE = /^(-|\+)?\d+\.\d+$/gm;
//   const strRE = /^(')(.*)(')$/gm;
//   const dateRE = /^(date|DATE)\s'\d{4}-\d{2}-\d{2}'$/gm;
//   const timeRE = /^(time|TIME)\s'\d{2}:\d{2}:\d{2}\.\d+'$/gm;
//   const timestampRE =
/* eslint-disable-next-line max-len */
//     /^(timestamp|TIMESTAMP)\s'\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d+'$/gm;
// }

export function objectifyFilterClause(
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
    children.push(objectifyFilterClause(child));
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
        clause:
          (<ExpressionParametersStruct>opts).clause() || "false",
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

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  FieldStruct,
  ModelStruct,
  TableStruct,
  TableTypeEnum,
} from "@hdml/schemas";
import { Join } from "@hdml/types";
import { t } from "./constants";
import { getTableFieldSQL, getFieldHTML } from "./field";
import { getJoins, sortJoins, getJoinSQL, getJoinHTML } from "./join";

export function getModelSQL(model: ModelStruct, level = 0): string {
  const prefix = t.repeat(level);
  const joins = sortJoins(getJoins(model));
  const tables = getTables(model, joins);

  let sql: string;

  // subqueries
  sql = `${prefix}${t}with\n`;
  sql =
    sql +
    tables
      .map((t) => {
        switch (t.type()) {
          case TableTypeEnum.Query:
          case TableTypeEnum.Table:
            return getTableSQL(t, level + 2);
        }
      })
      .join(",\n") +
    "\n";

  // select clause
  sql = sql + `${prefix}${t}select\n`;
  sql =
    sql +
    tables
      .map((tbl) => {
        // TODO (buntarb): sort filds?
        const fields: string[] = [];
        for (let i = 0; i < tbl.fieldsLength(); i++) {
          if (tbl.fields(i)?.name()) {
            fields.push(
              `${prefix}${t}${t}` +
                `"${tbl.name()}"."${tbl.fields(i)!.name()}" as ` +
                `"${tbl.name()}_${tbl.fields(i)!.name()}"`,
            );
          }
        }
        return fields.join(",\n");
      })
      .join(",\n");

  // from clause
  if (joins.length === 0) {
    sql = sql + `\n${prefix}${t}from\n`;
    sql =
      sql +
      tables
        .map((tbl) => `${prefix}${t}${t}"${tbl.name()}"`)
        .join(",\n");
  } else {
    sql = sql + getJoinSQL(joins);
  }

  return sql;
}

export function getTableSQL(table: TableStruct, level = 0): string {
  const prefix = t.repeat(level);
  const alias =
    table.type() === TableTypeEnum.Table
      ? table.identifier()
      : `_${table.name()}`;
  const fields: FieldStruct[] = [];

  for (let i = 0; i < table.fieldsLength(); i++) {
    const field = table.fields(i);
    if (field) {
      fields.push(field);
    }
  }

  const fieldsSQL = fields
    .filter((f) => f.name())
    .sort((f1, f2) => {
      const n1 = <string>f1.name();
      const n2 = <string>f2.name();
      return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
    })
    .map((f) => `${prefix}${t}${t}${getTableFieldSQL(f)}`)
    .join(",\n");

  let tableSQL = `${prefix}"${table.name()}" as (\n`;
  tableSQL =
    tableSQL +
    (table.type() === TableTypeEnum.Query
      ? `${prefix}${t}with ${alias} as (\n` +
        `${table
          .identifier()
          ?.split("\n")
          .map((row) => `${prefix}${t}${t}${row}`)
          .join("\n")}\n` +
        `${prefix}${t})\n`
      : "");
  tableSQL = tableSQL + `${prefix}${t}select\n`;
  tableSQL = tableSQL + `${fieldsSQL}\n`;
  tableSQL = tableSQL + `${prefix}${t}from\n`;
  tableSQL = tableSQL + `${prefix}${t}${t}${alias}\n`;
  tableSQL = tableSQL + `${prefix})`;
  return tableSQL;
}

export function getModelHTML(model: ModelStruct, level = 0): string {
  const prefix = t.repeat(level);
  const joins = sortJoins(getJoins(model));
  const tables = getTables(model, joins);

  const tablesHTML = tables
    .map((table) => {
      switch (table.type()) {
        case TableTypeEnum.Table:
        case TableTypeEnum.Query:
          return getTableHTML(table, level + 1);
      }
    })
    .join("\n");

  let html =
    `${prefix}<hdml-model ` +
    `name="${model.name()}">\n${tablesHTML}\n`;
  if (joins.length > 0) {
    html = html + getJoinHTML(joins, level + 1);
  }
  html = html + `${prefix}</hdml-model>\n`;

  return html;
}

export function getTableHTML(table: TableStruct, level = 0): string {
  const prefix = t.repeat(level);
  const fields: FieldStruct[] = [];

  for (let i = 0; i < table.fieldsLength(); i++) {
    const field = table.fields(i);
    if (field) {
      fields.push(field);
    }
  }

  const fieldsHTML = fields
    .filter((f) => f.name())
    .sort((f1, f2) => {
      const n1 = <string>f1.name();
      const n2 = <string>f2.name();
      return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
    })
    .map((field) => `${prefix}${t}${getFieldHTML(field)}`)
    .join("\n");

  let type = "";
  switch (table.type()) {
    case TableTypeEnum.Table:
      type = "table";
      break;

    case TableTypeEnum.Query:
      type = "query";
      break;
  }

  let html =
    `${prefix}<hdml-table name="${table.name()}" ` +
    `type="${type}" ` +
    `identifier="${table.identifier()?.replaceAll('"', "`")}">\n`;
  html = html + `${fieldsHTML}\n`;
  html = html + `${prefix}</hdml-table>`;
  return html;
}

export function getTables(
  model: ModelStruct,
  joins: Join[],
): TableStruct[] {
  let tables: TableStruct[] = [];
  for (let i = 0; i < model.tablesLength(); i++) {
    const t = model.tables(i);
    if (t) {
      tables.push(t);
    }
  }

  tables = tables
    .sort((t1, t2) => {
      const n1 = t1.name();
      const n2 = t2.name();
      if (n1 && n2) {
        return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
      }
      return 0;
    })
    .filter((t) => {
      if (!t.name()) {
        return false;
      }

      if (joins.length === 0) {
        return true;
      }

      let res = false;
      for (let i = 0; i < joins.length; i++) {
        res =
          res ||
          t.name() === joins[i].left ||
          t.name() === joins[i].right;

        if (res) {
          break;
        }
      }
      return res;
    });

  return tables;
}

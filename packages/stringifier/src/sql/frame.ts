/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { FieldStruct, FrameStruct } from "@hdml/schemas";
import { t } from "../constants";
import { getFrameFieldSQL } from "./field";
import { objectifyFilterClause, getFilterClauseSQL } from "./filter";

export function getFrameSQL(
  frame: FrameStruct,
  from: { name: string; sql: string },
  level = 0,
): string {
  const prefix = t.repeat(level);
  const fields: FieldStruct[] = [];
  for (let i = 0; i < frame.fieldsLength(); i++) {
    if (frame.fields(i)?.name()) {
      fields.push(frame.fields(i)!);
    }
  }

  let sql = "";

  // source clause
  if (from.sql) {
    sql = sql + `${prefix}with "${from.name}" as (\n`;
    sql = sql + from.sql;
    sql = sql + `${prefix})\n`;
  }

  // select clause
  sql = sql + `${prefix}select\n`;
  sql =
    sql +
    fields
      .sort((a, b) =>
        a.name()! < b.name()! ? -1 : a.name()! > b.name()! ? 1 : 0,
      )
      .map((f: FieldStruct) => `${prefix}${t}${getFrameFieldSQL(f)}`)
      .join(",\n") +
    "\n";

  // from clause
  sql = sql + `${prefix}from\n`;
  sql = sql + `${prefix}${t}"${from.name}"\n`;

  // where clause
  const where = getFilterClauseSQL(
    objectifyFilterClause(frame.filterBy()!),
    level + 1,
  );

  if (where) {
    sql = sql + `${prefix}where\n`;
    sql = sql + where;
  }

  // group by clause
  if (frame.groupByLength() > 0) {
    const group: string[] = [];
    sql = sql + `${prefix}group by\n`;
    for (let i = 0; i < frame.groupByLength(); i++) {
      for (let j = 0; j < fields.length; j++) {
        if (frame.groupBy(i)?.name() === fields[j].name()) {
          group.push(`${j + 1}`);
          break;
        }
      }
    }
    sql = `${sql}${prefix}${t}${group.join(", ")}\n`;
  }

  // order by clause
  if (frame.sortByLength() > 0) {
    const sort: string[] = [];
    sql = sql + `${prefix}order by\n`;
    for (let i = 0; i < frame.sortByLength(); i++) {
      for (let j = 0; j < fields.length; j++) {
        if (frame.sortBy(i)?.name() === fields[j].name()) {
          sort.push(`${j + 1}`);
          break;
        }
      }
    }
    sql = `${sql}${prefix}${t}${sort.join(", ")}\n`;
  }

  // offset
  sql = sql + `${prefix}offset ${frame.offset()}\n`;

  // limit
  sql = sql + `${prefix}limit ${frame.limit()}\n`;

  return sql;
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { FieldStruct, FrameStruct } from "@hdml/schemas";
import { HDML_TAG_NAMES, FRAME_ATTRS_LIST } from "@hdml/types";
import { t } from "./constants";
import { getFrameFieldSQL, getFieldHTML } from "./field";
import {
  objectifyFilterClause,
  getFilterClauseSQL,
  getFilterClauseHTML,
} from "./filter";

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

  // Auto-add: a `group_by` / `sort_by` key whose name matches no
  // declared field is pushed into the LOCAL `fields` array above, so
  // that every key gets an ordinal (RFC 019/001 section 7.2, A9).
  //
  // It must be THIS array and never `frame.fields[]`: pushing into
  // the parser's output would change the serialized FlatBuffer, and
  // so every affected document's hash - invalidating stored
  // artifacts and Merkle names. `getFrameHTML` reads the FlatBuffer,
  // so the HTML round trip stays identity.
  //
  // And it must run BEFORE the select clause, because the `.sort()`
  // below is in place: a sorted `fields` is the only reason `j + 1`
  // is a correct ordinal in the `group by` / `order by` loops.
  //
  // What it deliberately does NOT do is resolve a frame's fields
  // against its source's columns. `getFrameSQL` receives only
  // `from: { name, sql }` and genuinely cannot see them, so the
  // auto-add DELEGATES that check to Trino, the only component that
  // can answer it. A key naming nothing real then gets an accurate
  // `COLUMN_NOT_FOUND` naming the column, instead of the silently
  // wrong rows it used to get.
  const autoAdd = (key: null | FieldStruct): void => {
    if (!key) {
      return;
    }
    const name = key.name();
    // a nameless field emits "" from `getFrameFieldSQL`, which would
    // put an empty entry in the select list
    if (!name) {
      return;
    }
    // de-duplicate - the same name twice in one clause, the same name
    // in both clauses, or a name already declared as a field
    if (fields.some((f) => f.name() === name)) {
      return;
    }
    fields.push(key);
  };

  for (let i = 0; i < frame.groupByLength(); i++) {
    autoAdd(frame.groupBy(i));
  }

  for (let i = 0; i < frame.sortByLength(); i++) {
    autoAdd(frame.sortBy(i));
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

  // group by clause. Every key now has an ordinal, because of the
  // auto-add above, so `group.join(", ")` can no longer be empty: the
  // `"group by\n  \n"` syntax error is structurally UNREACHABLE
  // rather than caught, and there is deliberately no empty-join
  // guard here.
  // The `order by` clause below is its twin - the two move together.
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

  // order by clause. The twin of `group by` above, character for
  // character: same auto-add, same now-unreachable empty join, same
  // deliberate absence of a guard. A fix that touches one clause and
  // not the other leaves the bug live.
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

export function getFrameHTML(frame: FrameStruct, level = 0): string {
  const prefix = t.repeat(level);
  const fields: FieldStruct[] = [];
  for (let i = 0; i < frame.fieldsLength(); i++) {
    if (frame.fields(i)?.name()) {
      fields.push(frame.fields(i)!);
    }
  }

  // frame + fields
  let html =
    `${prefix}<${HDML_TAG_NAMES.FRAME} ` +
    `${FRAME_ATTRS_LIST.NAME}="${frame.name()}" ` +
    `${FRAME_ATTRS_LIST.SOURCE}="${frame.source()}" ` +
    `${FRAME_ATTRS_LIST.OFFSET}="${frame.offset()}" ` +
    `${FRAME_ATTRS_LIST.LIMIT}="${frame.limit()}">\n` +
    fields
      .sort((a, b) =>
        a.name()! < b.name()! ? -1 : a.name()! > b.name()! ? 1 : 0,
      )
      .map((field) => `${prefix}${t}${getFieldHTML(field)}`)
      .join("\n") +
    "\n";

  // filters
  const filtersHTML = getFilterClauseHTML(
    objectifyFilterClause(frame.filterBy()!),
    level + 2,
  );

  if (filtersHTML) {
    html =
      html +
      `${prefix}${t}<${HDML_TAG_NAMES.FILTER_BY}>\n` +
      filtersHTML +
      `${prefix}${t}</${HDML_TAG_NAMES.FILTER_BY}>\n`;
  }

  // group by
  if (frame.groupByLength() > 0) {
    html = html + `${prefix}${t}<${HDML_TAG_NAMES.GROUP_BY}>\n`;
    for (let i = 0; i < frame.groupByLength(); i++) {
      html =
        html +
        `${prefix}${t}${t}${getFieldHTML(frame.groupBy(i)!)}\n`;
    }
    html = html + `${prefix}${t}</${HDML_TAG_NAMES.GROUP_BY}>\n`;
  }

  // split by. The emitted order is the SCHEMA's - `group_by` ->
  // `split_by` -> `sort_by`, per `document.Frame.fbs:21-23`. The
  // parser's own list (`hdmlTreeAdapter`'s FIELD case) orders them
  // GROUP_BY, SORT_BY, SPLIT_BY. The two already disagree; that is
  // harmless and must NOT be "tidied", because normalising one
  // without the other invites a reader to assume they correspond
  // positionally (RFC 019/001 section 4.3, section 7.3).
  //
  // This closes `hdml-split-by`'s round-trip lossiness only. Giving
  // it SQL MEANING is post-v1 (D16), so `getFrameSQL` ignores it.
  // `key` rides along for free, because this calls the same
  // `getFieldHTML` the frame's own fields do.
  if (frame.splitByLength() > 0) {
    html = html + `${prefix}${t}<${HDML_TAG_NAMES.SPLIT_BY}>\n`;
    for (let i = 0; i < frame.splitByLength(); i++) {
      html =
        html +
        `${prefix}${t}${t}${getFieldHTML(frame.splitBy(i)!)}\n`;
    }
    html = html + `${prefix}${t}</${HDML_TAG_NAMES.SPLIT_BY}>\n`;
  }

  // sort by
  if (frame.sortByLength() > 0) {
    html = html + `${prefix}${t}<${HDML_TAG_NAMES.SORT_BY}>\n`;
    for (let i = 0; i < frame.sortByLength(); i++) {
      html =
        html + `${prefix}${t}${t}${getFieldHTML(frame.sortBy(i)!)}\n`;
    }
    html = html + `${prefix}${t}</${HDML_TAG_NAMES.SORT_BY}>\n`;
  }

  html = html + `${prefix}</${HDML_TAG_NAMES.FRAME}>\n`;
  return html;
}

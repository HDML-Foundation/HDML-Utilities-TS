/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  ModelStruct,
  TableStruct,
  JoinStruct,
  TableTypeEnum,
  FieldStruct,
} from "@hdml/schemas";
import { t } from "../constants";
import { getTableFieldSQL } from "./fields";

export function getModelSQL(model: ModelStruct, level = 0): string {
  const prefix = t.repeat(level);
  let tables: TableStruct[] = [];
  const joins: JoinStruct[] = [];

  for (let i = 0; i < model.tablesLength(); i++) {
    const t = model.tables(i);
    if (t) {
      tables.push(t);
    }
  }

  for (let i = 0; i < model.joinsLength(); i++) {
    const j = model.joins(i);
    if (j) {
      joins.push(j);
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
      if (joins.length === 0) {
        return true;
      }
      let res = false;
      joins.forEach((j) => {
        res = res || t.name() === j.left() || t.name() === j.right();
      });
      return res;
    });

  const tablesSQL = tables
    .map((t) => {
      switch (t.type()) {
        case TableTypeEnum.Query:
        case TableTypeEnum.Table:
          return "";
      }
    })
    .join(",\n");
}

function getTableSQL(table: TableStruct, level = 0): string {
  const prefix = t.repeat(level);
  const identifier =
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

  fields
    .sort((f1, f2) => {
      const n1 = f1.name();
      const n2 = f2.name();
      if (n1 && n2) {
        return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
      } else {
        return 0;
      }
    })
    .map((f) => `${prefix}${t}${t}${getTableFieldSQL(f)}`)
    .join(",\n");
}

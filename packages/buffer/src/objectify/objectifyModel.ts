/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { ModelStruct, TableStruct, JoinStruct } from "@hdml/schemas";
import { Model, Table, Join } from "@hdml/types";
import { objectifyField } from "./objectifyField";
import { objectifyFilterClause } from "./objectifyFilterClause";

/**
 * Converts a FlatBuffers `ModelStruct` to a TypeScript `Model`
 * object.
 *
 * This function deserializes a FlatBuffers `ModelStruct` structure
 * into a TypeScript `Model` interface object. It maps the model's
 * properties such as name, tables, and joins into their respective
 * TypeScript representations.
 *
 * @param modelStruct The FlatBuffers `ModelStruct` object to convert.
 *
 * @returns The converted `Model` object.
 *
 * @example
 * ```ts
 * const modelStruct: ModelStruct = ...;
 * const model = objectifyModel(modelStruct);
 * ```
 */
export function objectifyModel(modelStruct: ModelStruct): Model {
  const name = modelStruct.name() || "";
  const description = modelStruct.description();

  const tables: Table[] = [];
  for (let i = 0; i < modelStruct.tablesLength(); i++) {
    const tableStruct = modelStruct.tables(i);
    if (tableStruct) {
      tables.push(objectifyTable(tableStruct));
    }
  }

  const joins: Join[] = [];
  for (let i = 0; i < modelStruct.joinsLength(); i++) {
    const joinStruct = modelStruct.joins(i);
    if (joinStruct) {
      joins.push(objectifyJoin(joinStruct));
    }
  }

  return {
    name,
    description,
    tables,
    joins,
  };
}

/**
 * Converts a FlatBuffers `TableStruct` to a TypeScript `Table`
 * object.
 *
 * @param tableStruct The FlatBuffers `TableStruct` object to convert.
 *
 * @returns The converted `Table` object.
 */
function objectifyTable(tableStruct: TableStruct): Table {
  const name = tableStruct.name() || "";
  const description = tableStruct.description();
  const type = tableStruct.type();
  const identifier = tableStruct.identifier() || "";

  const fields = [];
  for (let i = 0; i < tableStruct.fieldsLength(); i++) {
    const fieldStruct = tableStruct.fields(i);
    if (fieldStruct) {
      fields.push(objectifyField(fieldStruct));
    }
  }

  return {
    name,
    description,
    type,
    identifier,
    fields,
  };
}

/**
 * Converts a FlatBuffers `JoinStruct` to a TypeScript `Join` object.
 *
 * @param joinStruct The FlatBuffers `JoinStruct` object to convert.
 *
 * @returns The converted `Join` object.
 */
function objectifyJoin(joinStruct: JoinStruct): Join {
  const type = joinStruct.type();
  const left = joinStruct.left() || "";
  const right = joinStruct.right() || "";
  const description = joinStruct.description();
  const clauseStruct = joinStruct.clause();
  if (!clauseStruct) {
    throw new Error("Join clause is required");
  }
  const clause = objectifyFilterClause(clauseStruct);

  return {
    type,
    left,
    right,
    description,
    clause,
  };
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import {
  // interfaces
  IModel,
  ITable,
  IJoin,
  // structures
  Model,
  Table,
  Join,
} from "@hdml/schemas";
import { bufferifyField } from "./bufferifyField";
import { bufferifyFilterClause } from "./bufferifyFilterClause";

/**
 * Converts a TypeScript `IModel` object into a FlatBuffers `Model`.
 *
 * This function takes a TypeScript object representing a data model
 * (`IModel`) and serializes it into a FlatBuffers `Model` structure.
 * It maps the `IModel` properties such as the model's name, tables,
 * and joins into their respective FlatBuffers representations.
 * The function handles the necessary conversions for tables and joins
 * by invoking `bufferifyTable` and `bufferifyJoin` for each element
 * in the `tables` and `joins` arrays.
 *
 * The resulting FlatBuffers structure can then be sent over the wire
 * or stored in a binary format that can be efficiently decoded by
 * other systems or applications that understand the FlatBuffers
 * format.
 *
 * @param builder - The FlatBuffers `Builder` instance used to build
 *                  the byte buffer and serialize the data.
 * @param model - The TypeScript `IModel` object representing the data
 *                model. It includes the following properties:
 *                - `name` (string): The name of the model.
 *                - `tables` (ITable[]): An array of `ITable` objects,
 *                  each representing a table in the data model.
 *                - `joins` (IJoin[]): An array of `IJoin` objects,
 *                  each representing a join operation between tables
 *                  in the data model.
 *
 * @returns The offset of the serialized `Model` structure in the
 *          FlatBuffers buffer. This offset can be used to retrieve or
 *          manipulate the serialized data.
 *
 * @example
 * ```typescript
 * const builder = new flatbuffers.Builder(1024);
 * const model: IModel = {
 *   name: "SalesModel",
 *   tables: [{...}],
 *   joins: [{...}]
 * };
 * const offset = bufferifyModel(builder, model);
 * builder.finish(offset);
 * const bytes = builder.asUint8Array();
 * ```
 */
export function bufferifyModel(
  builder: Builder,
  model: IModel,
): number {
  const nameOffset = builder.createString(model.name);
  const tableOffsets = model.tables.map((table) =>
    bufferifyTable(builder, table),
  );
  const tablesVector = Model.createTablesVector(
    builder,
    tableOffsets,
  );
  const joinOffsets = model.joins.map((join) =>
    bufferifyJoin(builder, join),
  );
  const joinsVector = Model.createJoinsVector(builder, joinOffsets);
  return Model.createModel(
    builder,
    nameOffset,
    tablesVector,
    joinsVector,
  );
}

/**
 * Converts a TypeScript `ITable` object into a FlatBuffers `Table`.
 *
 * @param builder - The FlatBuffers `Builder` instance.
 * @param table - The TypeScript `ITable` object to convert.
 *
 * @returns The offset of the serialized `Table` structure.
 */
function bufferifyTable(builder: Builder, table: ITable): number {
  const nameOffset = builder.createString(table.name);
  const identifierOffset = builder.createString(table.identifier);
  const fieldOffsets = table.fields.map((field) =>
    bufferifyField(builder, field),
  );
  const fieldsVector = Table.createFieldsVector(
    builder,
    fieldOffsets,
  );
  return Table.createTable(
    builder,
    nameOffset,
    table.type,
    identifierOffset,
    fieldsVector,
  );
}

/**
 * Converts a TypeScript `IJoin` object into a FlatBuffers `Join`.
 *
 * @param builder - The FlatBuffers `Builder` instance.
 * @param join - The TypeScript `IJoin` object to convert.
 *
 * @returns The offset of the serialized `Join` structure.
 */
function bufferifyJoin(builder: Builder, join: IJoin): number {
  const leftOffset = builder.createString(join.left);
  const rightOffset = builder.createString(join.right);
  const clauseOffset = bufferifyFilterClause(builder, join.clause);
  Join.startJoin(builder);
  Join.addType(builder, join.type);
  Join.addLeft(builder, leftOffset);
  Join.addRight(builder, rightOffset);
  Join.addClause(builder, clauseOffset);
  return Join.endJoin(builder);
}

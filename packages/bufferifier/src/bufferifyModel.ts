/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Builder } from "flatbuffers";
import { ModelStruct, TableStruct, JoinStruct } from "@hdml/schemas";
import { Model, Table, Join } from "@hdml/types";
import { bufferifyField } from "./bufferifyField";
import { bufferifyFilterClause } from "./bufferifyFilterClause";

/**
 * Converts a TypeScript `Model` object into a FlatBuffers
 * `ModelStruct`.
 *
 * This function takes a TypeScript object representing a data model
 * (`Model`) and serializes it into a FlatBuffers `ModelStruct`
 * structure. It maps the `Model` properties such as the model's name,
 * tables, and joins into their respective FlatBuffers
 * representations. The function handles the necessary conversions for
 * tables and joins by invoking `bufferifyTable` and `bufferifyJoin`
 * for each element in the `tables` and `joins` arrays.
 *
 * The resulting FlatBuffers structure can then be sent over the wire
 * or stored in a binary format that can be efficiently decoded by
 * other systems or applications that understand the FlatBuffers
 * format.
 *
 * @param builder The FlatBuffers `Builder` instance used to build
 * the byte buffer and serialize the data.
 *
 * @param model The TypeScript `Model` object representing the data
 * model. It includes the following properties:
 * - `name` (string): The name of the model.
 * - `tables` (Table[]): An array of `Table` objects, each
 *   representing a table in the data model.
 * - `joins` (Join[]): An array of `Join` objects, each representing a
 *   join operation between tables in the data model.
 *
 * @returns The offset of the serialized `ModelStruct` structure in
 * the FlatBuffers buffer. This offset can be used to retrieve or
 * manipulate the serialized data.
 *
 * @example
 * ```typescript
 * const builder = new flatbuffers.Builder(1024);
 * const model: Model = {
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
  model: Model,
): number {
  const nameOffset = builder.createString(model.name);
  const descriptionOffset = builder.createString(model.description);
  const tableOffsets = model.tables.map((table) =>
    bufferifyTable(builder, table),
  );
  const tablesVector = ModelStruct.createTablesVector(
    builder,
    tableOffsets,
  );
  const joinOffsets = model.joins.map((join) =>
    bufferifyJoin(builder, join),
  );
  const joinsVector = ModelStruct.createJoinsVector(
    builder,
    joinOffsets,
  );
  return ModelStruct.createModelStruct(
    builder,
    nameOffset,
    descriptionOffset,
    tablesVector,
    joinsVector,
  );
}

/**
 * Converts a TypeScript `Table` object into a FlatBuffers
 * `TableStruct`.
 *
 * @param builder The FlatBuffers `Builder` instance.
 *
 * @param table The TypeScript `Table` object to convert.
 *
 * @returns The offset of the serialized `TableStruct` structure.
 */
function bufferifyTable(builder: Builder, table: Table): number {
  const nameOffset = builder.createString(table.name);
  const descriptionOffset = builder.createString(table.description);
  const identifierOffset = builder.createString(table.identifier);
  const fieldOffsets = table.fields.map((field) =>
    bufferifyField(builder, field),
  );
  const fieldsVector = TableStruct.createFieldsVector(
    builder,
    fieldOffsets,
  );
  return TableStruct.createTableStruct(
    builder,
    nameOffset,
    descriptionOffset,
    table.type,
    identifierOffset,
    fieldsVector,
  );
}

/**
 * Converts a TypeScript `Join` object into a FlatBuffers
 * `JoinStruct`.
 *
 * @param builder The FlatBuffers `Builder` instance.
 *
 * @param join The TypeScript `Join` object to convert.
 *
 * @returns The offset of the serialized `JoinStruct` structure.
 */
function bufferifyJoin(builder: Builder, join: Join): number {
  const leftOffset = builder.createString(join.left);
  const rightOffset = builder.createString(join.right);
  const clauseOffset = bufferifyFilterClause(builder, join.clause);
  JoinStruct.startJoinStruct(builder);
  JoinStruct.addType(builder, join.type);
  JoinStruct.addLeft(builder, leftOffset);
  JoinStruct.addRight(builder, rightOffset);
  JoinStruct.addClause(builder, clauseOffset);
  return JoinStruct.endJoinStruct(builder);
}

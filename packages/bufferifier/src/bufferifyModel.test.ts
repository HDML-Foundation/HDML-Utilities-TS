/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { Builder } from "flatbuffers";
import { bufferifyModel } from "./bufferifyModel";
import { TableType, JoinType, DataType, IModel } from "@hdml/schemas";

// jest.mock("./bufferifyField", () => ({
//   bufferifyField: jest.fn(() => 1),
// }));

// jest.mock("./bufferifyFilterClause", () => ({
//   bufferifyFilterClause: jest.fn(() => 1),
// }));

describe("The `bufferifyModel` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  it("should return a valid FlatBuffers offset", () => {
    const model: IModel = {
      name: "TestModel",
      tables: [
        {
          name: "Table1",
          type: TableType.Table,
          identifier: "database.schema.table1",
          fields: [{ name: "Field1" }],
        },
      ],
      joins: [],
    };
    const offset = bufferifyModel(builder, model);
    expect(typeof offset).toBe("number");
    expect(offset).toBeGreaterThan(0);
  });

  it("should handle an empty model gracefully", () => {
    const model = {
      name: "EmptyModel",
      tables: [],
      joins: [],
    };
    const offset = bufferifyModel(builder, model);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a simple IModel into a FlatBuffers Model", () => {
    const model: IModel = {
      name: "TestModel",
      tables: [
        {
          name: "Table1",
          type: TableType.Table,
          identifier: "database.schema.table1",
          fields: [
            {
              name: "Field1",
              type: {
                type: DataType.Int32,
                options: {
                  nullable: false,
                },
              },
            },
          ],
        },
      ],
      joins: [
        {
          type: JoinType.Inner,
          left: "Table1",
          right: "Table2",
          clause: { type: 0, filters: [], children: [] },
        },
      ],
    };

    const offset = bufferifyModel(builder, model);
    expect(offset).toBeGreaterThan(0);
    expect(builder.dataBuffer().bytes().length).toBeGreaterThan(0);
  });

  // it("should call bufferifyTable for each table in the model", () => {
  //   const model: IModel = {
  //     name: "TestModel",
  //     tables: [
  //       {
  //         name: "Table1",
  //         type: 0,
  //         identifier: "database.schema.table1",
  //         fields: [{ name: "Field1" }],
  //       },
  //       {
  //         name: "Table2",
  //         type: 0,
  //         identifier: "database.schema.table2",
  //         fields: [{ name: "Field2" }],
  //       },
  //     ],
  //     joins: [],
  //   };
  //   bufferifyModel(builder, model);
  //   expect(Table.createTable).toHaveBeenCalledTimes(2);
  // });

  // it("should call bufferifyJoin for each join in the model", () => {
  //   const model: IModel = {
  //     name: "TestModel",
  //     tables: [],
  //     joins: [
  //       {
  //         type: 0,
  //         left: "Table1",
  //         right: "Table2",
  //         clause: { type: 0, filters: [], children: [] },
  //       },
  //       {
  //         type: 1,
  //         left: "Table2",
  //         right: "Table3",
  //         clause: { type: 1, filters: [], children: [] },
  //       },
  //     ],
  //   };
  //   bufferifyModel(builder, model);

  //   // Ensure that bufferifyJoin is called for both joins
  //   expect(Join.createJoin).toHaveBeenCalledTimes(2);
  // });
});

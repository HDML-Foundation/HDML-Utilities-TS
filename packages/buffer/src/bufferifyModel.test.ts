/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { Builder } from "flatbuffers";
import {
  TableTypeEnum,
  JoinTypeEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
} from "@hdml/schemas";
import { Model } from "@hdml/types";
import { bufferifyModel } from "./bufferifyModel";

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
    const model: Model = {
      name: "TestModel",
      description: null,
      tables: [
        {
          name: "Table1",
          description: null,
          type: TableTypeEnum.Table,
          identifier: "database.schema.table1",
          fields: [
            {
              name: "field1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
          ],
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
      description: null,
      tables: [],
      joins: [],
    };
    const offset = bufferifyModel(builder, model);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a simple Model into a FlatBuffers Model", () => {
    const model: Model = {
      name: "TestModel",
      description: "description",
      tables: [
        {
          name: "Table1",
          description: "description",
          type: TableTypeEnum.Table,
          identifier: "database.schema.table1",
          fields: [
            {
              name: "field1",
              description: null,
              origin: null,
              clause: null,
              type: {
                type: DataTypeEnum.Unspecified,
              },
              aggregation: AggregationTypeEnum.None,
              order: OrderTypeEnum.None,
            },
          ],
        },
      ],
      joins: [
        {
          type: JoinTypeEnum.Inner,
          left: "Table1",
          right: "Table2",
          clause: { type: 0, filters: [], children: [] },
          description: null,
        },
      ],
    };

    const offset = bufferifyModel(builder, model);
    expect(offset).toBeGreaterThan(0);
    expect(builder.dataBuffer().bytes().length).toBeGreaterThan(0);
  });

  // it("should call bufferifyTable for each table in the model", () => {
  //   const model: Model = {
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
  //   const model: Model = {
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

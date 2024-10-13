/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  ConnectorTypesEnum,
  TableTypeEnum,
  FilterOperatorEnum,
  DataTypeEnum,
  AggregationTypeEnum,
  OrderTypeEnum,
} from "@hdml/schemas";
import { HDOM } from "@hdml/types";
import { serialize, deserialize } from ".";

describe("The `serialize` function", () => {
  it("should serialize an HDOM object to Uin8Array", () => {
    const hdom: HDOM = {
      includes: [{ path: "/path/to/doc.hdml" }],
      connections: [
        {
          name: "JDBCConnection",
          description: "JDBC metadata",
          options: {
            connector: ConnectorTypesEnum.Postgres,
            parameters: {
              host: "localhost",
              user: "root",
              password: "password",
              ssl: true,
            },
          },
        },
      ],
      models: [
        {
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
        },
      ],
      frames: [
        {
          name: "test_frame",
          description: null,
          source: "test_model",
          offset: 0,
          limit: 100,
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
          filter_by: {
            type: FilterOperatorEnum.None,
            filters: [],
            children: [],
          },
          group_by: [],
          split_by: [],
          sort_by: [],
        },
      ],
    };

    const bytes = serialize(hdom);
    const struct = deserialize(bytes);

    // includes
    expect(struct.includesLength()).toBe(1);
    expect(struct.includes(0)?.path()).toBe("/path/to/doc.hdml");

    // connections
    expect(struct.connectionsLength()).toBe(1);

    // models
    expect(struct.modelsLength()).toBe(1);

    // frames
    expect(struct.framesLength()).toBe(1);
  });

  it("should handle empty HDOM object", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);

    expect(struct.includesLength()).toBe(0);
    expect(struct.connectionsLength()).toBe(0);
    expect(struct.modelsLength()).toBe(0);
    expect(struct.framesLength()).toBe(0);
  });
});

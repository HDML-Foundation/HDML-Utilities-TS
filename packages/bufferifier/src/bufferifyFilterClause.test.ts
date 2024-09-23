/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { Builder } from "flatbuffers";
import { bufferifyFilterClause } from "./bufferifyFilterClause";
import {
  IFilterClause,
  FilterType,
  FilterOperator,
  FilterName,
} from "@hdml/schemas";

describe("The `bufferifyFilterClause` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  it("should serialize a FilterClause with no filter and no children", () => {
    const clause: IFilterClause = {
      type: FilterOperator.And,
      filters: [],
      children: [],
    };
    const offset = bufferifyFilterClause(builder, clause);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a FilterClause with a single Keys filter", () => {
    const clause: IFilterClause = {
      type: FilterOperator.And,
      filters: [
        {
          type: FilterType.Keys,
          options: {
            left: "order_id",
            right: "customer_id",
          },
        },
      ],
      children: [],
    };
    const offset = bufferifyFilterClause(builder, clause);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a FilterClause with a nested child clause", () => {
    const childClause: IFilterClause = {
      type: FilterOperator.Or,
      filters: [],
      children: [],
    };
    const parentClause: IFilterClause = {
      type: FilterOperator.And,
      filters: [],
      children: [childClause],
    };
    const offset = bufferifyFilterClause(builder, parentClause);
    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a FilterClause with multiple filters and children", () => {
    const clause: IFilterClause = {
      type: FilterOperator.And,
      filters: [
        {
          type: FilterType.Keys,
          options: { left: "order_id", right: "customer_id" },
        },
        {
          type: FilterType.Expression,
          options: { clause: "total > 1000" },
        },
      ],
      children: [
        {
          type: FilterOperator.Or,
          filters: [
            {
              type: FilterType.Named,
              options: {
                name: FilterName.Contains,
                field: "country",
                values: ["US", "UK"],
              },
            },
          ],
          children: [],
        },
      ],
    };

    const offset = bufferifyFilterClause(builder, clause);

    expect(offset).toBeGreaterThan(0);
  });

  it("should serialize a FilterClause with a Named filter", () => {
    const clause: IFilterClause = {
      type: FilterOperator.And,
      filters: [
        {
          type: FilterType.Named,
          options: {
            name: FilterName.Contains,
            field: "product",
            values: ["Electronics", "Clothing"],
          },
        },
      ],
      children: [],
    };

    const offset = bufferifyFilterClause(builder, clause);

    expect(offset).toBeGreaterThan(0);
  });
});

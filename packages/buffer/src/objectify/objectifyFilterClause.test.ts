/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import * as flatbuffers from "flatbuffers";
import { Builder } from "flatbuffers";
import {
  FilterTypeEnum,
  FilterOperatorEnum,
  FilterNameEnum,
  FilterClauseStruct,
} from "@hdml/schemas";
import { FilterClause } from "@hdml/types";
import { bufferifyFilterClause } from "../bufferify/bufferifyFilterClause";
import { objectifyFilterClause } from "./objectifyFilterClause";

describe("The `objectifyFilterClause` function", () => {
  let builder: Builder;

  beforeEach(() => {
    builder = new Builder(1024);
  });

  it("should objectify a FilterClause with no filter and no children", () => {
    const clause: FilterClause = {
      type: FilterOperatorEnum.And,
      filters: [],
      children: [],
    };

    const offset = bufferifyFilterClause(builder, clause);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const clauseStruct =
      FilterClauseStruct.getRootAsFilterClauseStruct(byteBuffer);
    const objectified = objectifyFilterClause(clauseStruct);

    expect(objectified).toEqual(clause);
  });

  it("should objectify a FilterClause with a single Keys filter", () => {
    const clause: FilterClause = {
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Keys,
          options: {
            left: "order_id",
            right: "customer_id",
          },
        },
      ],
      children: [],
    };

    const offset = bufferifyFilterClause(builder, clause);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const clauseStruct =
      FilterClauseStruct.getRootAsFilterClauseStruct(byteBuffer);
    const objectified = objectifyFilterClause(clauseStruct);

    expect(objectified).toEqual(clause);
  });

  it("should objectify a FilterClause with a nested child clause", () => {
    const childClause: FilterClause = {
      type: FilterOperatorEnum.Or,
      filters: [],
      children: [],
    };
    const parentClause: FilterClause = {
      type: FilterOperatorEnum.And,
      filters: [],
      children: [childClause],
    };

    const offset = bufferifyFilterClause(builder, parentClause);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const clauseStruct =
      FilterClauseStruct.getRootAsFilterClauseStruct(byteBuffer);
    const objectified = objectifyFilterClause(clauseStruct);

    expect(objectified).toEqual(parentClause);
  });

  it("should objectify a FilterClause with multiple filters and children", () => {
    const clause: FilterClause = {
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Keys,
          options: { left: "order_id", right: "customer_id" },
        },
        {
          type: FilterTypeEnum.Expression,
          options: { clause: "total > 1000" },
        },
      ],
      children: [
        {
          type: FilterOperatorEnum.Or,
          filters: [
            {
              type: FilterTypeEnum.Named,
              options: {
                name: FilterNameEnum.Contains,
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
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const clauseStruct =
      FilterClauseStruct.getRootAsFilterClauseStruct(byteBuffer);
    const objectified = objectifyFilterClause(clauseStruct);

    expect(objectified).toEqual(clause);
  });

  it("should objectify a FilterClause with a Named filter", () => {
    const clause: FilterClause = {
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Named,
          options: {
            name: FilterNameEnum.Contains,
            field: "product",
            values: ["Electronics", "Clothing"],
          },
        },
      ],
      children: [],
    };

    const offset = bufferifyFilterClause(builder, clause);
    builder.finish(offset);
    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const clauseStruct =
      FilterClauseStruct.getRootAsFilterClauseStruct(byteBuffer);
    const objectified = objectifyFilterClause(clauseStruct);

    expect(objectified).toEqual(clause);
  });
});

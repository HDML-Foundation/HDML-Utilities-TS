/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as flatbuffers from "flatbuffers";
import {
  IHDDM,
  HDDM,
  ConnectorTypes,
  TableType,
  FilterOperator,
} from "@hdml/schemas";
import { bufferifyHDDM } from "./bufferifyHDDM";

describe("bufferifyHDDM", () => {
  it("should serialize an IHDDM object to FlatBuffers", () => {
    const builder = new flatbuffers.Builder(1024);

    const hddm: IHDDM = {
      includes: [{ path: "/path/to/doc.hdml" }],
      connections: [
        {
          name: "JDBCConnection",
          meta: "JDBC metadata",
          options: {
            connector: ConnectorTypes.Postgres,
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
          tables: [
            {
              name: "Table1",
              type: TableType.Table,
              identifier: "database.schema.table1",
              fields: [{ name: "Field1" }],
            },
          ],
          joins: [],
        },
      ],
      frames: [
        {
          name: "test_frame",
          source: "test_model",
          offset: 0,
          limit: 100,
          fields: [{ name: "field1" }],
          filter_by: {
            type: FilterOperator.None,
            filters: [],
            children: [],
          },
          group_by: [],
          split_by: [],
          sort_by: [],
        },
      ],
    };

    const offset = bufferifyHDDM(builder, hddm);
    builder.finish(offset);

    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fbHDDM = HDDM.getRootAsHDDM(byteBuffer);

    expect(fbHDDM.includesLength()).toBe(1);
    expect(fbHDDM.includes(0)?.path()).toBe("/path/to/doc.hdml");
    expect(fbHDDM.connectionsLength()).toBe(1);
    expect(fbHDDM.modelsLength()).toBe(1);
    expect(fbHDDM.framesLength()).toBe(1);
  });

  it("should handle empty IHDDM object", () => {
    const builder = new flatbuffers.Builder(1024);

    const hddm: IHDDM = {
      includes: [],
      connections: [],
      models: [],
      frames: [],
    };

    const offset = bufferifyHDDM(builder, hddm);
    builder.finish(offset);

    const buffer = builder.asUint8Array();
    const byteBuffer = new flatbuffers.ByteBuffer(buffer);
    const fbHDDM = HDDM.getRootAsHDDM(byteBuffer);

    expect(fbHDDM.includesLength()).toBe(0);
    expect(fbHDDM.connectionsLength()).toBe(0);
    expect(fbHDDM.modelsLength()).toBe(0);
    expect(fbHDDM.framesLength()).toBe(0);
  });
});

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as schema from "./index";

describe("@hdml/schema", () => {
  it("must exports required types", () => {
    expect(Object.keys(schema).length).toBe(46);
    expect(schema.AggregationTypeEnum).toBeDefined();
    expect(schema.ConnectorTypesEnum).toBeDefined();
    expect(schema.DataTypeEnum).toBeDefined();
    expect(schema.DateUnitEnum).toBeDefined();
    expect(schema.DecimalBitWidthEnum).toBeDefined();
    expect(schema.FilterNameEnum).toBeDefined();
    expect(schema.FilterOperatorEnum).toBeDefined();
    expect(schema.FilterTypeEnum).toBeDefined();
    expect(schema.JoinTypeEnum).toBeDefined();
    expect(schema.OrderTypeEnum).toBeDefined();
    expect(schema.TableTypeEnum).toBeDefined();
    expect(schema.TimeUnitEnum).toBeDefined();
    expect(schema.TimeZoneEnum).toBeDefined();

    expect(schema.BigQueryParametersStruct).toBeDefined();
    expect(schema.CommonParametersStruct).toBeDefined();
    expect(schema.ConnectionStruct).toBeDefined();
    expect(schema.ConnectionOptionsStruct).toBeDefined();
    expect(schema.ConnectionParametersStruct).toBeDefined();
    expect(schema.DataTypeOptionsStruct).toBeDefined();
    expect(schema.DateParametersStruct).toBeDefined();
    expect(schema.DecimalParametersStruct).toBeDefined();
    expect(schema.HDOMStruct).toBeDefined();
    expect(schema.ElasticsearchParametersStruct).toBeDefined();
    expect(schema.ExpressionParametersStruct).toBeDefined();
    expect(schema.FieldStruct).toBeDefined();
    expect(schema.FieldTypeStruct).toBeDefined();
    expect(schema.FilterStruct).toBeDefined();
    expect(schema.FilterClauseStruct).toBeDefined();
    expect(schema.FilterOptionsStruct).toBeDefined();
    expect(schema.FrameStruct).toBeDefined();
    expect(schema.GoogleSheetsParametersStruct).toBeDefined();
    expect(schema.IncludeStruct).toBeDefined();
    expect(schema.JDBCParametersStruct).toBeDefined();
    expect(schema.JoinStruct).toBeDefined();
    expect(schema.KeysParametersStruct).toBeDefined();
    expect(schema.ModelStruct).toBeDefined();
    expect(schema.MongoDBParametersStruct).toBeDefined();
    expect(schema.NamedParametersStruct).toBeDefined();
    expect(schema.SnowflakeParametersStruct).toBeDefined();
    expect(schema.TableStruct).toBeDefined();
    expect(schema.TimeParametersStruct).toBeDefined();
    expect(schema.TimestampParametersStruct).toBeDefined();
    expect(schema.UnspecifiedParametersStruct).toBeDefined();
    expect(schema.FileStruct).toBeDefined();
    expect(schema.DocumentFilesStruct).toBeDefined();
    expect(schema.DocumentFileStatusesStruct).toBeDefined();
  });
});

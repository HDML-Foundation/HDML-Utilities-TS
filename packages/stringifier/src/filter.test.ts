/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDOM } from "@hdml/types";
import {
  JoinTypeEnum,
  FilterTypeEnum,
  FilterOperatorEnum,
  FilterStruct,
  FilterNameEnum,
  FilterClauseStruct,
} from "@hdml/schemas";
import { serialize, deserialize } from "@hdml/buffer";
import {
  objectifyFilterOptions,
  objectifyFilterClause,
  getNamedFilterSQL,
  getExpressionFilterSQL,
  getKeysFilterSQL,
  getFilterSQL,
  getFilterClauseSQL,
  getNamedFilterHTML,
  getExpressionFilterHTML,
  getKeysFilterHTML,
  getFilterHTML,
  getFilterClauseHTML,
} from "./filter";

describe("The `objectifyFilterOptions` function", () => {
  it("should objectify empty `Expression` options", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Cross,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Expression,
                    options: {
                      clause: "",
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const filter = <FilterStruct>(
      struct.models(0)?.joins(0)?.clause()?.filters(0)
    );
    const opts = objectifyFilterOptions(filter);
    expect(opts).toEqual({
      ...hdom.models[0].joins[0].clause.filters[0].options,
      clause: "false",
    });
  });

  it("should objectify `Expression` options", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Cross,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Expression,
                    options: {
                      clause: '"T1"."F1" = 1',
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const filter = <FilterStruct>(
      struct.models(0)?.joins(0)?.clause()?.filters(0)
    );
    const opts = objectifyFilterOptions(filter);
    expect(opts).toEqual(
      hdom.models[0].joins[0].clause.filters[0].options,
    );
  });

  it("should objectify empty `Keys` options", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Inner,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "",
                      right: "",
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const filter = <FilterStruct>(
      struct.models(0)?.joins(0)?.clause()?.filters(0)
    );
    const opts = objectifyFilterOptions(filter);
    expect(opts).toEqual(
      hdom.models[0].joins[0].clause.filters[0].options,
    );
  });

  it("should objectify `Keys` options", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Inner,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "F1",
                      right: "F2",
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const filter = <FilterStruct>(
      struct.models(0)?.joins(0)?.clause()?.filters(0)
    );
    const opts = objectifyFilterOptions(filter);
    expect(opts).toEqual(
      hdom.models[0].joins[0].clause.filters[0].options,
    );
  });

  it("should objectify empty `Named` options", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Inner,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Named,
                    options: {
                      name: FilterNameEnum.Equals,
                      field: "",
                      values: [],
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const filter = <FilterStruct>(
      struct.models(0)?.joins(0)?.clause()?.filters(0)
    );
    const opts = objectifyFilterOptions(filter);
    expect(opts).toEqual(
      hdom.models[0].joins[0].clause.filters[0].options,
    );
  });

  it("should objectify `Named` options", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Inner,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Named,
                    options: {
                      name: FilterNameEnum.Equals,
                      field: "F",
                      values: ["V"],
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const filter = <FilterStruct>(
      struct.models(0)?.joins(0)?.clause()?.filters(0)
    );
    const opts = objectifyFilterOptions(filter);
    expect(opts).toEqual(
      hdom.models[0].joins[0].clause.filters[0].options,
    );
  });
});

describe("The `objectifyFilterClause` function", () => {
  it("should objectify empty clause", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Cross,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const clause = <FilterClauseStruct>(
      struct.models(0)?.joins(0)?.clause()
    );
    const opts = objectifyFilterClause(clause);
    expect(opts).toEqual(hdom.models[0].joins[0].clause);
  });

  it("should objectify clause with filters only", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Cross,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "F1",
                      right: "F2",
                    },
                  },
                ],
                children: [],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const clause = <FilterClauseStruct>(
      struct.models(0)?.joins(0)?.clause()
    );
    const opts = objectifyFilterClause(clause);
    expect(opts).toEqual(hdom.models[0].joins[0].clause);
  });

  it("should objectify clause with children only", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Cross,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [],
                children: [
                  {
                    type: FilterOperatorEnum.None,
                    filters: [
                      {
                        type: FilterTypeEnum.Keys,
                        options: {
                          left: "F1",
                          right: "F2",
                        },
                      },
                    ],
                    children: [],
                  },
                ],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const clause = <FilterClauseStruct>(
      struct.models(0)?.joins(0)?.clause()
    );
    const opts = objectifyFilterClause(clause);
    expect(opts).toEqual(hdom.models[0].joins[0].clause);
  });

  it("should objectify clause with filters and children", () => {
    const hdom: HDOM = {
      includes: [],
      connections: [],
      models: [
        {
          name: "model",
          description: null,
          tables: [],
          joins: [
            {
              left: "T1",
              right: "T2",
              type: JoinTypeEnum.Cross,
              description: null,
              clause: {
                type: FilterOperatorEnum.And,
                filters: [
                  {
                    type: FilterTypeEnum.Named,
                    options: {
                      name: FilterNameEnum.Equals,
                      field: "F1",
                      values: ["1"],
                    },
                  },
                ],
                children: [
                  {
                    type: FilterOperatorEnum.None,
                    filters: [
                      {
                        type: FilterTypeEnum.Keys,
                        options: {
                          left: "F1",
                          right: "F2",
                        },
                      },
                    ],
                    children: [],
                  },
                ],
              },
            },
          ],
        },
      ],
      frames: [],
    };
    const bytes = serialize(hdom);
    const struct = deserialize(bytes);
    const clause = <FilterClauseStruct>(
      struct.models(0)?.joins(0)?.clause()
    );
    const opts = objectifyFilterClause(clause);
    expect(opts).toEqual(hdom.models[0].joins[0].clause);
  });
});

describe("The `getNamedFilterSQL` and `getNamedFilterHTML` function", () => {
  it("should stringify filter without field name", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
        field: "",
        values: ["1"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Equals,
      field: "",
      values: ["1"],
    });
    expect(sql).toBe("false");
    expect(html).toBe("<!-- incorrect filter options -->");
  });

  it("should stringify filter without values name", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
        field: "F1",
        values: [],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Equals,
      field: "F1",
      values: [],
    });
    expect(sql).toBe("false");
    expect(html).toBe("<!-- incorrect filter options -->");
  });

  it("should stringify `Equals` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
        field: '"F1"',
        values: ["1"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Equals,
      field: '"F1"',
      values: ["1"],
    });
    expect(sql).toBe('"F1" = 1');
    expect(html).toBe(
      '<hdml-filter type="named" name="equals" field="`F1`" values="1"></hdml-filter>',
    );
  });

  it("should stringify `NotEquals` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.NotEquals,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.NotEquals,
      field: '"F1"',
      values: ["'abc'"],
    });
    expect(sql).toBe("\"F1\" != 'abc'");
    expect(html).toBe(
      '<hdml-filter type="named" name="not-equals" field="`F1`" values="\'abc\'"></hdml-filter>',
    );
  });

  it("should stringify filter with incorrect string", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Contains,
        field: '"F1"',
        values: ["abc'"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Contains,
      field: '"F1"',
      values: ["abc'"],
    });
    expect(sql).toBe("false");
    expect(html).toBe(
      '<hdml-filter type="named" name="contains" field="`F1`" values="abc\'"></hdml-filter>',
    );
  });

  it("should stringify filter with quates", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Contains,
        field: '"F1"',
        // eslint-disable-next-line prettier/prettier, no-useless-escape
        values: ["'ab\'c'"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Contains,
      field: '"F1"',
      // eslint-disable-next-line prettier/prettier, no-useless-escape
      values: ["'ab\'c'"],
    });
    // eslint-disable-next-line prettier/prettier, no-useless-escape
    expect(sql).toBe("\"F1\" like '%ab\'c%' escape '\\'");
    expect(html).toBe(
      '<hdml-filter type="named" name="contains" field="`F1`" values="\'ab\'c\'"></hdml-filter>',
    );
  });

  it("should stringify `Contains` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Contains,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Contains,
      field: '"F1"',
      values: ["'abc'"],
    });
    expect(sql).toBe("\"F1\" like '%abc%' escape '\\'");
    expect(html).toBe(
      '<hdml-filter type="named" name="contains" field="`F1`" values="\'abc\'"></hdml-filter>',
    );
  });

  it("should stringify `NotContains` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.NotContains,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.NotContains,
      field: '"F1"',
      values: ["'abc'"],
    });
    expect(sql).toBe("\"F1\" not like '%abc%' escape '\\'");
    expect(html).toBe(
      '<hdml-filter type="named" name="not-contains" field="`F1`" values="\'abc\'"></hdml-filter>',
    );
  });

  it("should stringify `StartsWith` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.StartsWith,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.StartsWith,
      field: '"F1"',
      values: ["'abc'"],
    });
    expect(sql).toBe("\"F1\" like 'abc%' escape '\\'");
    expect(html).toBe(
      '<hdml-filter type="named" name="starts-with" field="`F1`" values="\'abc\'"></hdml-filter>',
    );
  });

  it("should stringify `EndsWith` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.EndsWith,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.EndsWith,
      field: '"F1"',
      values: ["'abc'"],
    });
    expect(sql).toBe("\"F1\" like '%abc' escape '\\'");
    expect(html).toBe(
      '<hdml-filter type="named" name="ends-with" field="`F1`" values="\'abc\'"></hdml-filter>',
    );
  });

  it("should stringify `Greater` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Greater,
        field: '"F1"',
        values: ["0"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Greater,
      field: '"F1"',
      values: ["0"],
    });
    expect(sql).toBe('"F1" > 0');
    expect(html).toBe(
      '<hdml-filter type="named" name="greater" field="`F1`" values="0"></hdml-filter>',
    );
  });

  it("should stringify `GreaterEqual` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.GreaterEqual,
        field: '"F1"',
        values: ["0"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.GreaterEqual,
      field: '"F1"',
      values: ["0"],
    });
    expect(sql).toBe('"F1" >= 0');
    expect(html).toBe(
      '<hdml-filter type="named" name="greater-equal" field="`F1`" values="0"></hdml-filter>',
    );
  });

  it("should stringify `Less` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Less,
        field: '"F1"',
        values: ["0"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Less,
      field: '"F1"',
      values: ["0"],
    });
    expect(sql).toBe('"F1" < 0');
    expect(html).toBe(
      '<hdml-filter type="named" name="less" field="`F1`" values="0"></hdml-filter>',
    );
  });

  it("should stringify `LessEqual` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.LessEqual,
        field: '"F1"',
        values: ["0"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.LessEqual,
      field: '"F1"',
      values: ["0"],
    });
    expect(sql).toBe('"F1" <= 0');
    expect(html).toBe(
      '<hdml-filter type="named" name="less-equal" field="`F1`" values="0"></hdml-filter>',
    );
  });

  it("should stringify `IsNull` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.IsNull,
        field: '"F1"',
        values: [],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.IsNull,
      field: '"F1"',
      values: [],
    });
    expect(sql).toBe('"F1" is null');
    expect(html).toBe(
      '<hdml-filter type="named" name="is-null" field="`F1`"></hdml-filter>',
    );
  });

  it("should stringify `IsNotNull` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.IsNotNull,
        field: '"F1"',
        values: [],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.IsNotNull,
      field: '"F1"',
      values: [],
    });
    expect(sql).toBe('"F1" is not null');
    expect(html).toBe(
      '<hdml-filter type="named" name="is-not-null" field="`F1`"></hdml-filter>',
    );
  });

  it("should stringify `Between` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Between,
        field: '"F1"',
        values: ["0", "100"],
      },
    });
    const html = getNamedFilterHTML({
      name: FilterNameEnum.Between,
      field: '"F1"',
      values: ["0", "100"],
    });
    expect(sql).toBe('"F1" between 0 and 100');
    expect(html).toBe(
      '<hdml-filter type="named" name="between" field="`F1`" values="0,100"></hdml-filter>',
    );
  });
});

describe("The `getExpressionFilterSQL` and `getExpressionFilterHTML` function", () => {
  it("should stringify filter with empty clause", () => {
    const sql = getExpressionFilterSQL({
      type: FilterTypeEnum.Expression,
      options: {
        clause: "",
      },
    });
    const html = getExpressionFilterHTML({
      clause: "",
    });
    expect(sql).toBe("false");
    expect(html).toBe("<!-- incorrect filter options -->");
  });

  it("should stringify `Expression` filter", () => {
    const sql = getExpressionFilterSQL({
      type: FilterTypeEnum.Expression,
      options: {
        clause: "1 = 1",
      },
    });
    const html = getExpressionFilterHTML({
      clause: "1 = 1",
    });
    expect(sql).toBe("1 = 1");
    expect(html).toBe(
      '<hdml-filter type="expr" clause="1 = 1"></hdml-filter>',
    );
  });
});

describe("The `getKeysFilterSQL` and `getKeysFilterHTML` function", () => {
  it("should stringify filter if `left` table is empty", () => {
    const sql = getKeysFilterSQL(
      {
        type: FilterTypeEnum.Keys,
        options: {
          left: "F1",
          right: "F2",
        },
      },
      {
        left: "",
        right: "T2",
      },
    );
    const html = getKeysFilterHTML({
      left: "F1",
      right: "F2",
    });
    expect(sql).toBe("false");
    expect(html).toBe(
      '<hdml-filter type="keys" left="F1" right="F2"></hdml-filter>',
    );
  });

  it("should stringify filter if `right` table is empty", () => {
    const sql = getKeysFilterSQL(
      {
        type: FilterTypeEnum.Keys,
        options: {
          left: "F1",
          right: "F2",
        },
      },
      {
        left: "T1",
        right: "",
      },
    );
    const html = getKeysFilterHTML({
      left: "F1",
      right: "F2",
    });
    expect(sql).toBe("false");
    expect(html).toBe(
      '<hdml-filter type="keys" left="F1" right="F2"></hdml-filter>',
    );
  });

  it("should stringify filter if `left` field is empty", () => {
    const sql = getKeysFilterSQL(
      {
        type: FilterTypeEnum.Keys,
        options: {
          left: "",
          right: "F2",
        },
      },
      {
        left: "T1",
        right: "T2",
      },
    );
    const html = getKeysFilterHTML({
      left: "",
      right: "F2",
    });
    expect(sql).toBe("false");
    expect(html).toBe("<!-- incorrect filter options -->");
  });

  it("should stringify filter if `right` field is empty", () => {
    const sql = getKeysFilterSQL(
      {
        type: FilterTypeEnum.Keys,
        options: {
          left: "F1",
          right: "",
        },
      },
      {
        left: "T1",
        right: "T2",
      },
    );
    const html = getKeysFilterHTML({
      left: "F1",
      right: "",
    });
    expect(sql).toBe("false");
    expect(html).toBe("<!-- incorrect filter options -->");
  });

  it("should stringify filter", () => {
    const sql = getKeysFilterSQL(
      {
        type: FilterTypeEnum.Keys,
        options: {
          left: "F1",
          right: "F2",
        },
      },
      {
        left: "T1",
        right: "T2",
      },
    );
    const html = getKeysFilterHTML({
      left: "F1",
      right: "F2",
    });
    expect(sql).toBe('"T1"."F1" = "T2"."F2"');
    expect(html).toBe(
      '<hdml-filter type="keys" left="F1" right="F2"></hdml-filter>',
    );
  });
});

describe("The `getFilterSQL` and `getFilterHTML` function", () => {
  it("should stringify `Keys` filter", () => {
    const sql = getFilterSQL(
      {
        type: FilterTypeEnum.Keys,
        options: {
          left: "F1",
          right: "F2",
        },
      },
      {
        left: "T1",
        right: "T2",
      },
    );
    const html = getFilterHTML({
      type: FilterTypeEnum.Keys,
      options: {
        left: "F1",
        right: "F2",
      },
    });
    expect(sql).toBe('"T1"."F1" = "T2"."F2"');
    expect(html).toBe(
      '<hdml-filter type="keys" left="F1" right="F2"></hdml-filter>',
    );
  });

  it("should stringify `Expression` filter", () => {
    const sql = getFilterSQL({
      type: FilterTypeEnum.Expression,
      options: {
        clause: "1 = 1",
      },
    });
    const html = getFilterHTML({
      type: FilterTypeEnum.Expression,
      options: {
        clause: "1 = 1",
      },
    });
    expect(sql).toBe("1 = 1");
    expect(html).toBe(
      '<hdml-filter type="expr" clause="1 = 1"></hdml-filter>',
    );
  });

  it("should stringify `Named` filter", () => {
    const sql = getFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
        field: "1",
        values: ["1"],
      },
    });
    const html = getFilterHTML({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
        field: "1",
        values: ["1"],
      },
    });
    expect(sql).toBe("1 = 1");
    expect(html).toBe(
      '<hdml-filter type="named" name="equals" field="1" values="1"></hdml-filter>',
    );
  });
});

describe("The `getFilterClauseSQL` and `getFilterClauseHTML` function", () => {
  it("should stringify empty clause with `and` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [],
    });
    expect(sql).toBe("1 = 1\n");
    expect(html).toBe(
      '<hdml-connective operator="and">\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with one filter with `and` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [],
    });
    expect(sql).toBe("1 = 1\nand 2 = 2\n");
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-filter type="expr" clause="2 = 2"></hdml-filter>\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with filters only with `and` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
        {
          type: FilterTypeEnum.Named,
          options: {
            name: FilterNameEnum.Equals,
            field: "3",
            values: ["3"],
          },
        },
      ],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
        {
          type: FilterTypeEnum.Named,
          options: {
            name: FilterNameEnum.Equals,
            field: "3",
            values: ["3"],
          },
        },
      ],
      children: [],
    });
    expect(sql).toBe("1 = 1\nand 2 = 2\nand 3 = 3\n");
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-filter type="expr" clause="2 = 2"></hdml-filter>\n  <hdml-filter type="named" name="equals" field="3" values="3"></hdml-filter>\n</hdml-connective>\n',
    );
  });

  it("should stringify empty clause with `or` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.Or,
      filters: [],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.Or,
      filters: [],
      children: [],
    });
    expect(sql).toBe("1 != 1\n");
    expect(html).toBe(
      '<hdml-connective operator="or">\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with one filter with `or` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.Or,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.Or,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [],
    });
    expect(sql).toBe("1 != 1\nor 2 = 2\n");
    expect(html).toBe(
      '<hdml-connective operator="or">\n  <hdml-filter type="expr" clause="2 = 2"></hdml-filter>\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with filters only with `or` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.Or,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
        {
          type: FilterTypeEnum.Named,
          options: {
            name: FilterNameEnum.Equals,
            field: "3",
            values: ["3"],
          },
        },
      ],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.Or,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
        {
          type: FilterTypeEnum.Named,
          options: {
            name: FilterNameEnum.Equals,
            field: "3",
            values: ["3"],
          },
        },
      ],
      children: [],
    });
    expect(sql).toBe("1 != 1\nor 2 = 2\nor 3 = 3\n");
    expect(html).toBe(
      '<hdml-connective operator="or">\n  <hdml-filter type="expr" clause="2 = 2"></hdml-filter>\n  <hdml-filter type="named" name="equals" field="3" values="3"></hdml-filter>\n</hdml-connective>\n',
    );
  });

  it("should stringify empty clause with `none` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.None,
      filters: [],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.None,
      filters: [],
      children: [],
    });
    expect(sql).toBe("");
    expect(html).toBe(
      '<hdml-connective operator="none">\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with one filter with `none` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.None,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.None,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [],
    });
    expect(sql).toBe("2 = 2\n");
    expect(html).toBe(
      '<hdml-connective operator="none">\n  <hdml-filter type="expr" clause="2 = 2"></hdml-filter>\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with filters only with `none` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.None,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
        {
          type: FilterTypeEnum.Named,
          options: {
            name: FilterNameEnum.Equals,
            field: "3",
            values: ["3"],
          },
        },
      ],
      children: [],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.None,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
        {
          type: FilterTypeEnum.Named,
          options: {
            name: FilterNameEnum.Equals,
            field: "3",
            values: ["3"],
          },
        },
      ],
      children: [],
    });
    expect(sql).toBe("2 = 2\n");
    expect(html).toBe(
      '<hdml-connective operator="none">\n  <hdml-filter type="expr" clause="2 = 2"></hdml-filter>\n  <hdml-filter type="named" name="equals" field="3" values="3"></hdml-filter>\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with `and` operator and one empty child with `none` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.None,
          filters: [],
          children: [],
        },
      ],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.None,
          filters: [],
          children: [],
        },
      ],
    });
    // TODO (buntarb): this will throw on SQL level. Optimize it?
    expect(sql).toBe("1 = 1\nand (\n)\n");
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-connective operator="none">\n  </hdml-connective>\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with `and` operator and one empty child with `and` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [],
          children: [],
        },
      ],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [],
          children: [],
        },
      ],
    });
    expect(sql).toBe("1 = 1\nand (\n  1 = 1\n)\n");
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-connective operator="and">\n  </hdml-connective>\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with `and` operator and one empty child with `or` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.Or,
          filters: [],
          children: [],
        },
      ],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.Or,
          filters: [],
          children: [],
        },
      ],
    });
    expect(sql).toBe("1 = 1\nand (\n  1 != 1\n)\n");
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-connective operator="or">\n  </hdml-connective>\n</hdml-connective>\n',
    );
  });

  it("should stringify clause with `and` operator and two empty child with `and` operator", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [],
          children: [],
        },
        {
          type: FilterOperatorEnum.And,
          filters: [],
          children: [],
        },
      ],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [],
          children: [],
        },
        {
          type: FilterOperatorEnum.And,
          filters: [],
          children: [],
        },
      ],
    });
    expect(sql).toBe("1 = 1\nand (\n  1 = 1\n)\nand (\n  1 = 1\n)\n");
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-connective operator="and">\n  </hdml-connective>\n  <hdml-connective operator="and">\n  </hdml-connective>\n</hdml-connective>\n',
    );
  });

  it("should stringify 3-level clause with `and` operators", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [],
          children: [
            {
              type: FilterOperatorEnum.And,
              filters: [],
              children: [],
            },
          ],
        },
      ],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [],
          children: [
            {
              type: FilterOperatorEnum.And,
              filters: [],
              children: [],
            },
          ],
        },
      ],
    });
    expect(sql).toBe(
      "1 = 1\nand (\n  1 = 1\n  and (\n    1 = 1\n  )\n)\n",
    );
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-connective operator="and">\n    <hdml-connective operator="and">\n    </hdml-connective>\n  </hdml-connective>\n</hdml-connective>\n',
    );
  });

  it("should stringify 3-level clause with `and` and `or`", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [
            {
              type: FilterTypeEnum.Expression,
              options: {
                clause: "3 = 3",
              },
            },
          ],
          children: [
            {
              type: FilterOperatorEnum.Or,
              filters: [
                {
                  type: FilterTypeEnum.Expression,
                  options: {
                    clause: "4 = 4",
                  },
                },
                {
                  type: FilterTypeEnum.Expression,
                  options: {
                    clause: "5 = 5",
                  },
                },
              ],
              children: [],
            },
          ],
        },
      ],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [
            {
              type: FilterTypeEnum.Expression,
              options: {
                clause: "3 = 3",
              },
            },
          ],
          children: [
            {
              type: FilterOperatorEnum.Or,
              filters: [
                {
                  type: FilterTypeEnum.Expression,
                  options: {
                    clause: "4 = 4",
                  },
                },
                {
                  type: FilterTypeEnum.Expression,
                  options: {
                    clause: "5 = 5",
                  },
                },
              ],
              children: [],
            },
          ],
        },
      ],
    });
    expect(sql).toBe(
      "1 = 1\nand 2 = 2\nand (\n  1 = 1\n  and 3 = 3\n  and (\n    1 != 1\n    or 4 = 4\n    or 5 = 5\n  )\n)\n",
    );
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-filter type="expr" clause="2 = 2"></hdml-filter>\n  <hdml-connective operator="and">\n    <hdml-filter type="expr" clause="3 = 3"></hdml-filter>\n    <hdml-connective operator="or">\n      <hdml-filter type="expr" clause="4 = 4"></hdml-filter>\n      <hdml-filter type="expr" clause="5 = 5"></hdml-filter>\n    </hdml-connective>\n  </hdml-connective>\n</hdml-connective>\n',
    );
  });

  it("should stringify 3-level clause with `and` and `none`", () => {
    const sql = getFilterClauseSQL({
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [
            {
              type: FilterTypeEnum.Expression,
              options: {
                clause: "3 = 3",
              },
            },
          ],
          children: [
            {
              type: FilterOperatorEnum.None,
              filters: [
                {
                  type: FilterTypeEnum.Expression,
                  options: {
                    clause: "4 = 4",
                  },
                },
                {
                  type: FilterTypeEnum.Expression,
                  options: {
                    clause: "5 = 5",
                  },
                },
              ],
              children: [],
            },
          ],
        },
      ],
    });
    const html = getFilterClauseHTML({
      type: FilterOperatorEnum.And,
      filters: [
        {
          type: FilterTypeEnum.Expression,
          options: {
            clause: "2 = 2",
          },
        },
      ],
      children: [
        {
          type: FilterOperatorEnum.And,
          filters: [
            {
              type: FilterTypeEnum.Expression,
              options: {
                clause: "3 = 3",
              },
            },
          ],
          children: [
            {
              type: FilterOperatorEnum.None,
              filters: [
                {
                  type: FilterTypeEnum.Expression,
                  options: {
                    clause: "4 = 4",
                  },
                },
                {
                  type: FilterTypeEnum.Expression,
                  options: {
                    clause: "5 = 5",
                  },
                },
              ],
              children: [],
            },
          ],
        },
      ],
    });
    expect(sql).toBe(
      "1 = 1\nand 2 = 2\nand (\n  1 = 1\n  and 3 = 3\n  and (\n    4 = 4\n  )\n)\n",
    );
    expect(html).toBe(
      '<hdml-connective operator="and">\n  <hdml-filter type="expr" clause="2 = 2"></hdml-filter>\n  <hdml-connective operator="and">\n    <hdml-filter type="expr" clause="3 = 3"></hdml-filter>\n    <hdml-connective operator="none">\n      <hdml-filter type="expr" clause="4 = 4"></hdml-filter>\n      <hdml-filter type="expr" clause="5 = 5"></hdml-filter>\n    </hdml-connective>\n  </hdml-connective>\n</hdml-connective>\n',
    );
  });
});

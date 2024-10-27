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

describe("The `getNamedFilterSQL` function", () => {
  it("should sequalize filter without field name", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
        field: "",
        values: ["1"],
      },
    });
    expect(sql).toBe("false");
  });

  it("should sequalize filter without values name", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
        field: "F1",
        values: [],
      },
    });
    expect(sql).toBe("false");
  });

  it("should sequalize `Equals` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Equals,
        field: '"F1"',
        values: ["1"],
      },
    });
    expect(sql).toBe('"F1" = 1');
  });

  it("should sequalize `NotEquals` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.NotEquals,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    expect(sql).toBe("\"F1\" != 'abc'");
  });

  it("should sequalize filter with incorrect string", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Contains,
        field: '"F1"',
        values: ["abc'"],
      },
    });
    expect(sql).toBe("false");
  });

  it("should sequalize filter with quates", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Contains,
        field: '"F1"',
        // eslint-disable-next-line prettier/prettier, no-useless-escape
        values: ["'ab\'c'"],
      },
    });
    // eslint-disable-next-line prettier/prettier, no-useless-escape
    expect(sql).toBe("\"F1\" like '%ab\'c%' escape '\\'");
  });

  it("should sequalize `Contains` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Contains,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    expect(sql).toBe("\"F1\" like '%abc%' escape '\\'");
  });

  it("should sequalize `NotContains` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.NotContains,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    expect(sql).toBe("\"F1\" not like '%abc%' escape '\\'");
  });

  it("should sequalize `StartsWith` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.StartsWith,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    expect(sql).toBe("\"F1\" like 'abc%' escape '\\'");
  });

  it("should sequalize `EndsWith` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.EndsWith,
        field: '"F1"',
        values: ["'abc'"],
      },
    });
    expect(sql).toBe("\"F1\" like '%abc' escape '\\'");
  });

  it("should sequalize `Greater` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Greater,
        field: '"F1"',
        values: ["0"],
      },
    });
    expect(sql).toBe('"F1" > 0');
  });

  it("should sequalize `GreaterEqual` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.GreaterEqual,
        field: '"F1"',
        values: ["0"],
      },
    });
    expect(sql).toBe('"F1" >= 0');
  });

  it("should sequalize `Less` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Less,
        field: '"F1"',
        values: ["0"],
      },
    });
    expect(sql).toBe('"F1" < 0');
  });

  it("should sequalize `LessEqual` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.LessEqual,
        field: '"F1"',
        values: ["0"],
      },
    });
    expect(sql).toBe('"F1" <= 0');
  });

  it("should sequalize `IsNull` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.IsNull,
        field: '"F1"',
        values: [],
      },
    });
    expect(sql).toBe('"F1" is null');
  });

  it("should sequalize `IsNotNull` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.IsNotNull,
        field: '"F1"',
        values: [],
      },
    });
    expect(sql).toBe('"F1" is not null');
  });

  it("should sequalize `Between` filter", () => {
    const sql = getNamedFilterSQL({
      type: FilterTypeEnum.Named,
      options: {
        name: FilterNameEnum.Between,
        field: '"F1"',
        values: ["0", "100"],
      },
    });
    expect(sql).toBe('"F1" between 0 and 100');
  });
});

describe("The `getExpressionFilterSQL` function", () => {
  it("should sequalize filter with empty clause", () => {
    const sql = getExpressionFilterSQL({
      type: FilterTypeEnum.Expression,
      options: {
        clause: "",
      },
    });
    expect(sql).toBe("false");
  });

  it("should sequalize `Expression` filter", () => {
    const sql = getExpressionFilterSQL({
      type: FilterTypeEnum.Expression,
      options: {
        clause: "1 = 1",
      },
    });
    expect(sql).toBe("1 = 1");
  });
});

describe("The `getKeysFilterSQL` function", () => {
  it("should sequalize filter", () => {
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
    expect(sql).toBe('"T1"."F1" = "T2"."F2"');
  });
});

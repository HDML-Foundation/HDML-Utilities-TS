/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable max-len */

import { HDOM, KeysParameters } from "@hdml/types";
import {
  JoinTypeEnum,
  FilterTypeEnum,
  FilterOperatorEnum,
} from "@hdml/schemas";
import { Join } from "@hdml/types";
import { serialize, deserialize } from "@hdml/buffer";
import {
  getJoins,
  getDag,
  findRoots,
  sortJoins,
  getJoinSQL,
} from "./join";

// Following join structures are described in joins related testd:
//
// ===================================================================
// Case 1
// ===================================================================
//
//     (T1)
//
// ===================================================================
// Case 2
// ===================================================================
//
//  (T1)  (T2)
//
// ===================================================================
// Case 3
// ===================================================================
//
//     (T1)
//     /  \
//  (T2)  (T3)
//
// ===================================================================
// Case 4
// ===================================================================
//
//        (T1)
//        /  \
//     (T2)  (T3)
//     /
//  (T4)
//
// ===================================================================
// Case 5
// ===================================================================
//
//        (T1)
//        /  \
//     (T2)  (T3)
//     /        \
//  (T4)        (T5)
//
// ===================================================================
// Case 6
// ===================================================================
//
//     (T6)
//        \
//        (T1)
//        /  \
//     (T2)  (T3)
//     /        \
//  (T4)        (T5)
//
// ===================================================================
// Case 7
// ===================================================================
//
//     (T6)
//        \
//        (T1)
//        /  \
//     (T2)  (T3)
//     /  \     \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 8
// ===================================================================
//
//     (T6)
//        \
//        (T1)
//        /  \
//     (T2)  (T3)
//     /  \  /  \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 9
// ===================================================================
//
//     (T6)
//        \
//  (T7)  (T1)
//     \  /  \
//     (T2)  (T3)
//     /  \     \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 10
// ===================================================================
//
//     (T6)  (T7)
//        \  /
//  (T7)  (T1)
//     \  /  \
//     (T2)  (T3)
//     /  \     \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 11
// ===================================================================
//
//     (T6)  (T7)
//        \  /
//  (T7)  (T1)
//     \  /  \
//     (T2)  (T3)
//     /  \  /  \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 12
// ===================================================================
//
//              (T5)
//              /
//     (T6)  (T7)
//        \  /
//  (T7)  (T1)
//     \  /  \
//     (T2)  (T3)
//     /  \  /  \
//  (T4)  (T6)  (T5)
//
// ===================================================================
// Case 13
// ===================================================================
//
//  (T9)        (T5)
//     \        /
//     (T6)  (T7)
//        \  /
//  (T7)  (T1)  (T8)
//     \  /  \  /
//     (T2)  (T3)
//     /  \  /  \
//  (T4)  (T6)  (T5)
//

let case1: Join[];
let case2: Join[];
let case3: Join[];
let case4: Join[];
let case5: Join[];
let case6: Join[];
let case7: Join[];
let case8: Join[];
let case9: Join[];
let case10: Join[];
let case11: Join[];
let case12: Join[];
let case13: Join[];

describe("The `getJoinSQL` function", () => {
  it("shoul sequalize empty join", () => {
    const sql = getJoinSQL([]);
    expect(sql).toBe("");
  });

  it("shoul sequalize join without filters", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.Cross,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [],
        },
      },
    ]);
    expect(sql).toBe('\n  from "T1"\n  cross join "T2"\n');
  });

  it("shoul sequalize `Full` join", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.Full,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F2",
              },
            },
          ],
        },
      },
    ]);
    expect(sql).toBe(
      '\n  from "T1"\n  full join "T2"\n  on (\n    "T1"."F1" ="T2"."F2"\n  )\n',
    );
  });

  it("shoul sequalize `Left` join", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.Left,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F2",
              },
            },
          ],
        },
      },
    ]);
    expect(sql).toBe(
      '\n  from "T1"\n  left join "T2"\n  on (\n    "T1"."F1" ="T2"."F2"\n  )\n',
    );
  });

  it("shoul sequalize `Right` join", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.Right,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F2",
              },
            },
          ],
        },
      },
    ]);
    expect(sql).toBe(
      '\n  from "T1"\n  right join "T2"\n  on (\n    "T1"."F1" ="T2"."F2"\n  )\n',
    );
  });

  it("shoul sequalize `FullOuter` join", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.FullOuter,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F2",
              },
            },
          ],
        },
      },
    ]);
    expect(sql).toBe(
      '\n  from "T1"\n  full outer join "T2"\n  on (\n    "T1"."F1" ="T2"."F2"\n  )\n',
    );
  });

  it("shoul sequalize `LeftOuter` join", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.LeftOuter,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F2",
              },
            },
          ],
        },
      },
    ]);
    expect(sql).toBe(
      '\n  from "T1"\n  left outer join "T2"\n  on (\n    "T1"."F1" ="T2"."F2"\n  )\n',
    );
  });

  it("shoul sequalize `RightOuter` join", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.RightOuter,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F2",
              },
            },
          ],
        },
      },
    ]);
    expect(sql).toBe(
      '\n  from "T1"\n  right outer join "T2"\n  on (\n    "T1"."F1" ="T2"."F2"\n  )\n',
    );
  });

  it("shoul sequalize `Inner` join", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.Inner,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F2",
              },
            },
          ],
        },
      },
    ]);
    expect(sql).toBe(
      '\n  from "T1"\n  inner join "T2"\n  on (\n    "T1"."F1" ="T2"."F2"\n  )\n',
    );
  });

  it("shoul sequalize `Cross` join", () => {
    const sql = getJoinSQL([
      {
        type: JoinTypeEnum.Cross,
        description: null,
        left: "T1",
        right: "T2",
        clause: {
          type: FilterOperatorEnum.None,
          children: [],
          filters: [
            {
              type: FilterTypeEnum.Keys,
              options: {
                left: "F1",
                right: "F2",
              },
            },
          ],
        },
      },
    ]);
    expect(sql).toBe(
      '\n  from "T1"\n  cross join "T2"\n  on (\n    "T1"."F1" ="T2"."F2"\n  )\n',
    );
  });
});

describe("The `getJoins` function", () => {
  it("should objectify case 1", () => {
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
              right: "",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.And,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case1 = getJoins(struct.models(0)!);
    expect(case1).toEqual([]);
  });

  it("should objectify case 2", () => {
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
              right: "",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case2 = getJoins(struct.models(0)!);
    expect(case2).toEqual([]);
  });

  it("should objectify case 3", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case3 = getJoins(struct.models(0)!);
    expect(case3).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 4", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case4 = getJoins(struct.models(0)!);
    expect(case4).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 5", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case5 = getJoins(struct.models(0)!);
    expect(case5).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 6", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case6 = getJoins(struct.models(0)!);
    expect(case6).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 7", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case7 = getJoins(struct.models(0)!);
    expect(case7).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 8", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case8 = getJoins(struct.models(0)!);
    expect(case8).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 9", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case9 = getJoins(struct.models(0)!);
    expect(case9).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 10", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case10 = getJoins(struct.models(0)!);
    expect(case10).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 11", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case11 = getJoins(struct.models(0)!);
    expect(case11).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 12", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T5",
              right: "T7",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case12 = getJoins(struct.models(0)!);
    expect(case12).toEqual(hdom.models[0].joins);
  });

  it("should objectify case 13", () => {
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
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T1",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T4",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T5",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T6",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T2",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T2",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T7",
              right: "T1",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T3",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T5",
              right: "T7",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T9",
              right: "T6",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
                    },
                  },
                ],
                children: [],
              },
            },
            {
              left: "T8",
              right: "T3",
              type: JoinTypeEnum.Left,
              description: null,
              clause: {
                type: FilterOperatorEnum.None,
                filters: [
                  {
                    type: FilterTypeEnum.Keys,
                    options: {
                      left: "left_field",
                      right: "right_field",
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
    case13 = getJoins(struct.models(0)!);
    expect(case13).toEqual(hdom.models[0].joins);
  });
});

describe("The `sortJoins` function", () => {
  it("should sort case 1", () => {
    const sorted = sortJoins(case1);
    expect(sorted).toEqual([]);
  });

  it("should sort case 2", () => {
    const sorted = sortJoins(case2);
    expect(sorted).toEqual([]);
  });

  it("should sort case 3", () => {
    const sorted = sortJoins(case3);
    expect(sorted).toEqual(case3);
  });

  it("should sort case 4", () => {
    const sorted = sortJoins(case4);
    expect(sorted).toEqual(case4);
  });

  it("should sort case 5", () => {
    const sorted = sortJoins(case5);
    expect(sorted).toEqual(case5);
  });

  it("should sort case 6", () => {
    const sorted = sortJoins(case6);
    expect(sorted).toEqual([
      {
        type: 3,
        left: "T6",
        right: "T1",
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        type: 3,
        left: "T1",
        right: "T2",
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        type: 3,
        left: "T1",
        right: "T3",
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        type: 3,
        left: "T2",
        right: "T4",
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        type: 3,
        left: "T3",
        right: "T5",
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 7", () => {
    const sorted = sortJoins(case7);
    expect(sorted).toEqual([
      {
        left: "T6",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 8", () => {
    const sorted = sortJoins(case8);
    expect(sorted).toEqual([
      {
        left: "T6",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 9", () => {
    const sorted = sortJoins(case9);
    expect(sorted).toEqual([
      {
        left: "T6",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T7",
        type: 4,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 10", () => {
    const sorted = sortJoins(case10);
    expect(sorted).toEqual([
      {
        left: "T7",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T7",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T6",
        type: 4,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 11", () => {
    const sorted = sortJoins(case11);
    expect(sorted).toEqual([
      {
        left: "T7",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T7",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T6",
        type: 4,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 12", () => {
    const sorted = sortJoins(case12);
    expect(sorted).toEqual([
      {
        left: "T5",
        right: "T7",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T7",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T7",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T6",
        type: 4,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 13", () => {
    const sorted = sortJoins(case13);
    expect(sorted).toEqual([
      {
        left: "T5",
        right: "T7",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T7",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T7",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T6",
        right: "T9",
        type: 4,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T6",
        type: 4,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T8",
        type: 4,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 9 (cross)", () => {
    case9[6].type = JoinTypeEnum.Cross;
    (<KeysParameters>case9[6].clause.filters[0].options).left =
      "left_field";
    (<KeysParameters>case9[6].clause.filters[0].options).right =
      "right_field";
    const sorted = sortJoins(case9);
    expect(sorted).toEqual([
      {
        left: "T6",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T7",
        type: 0,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 9 (right)", () => {
    case9[6].type = JoinTypeEnum.Right;
    (<KeysParameters>case9[6].clause.filters[0].options).left =
      "left_field";
    (<KeysParameters>case9[6].clause.filters[0].options).right =
      "right_field";
    const sorted = sortJoins(case9);
    expect(sorted).toEqual([
      {
        left: "T6",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T7",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 9 (left outer)", () => {
    case9[6].type = JoinTypeEnum.LeftOuter;
    (<KeysParameters>case9[6].clause.filters[0].options).left =
      "left_field";
    (<KeysParameters>case9[6].clause.filters[0].options).right =
      "right_field";
    const sorted = sortJoins(case9);
    expect(sorted).toEqual([
      {
        left: "T6",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T7",
        type: 7,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });

  it("should sort case 9 (right outer)", () => {
    case9[6].type = JoinTypeEnum.RightOuter;
    (<KeysParameters>case9[6].clause.filters[0].options).left =
      "left_field";
    (<KeysParameters>case9[6].clause.filters[0].options).right =
      "right_field";
    const sorted = sortJoins(case9);
    expect(sorted).toEqual([
      {
        left: "T6",
        right: "T1",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T2",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T1",
        right: "T3",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T4",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T6",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T2",
        right: "T7",
        type: 6,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "right_field",
                right: "left_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
      {
        left: "T3",
        right: "T5",
        type: 3,
        clause: {
          type: 2,
          filters: [
            {
              type: 1,
              options: {
                left: "left_field",
                right: "right_field",
              },
            },
          ],
          children: [],
        },
        description: null,
      },
    ]);
  });
});

describe("The `findRoots(getDag(join))`  functions", () => {
  it("should find `T1` for case 1", () => {
    const dag = getDag(case1);
    const roots = findRoots(dag);
    expect(roots).toEqual([]);
  });

  it("should find `T1` and `T2` for case 2", () => {
    const dag = getDag(case2);
    const roots = findRoots(dag);
    expect(roots).toEqual([]);
  });

  it("should find `T1` for case 3", () => {
    const dag = getDag(case3);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T1"]);
  });

  it("should find `T1` for case 4", () => {
    const dag = getDag(case4);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T1"]);
  });

  it("should find `T1` for case 5", () => {
    const dag = getDag(case5);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T1"]);
  });

  it("should find `T6` for case 6", () => {
    const dag = getDag(case6);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T6"]);
  });

  it("should find `T6` for case 7", () => {
    const dag = getDag(case7);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T6_out"]);
  });

  it("should find `T6` for case 8", () => {
    const dag = getDag(case8);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T6_out"]);
  });

  it("should find `T6` and `T7` for case 9", () => {
    const dag = getDag(case9);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T6_out", "T7"]);
  });

  it("should find `T6` and `T7` for case 10", () => {
    const dag = getDag(case10);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T7", "T6_out"]);
  });

  it("should find `T6` and `T7` for case 11", () => {
    const dag = getDag(case11);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T7", "T6_out"]);
  });

  it("should find `T6` and `T5` for case 12", () => {
    const dag = getDag(case12);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T5_out", "T6_out"]);
  });

  it("should find `T6`, `T8`, `T9` and `T5` for case 13", () => {
    const dag = getDag(case13);
    const roots = findRoots(dag);
    expect(roots).toEqual(["T5_out", "T6_out", "T8", "T9"]);
  });
});

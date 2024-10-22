/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  FieldStruct,
  ModelStruct,
  TableStruct,
  JoinStruct,
  FilterClauseStruct,
  FilterStruct,
  ExpressionParametersStruct,
  KeysParametersStruct,
  NamedParametersStruct,
  TableTypeEnum,
  JoinTypeEnum,
  FilterTypeEnum,
} from "@hdml/schemas";
import {
  Join,
  FilterClause,
  Filter,
  ExpressionParameters,
  KeysParameters,
  NamedParameters,
} from "@hdml/types";
import { t } from "../constants";
import { getTableFieldSQL } from "./field";

export function getModelSQL(model: ModelStruct, level = 0): string {
  const prefix = t.repeat(level);
  let tables: TableStruct[] = [];
  const joins: Join[] = sortJoins(getJoins(model));

  for (let i = 0; i < model.tablesLength(); i++) {
    const t = model.tables(i);
    if (t) {
      tables.push(t);
    }
  }

  tables = tables
    .sort((t1, t2) => {
      const n1 = t1.name();
      const n2 = t2.name();
      if (n1 && n2) {
        return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
      }
      return 0;
    })
    .filter((t) => {
      if (joins.length === 0) {
        return true;
      }
      let res = false;
      joins.forEach((j) => {
        res = res || t.name() === j.left || t.name() === j.right;
      });
      return res;
    });

  const tablesSQL = tables
    .map((t) => {
      switch (t.type()) {
        case TableTypeEnum.Query:
        case TableTypeEnum.Table:
          return "";
      }
    })
    .join(",\n");

  return "";
}

export function getTableSQL(table: TableStruct, level = 0): string {
  const prefix = t.repeat(level);
  const alias =
    table.type() === TableTypeEnum.Table
      ? table.identifier()
      : `_${table.name()}`;
  const fields: FieldStruct[] = [];

  for (let i = 0; i < table.fieldsLength(); i++) {
    const field = table.fields(i);
    if (field) {
      fields.push(field);
    }
  }

  const fieldsSQL = fields
    .filter((f) => f.name())
    .sort((f1, f2) => {
      const n1 = <string>f1.name();
      const n2 = <string>f2.name();
      return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
    })
    .map((f) => `${prefix}${t}${t}${getTableFieldSQL(f)}`)
    .join(",\n");

  let tableSQL = `${prefix}"${table.name()}" as (\n`;
  tableSQL =
    tableSQL +
    (table.type() === TableTypeEnum.Query
      ? `${prefix}${t}with ${alias} as (\n` +
        `${table
          .identifier()
          ?.split("\n")
          .map((row) => `${prefix}${t}${t}${row}`)
          .join("\n")}\n` +
        `${prefix}${t})\n`
      : "");
  tableSQL = tableSQL + `${prefix}${t}select\n`;
  tableSQL = tableSQL + `${fieldsSQL}\n`;
  tableSQL = tableSQL + `${prefix}${t}from\n`;
  tableSQL = tableSQL + `${prefix}${t}${t}${alias}\n`;
  tableSQL = tableSQL + `${prefix})`;
  return tableSQL;
}

export function getJoins(model: ModelStruct): Join[] {
  const joins: Join[] = [];

  const objectifyFilterOptions = (
    filter: FilterStruct,
  ): ExpressionParameters | KeysParameters | NamedParameters => {
    let opts: unknown;
    let data: ExpressionParameters | KeysParameters | NamedParameters;
    switch (filter.type()) {
      case FilterTypeEnum.Expression:
        opts = filter.options(new ExpressionParametersStruct());
        data = {
          clause: (<ExpressionParametersStruct>opts).clause() || "",
        };
        return data;
      case FilterTypeEnum.Keys:
        opts = filter.options(new KeysParametersStruct());
        data = {
          left: (<KeysParametersStruct>opts).left() || "",
          right: (<KeysParametersStruct>opts).right() || "",
        };
        return data;
      case FilterTypeEnum.Named:
        opts = filter.options(new NamedParametersStruct());
        data = {
          name: (<NamedParametersStruct>opts).name(),
          field: (<NamedParametersStruct>opts).field() || "",
          values: [],
        };
        for (
          let i = 0;
          i < (<NamedParametersStruct>opts).valuesLength();
          i++
        ) {
          data.values.push((<NamedParametersStruct>opts).values(i));
        }
        return data;
    }
  };

  const objectifyJoinClause = (
    clause: FilterClauseStruct,
  ): FilterClause => {
    const type = clause.type();
    const filters: Filter[] = [];
    const children: FilterClause[] = [];
    for (let i = 0; i < clause.filtersLength(); i++) {
      const filter = clause.filters(i);
      if (filter) {
        filters.push(<Filter>{
          type: filter.type(),
          options: objectifyFilterOptions(filter),
        });
      }
    }
    for (let i = 0; i < clause.childrenLength(); i++) {
      const child = clause.children(i)!;
      children.push(objectifyJoinClause(child));
    }
    return {
      type,
      filters,
      children,
    };
  };

  for (let i = 0; i < model.joinsLength(); i++) {
    const js = model.joins(i)!;
    joins.push({
      type: js.type(),
      left: js.left()!,
      right: js.right()!,
      clause: objectifyJoinClause(js.clause()!),
      description: js.description(),
    });
  }

  return joins;
}

export function sortJoins(joins: Join[]): Join[] {
  const result: Join[] = [];
  const dag = getDag(joins);
  const roots: string[] = findRoots(dag);

  if (roots.length > 1) {
    for (let i = 1; i < roots.length; i++) {
      invertJoinsPath(dag, roots[i]);
    }
  }

  const dfs = (root: string, visited: Set<string> = new Set()) => {
    if (visited.has(root)) {
      return;
    } else {
      visited.add(root);
      const neighbors: string[] = [];
      dag.forEach((j) => {
        if (j.left === root) {
          neighbors.push(j.right);
          result.push({
            ...j,
            left: j.left.replace("_in", "").replace("_out", ""),
            right: j.right.replace("_in", "").replace("_out", ""),
          });
        }
      });
      neighbors.forEach((neighbor) => {
        dfs(neighbor, visited);
      });
    }
  };
  dfs(roots[0]);

  return result;
}

export function invertJoinsPath(joins: Join[], root: string): void {
  for (const join of joins) {
    if (join.left === root) {
      invertJoin(join);
      invertJoinsPath(joins, join.right);
    }
  }
}

export function invertJoin(join: Join): void {
  const invertClause = (clause: FilterClause) => {
    clause.filters.forEach((filter) => {
      if (filter.type === FilterTypeEnum.Keys) {
        const left = filter.options.left;
        filter.options.left = filter.options.right;
        filter.options.right = left;
      }
    });
    clause.children.forEach(invertClause);
  };

  let left: string;
  switch (join.type) {
    case JoinTypeEnum.Cross:
    case JoinTypeEnum.Inner:
    case JoinTypeEnum.Full:
    case JoinTypeEnum.FullOuter:
      left = join.left;
      join.left = join.right;
      join.right = left;
      break;

    case JoinTypeEnum.Left:
      left = join.left;
      join.left = join.right;
      join.right = left;
      join.type = JoinTypeEnum.Right;
      invertClause(join.clause);
      break;

    case JoinTypeEnum.Right:
      left = join.left;
      join.left = join.right;
      join.right = left;
      join.type = JoinTypeEnum.Left;
      invertClause(join.clause);
      break;

    case JoinTypeEnum.LeftOuter:
      left = join.left;
      join.left = join.right;
      join.right = left;
      join.type = JoinTypeEnum.RightOuter;
      invertClause(join.clause);
      break;

    case JoinTypeEnum.RightOuter:
      left = join.left;
      join.left = join.right;
      join.right = left;
      join.type = JoinTypeEnum.LeftOuter;
      invertClause(join.clause);
      break;
  }
}

export function findRoots(graph: Join[]): string[] {
  // Step 1: Build an incoming edge count map for all nodes
  const incomingCount = new Map<string, number>();

  graph.forEach(({ left, right }) => {
    // Increment incoming edge count for the "right" node
    incomingCount.set(right, (incomingCount.get(right) || 0) + 1);
    // Ensure the "left" node is also in the map with at least 0
    // incoming edges
    if (!incomingCount.has(left)) {
      incomingCount.set(left, 0);
    }
  });

  // Step 2: Find nodes with 0 incoming edges, which are the roots
  const roots: string[] = [];
  incomingCount.forEach((count, node) => {
    if (count === 0) {
      roots.push(node);
    }
  });

  // Step 3: Count nodes in each tree starting from each root
  const nodeCounts = new Map<string, number>();

  const countNodes = (node: string): number => {
    // Return cached count
    if (nodeCounts.has(node)) return nodeCounts.get(node)!;
    let count = 1; // Count the current node
    const neighbors = graph
      .filter(({ left }) => left === node)
      .map(({ right }) => right);

    for (const neighbor of neighbors) {
      // Recursively count nodes in subtree
      count += countNodes(neighbor);
    }

    nodeCounts.set(node, count); // Cache the count
    return count;
  };

  // Count nodes for each root
  const rootCounts: [string, number][] = roots.map((root) => [
    root,
    countNodes(root),
  ]);

  // Step 4: Sort roots by the number of nodes in descending order
  rootCounts.sort((a, b) => b[1] - a[1]); // Sort by count, descending

  return rootCounts.map(([root]) => root); // Return sorted roots
}

export function getDag(graph: Join[]): Join[] {
  const incomingEdges = new Map<string, number>();
  const outgoingEdges = new Map<string, number>();
  const visited = new Set<string>();
  const inCycle = new Set<string>();
  const splitNodes = new Set<string>();

  // Step 1: Build the adjacency list and track incoming/outgoing
  // edges.
  graph.forEach(({ left, right }) => {
    outgoingEdges.set(left, (outgoingEdges.get(left) || 0) + 1);
    incomingEdges.set(right, (incomingEdges.get(right) || 0) + 1);
  });

  // Step 2: Detect cycles using DFS and pick the "most left" node for
  // splitting.
  function dfs(node: string, stack: Set<string>): boolean {
    if (stack.has(node)) {
      // Cycle detected: find the "most left" node in the cycle
      const cycleNodes = Array.from(stack);
      let mostLeftNode = cycleNodes[0];
      let minRatio = Number.POSITIVE_INFINITY;

      // Calculate outgoing-to-incoming edge ratio for each node in
      // the cycle.
      cycleNodes.forEach((n) => {
        const outCount = outgoingEdges.get(n) || 0;
        const inCount = incomingEdges.get(n) || 0;
        const ratio = inCount === 0 ? outCount : outCount / inCount;

        // Select the node with the minimal ratio for splitting.
        if (
          ratio < minRatio ||
          (ratio === minRatio &&
            inCount < incomingEdges.get(mostLeftNode)!)
        ) {
          minRatio = ratio;
          mostLeftNode = n;
        }
      });

      splitNodes.add(mostLeftNode);
      return true;
    }
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    const neighbors = graph
      .filter(({ left }) => left === node)
      .map(({ right }) => right);
    for (const neighbor of neighbors) {
      if (dfs(neighbor, stack)) {
        inCycle.add(node);
      }
    }

    stack.delete(node);
    return inCycle.has(node);
  }

  // Run DFS to detect cycles.
  outgoingEdges.forEach((_, node) => {
    if (!visited.has(node)) {
      dfs(node, new Set<string>());
    }
  });

  // Step 3: Build the new graph, splitting only the selected "most
  // left" node.
  const splitGraph: Join[] = [];

  graph.forEach(({ left, right, type, clause, description }) => {
    const newLeft = splitNodes.has(left) ? `${left}_out` : left;
    const newRight = splitNodes.has(right) ? `${right}_in` : right;

    // Push the modified or original edge.
    splitGraph.push({
      left: newLeft,
      right: newRight,
      type,
      clause: { ...clause },
      description,
    });
  });

  return splitGraph;
}

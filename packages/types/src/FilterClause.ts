/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  FilterNameEnum,
  FilterTypeEnum,
  FilterOperatorEnum,
} from "@hdml/schemas";

/**
 * The `ExpressionParameters` type defines the parameters required
 * for an `Expression` filter, which represents a filter based on a
 * conditional SQL-like expression.
 *
 * ## Properties:
 *
 * - `clause` (string): The SQL-like conditional expression used to
 *   filter the data. This string contains the condition that needs
 *   to be satisfied for the filter to be applied.
 *
 * ## Example:
 *
 * ```ts
 * const expressionFilter: ExpressionParameters = {
 *   clause: "`total_sales` > 1000"
 * };
 * ```
 *
 * In this example, the `clause` specifies a filter condition where
 * the `total_sales` field must be greater than 1000.
 */
export type ExpressionParameters = {
  clause: string;
};

/**
 * The `KeysParameters` type defines the parameters required for a
 * `Keys` filter, which indicates a filter based on key fields from
 * two tables, used in join operations.
 *
 * ## Properties:
 *
 * - `left` (string): The key field from the left table in the join
 *   operation.
 *
 * - `right` (string): The key field from the right table in the join
 *   operation.
 *
 * ## Example:
 *
 * ```ts
 * const keysFilter: KeysParameters = {
 *   left: "customer_id",
 *   right: "client_id"
 * };
 * ```
 *
 * In this example, the `Keys` filter specifies that the `customer_id`
 * field from the left table should match the `client_id` field from
 * the right table in the join operation.
 */
export type KeysParameters = {
  left: string;
  right: string;
};

/**
 * The `NamedParameters` type defines the parameters required for a
 * `Named` filter, which applies a predefined filter by name to a
 * specific field with a set of values.
 *
 * ## Properties:
 *
 * - `name` (FilterNameEnum): The name of the predefined filter to be
 *   applied:
 *   - Equals
 *   - NotEquals
 *   - Contains
 *   - NotContains
 *   - StartsWith
 *   - EndsWith
 *   - Greater
 *   - GreaterEqual
 *   - Less
 *   - LessEqual
 *   - IsNull
 *   - IsNotNull
 *   - Between
 *
 * - `field` (string): The field to which the named filter will be
 *   applied.
 *
 * - `values` (string[]): An array of values to be used in the filter
 *   for the specified field.
 *
 * ## Example:
 *
 * ```ts
 * const namedFilter: NamedParameters = {
 *   name: FilterNameEnum.Equals,
 *   field: "country",
 *   values: ["USA", "Canada"]
 * };
 * ```
 *
 * In this example, the `Named` filter applies an `Equals` to the
 * `country` field, filtering for the values `"USA"` and `"Canada"`.
 */
export type NamedParameters = {
  name: FilterNameEnum;
  field: string;
  values: string[];
};

/**
 * The `Filter` type defines a filter, which can be of various types
 * including `Expression`, `Keys`, or `Named`. Each filter type has
 * its own set of parameters used for data filtering.
 *
 * ## Variants:
 *
 * - `type: FilterTypeEnum.Expression`: Represents a filter based on a
 *   conditional SQL-like expression.
 *   - `options`: Parameters for the expression filter, described by
 *     the `ExpressionParameters` type.
 *
 * - `type: FilterTypeEnum.Keys`: Indicates a filter based on key
 *   fields between two tables, used in joins.
 *   - `options`: Parameters for the keys filter, described by the
 *     `KeysParameters` type.
 *
 * - `type: FilterTypeEnum.Named`: Applies a predefined named filter
 *   to a specific field and set of values.
 *   - `options`: Parameters for the named filter, described by the
 *     `NamedParameters` type.
 *
 * ## Example:
 *
 * ```ts
 * const filter: Filter = {
 *   type: FilterTypeEnum.Expression,
 *   options: { clause: "`age` > 30" }
 * };
 * ```
 *
 * In this example, an `Expression` filter is applied, using the
 * clause ```"`age` > 30"``` to filter data.
 */
export type Filter =
  | {
      type: FilterTypeEnum.Expression;
      options: ExpressionParameters;
    }
  | {
      type: FilterTypeEnum.Keys;
      options: KeysParameters;
    }
  | {
      type: FilterTypeEnum.Named;
      options: NamedParameters;
    };

/**
 * The `FilterClause` interface describes a combination of filters
 * that can be joined together using logical operators. It supports
 * the creation of complex filtering logic through the use of nested
 * filter clauses.
 *
 * ## Properties:
 *
 * - `type` (FilterOperatorEnum): Specifies the logical operator used
 *   to combine the filters. The `FilterOperatorEnum` enum includes
 *   values such as `And`, `Or`, and `None`.
 *
 * - `filters` (Filter[]): An array of filters that are applied in
 *   this clause. Each filter can be of type `Expression`, `Keys`, or
 *   `Named`, with respective parameters.
 *
 * - `children` (FilterClause[]): An array of nested `FilterClause`
 *   objects, allowing for the construction of hierarchical filter
 *   logic. Each child clause can apply additional logical operations
 *   and filters.
 *
 * ## Example:
 *
 * ```ts
 * const filterClause: FilterClause = {
 *   type: FilterOperatorEnum.And,
 *   filters: [
 *     {
 *       type: FilterTypeEnum.Expression,
 *       options: { clause: "`age` > 30" }
 *     }
 *   ],
 *   children: []
 * };
 * ```
 *
 * In this example, a filter clause is created using the `And`
 * operator with an `Expression` filter that selects entries where
 * `age > 30`.
 */
export interface FilterClause {
  type: FilterOperatorEnum;
  filters: Filter[];
  children: FilterClause[];
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { TableTypeEnum, JoinTypeEnum } from "@hdml/schemas";
import { Field } from "./Field";
import { FilterClause } from "./FilterClause";

/**
 * The `Table` interface represents a table in a data model. It
 * includes information about the table's name, type, data source,
 * and its associated fields. It provides a way to define and organize
 * data tables, whether they are actual tables, views, or materialized
 * views from a database or the result of a SQL query.
 *
 * ## Properties:
 *
 * - `name` (string): The name of the table. This is used to identify
 *   the table within the data model.
 *
 * - `type` (TableTypeEnum): The type of the table. The type of the
 *   table, either `Table` for an actual database table, view, or
 *   materialized view, or `Query` for a table generated from a SQL
 *   query.
 *
 * - `identifier` (string): The unique identifier for the table, which
 *   should include either the full three-tier table name for database
 *   tables, views, or materialized views, enclosed in back quotes for
 *   `Table` type, or SQL query for `Query` type.
 *
 * - `fields` (Field[]): An array of fields that belong to the table.
 *   Each field contains detailed information about a column in the
 *   table, including its name, type, and other attributes.
 *
 * ## Example:
 *
 * ```ts
 * const table: Table = {
 *   name: "sales",
 *   type: TableTypeEnum.Table,
 *   identifier: "`conn`.`db`.`sales_data_source`",
 *   fields: [
 *     {
 *       name: "total_sales",
 *       description: "Total sales amount for the period",
 *       origin: "sales_data",
 *       type: {
 *         type: DataType.Float64,
 *         options: {
 *           nullable: false
 *         }
 *       },
 *       aggregation: AggregationType.Sum,
 *       order: OrderType.Descending
 *     }
 *   ]
 * };
 * ```
 *
 * In this example, `table` defines a sales table with its name,
 * type, identifier, and an array of fields containing information
 * about the total sales field.
 */
export interface Table {
  name: string;
  description: null | string;
  type: TableTypeEnum;
  identifier: string;
  fields: Field[];
}

/**
 * The `Join` interface represents a join operation between two data
 * sets. It defines the type of join, the left and right data sets
 * involved, and the filtering conditions applied to the join.
 *
 * ## Properties:
 *
 * - `type` (JoinTypeEnum): Specifies the type of join operation
 *   represented by the `JoinTypeEnum` enum:
 *   - Cross
 *   - Inner
 *   - Full
 *   - Left
 *   - Right
 *   - FullOuter
 *   - LeftOuter
 *   - RightOuter
 *
 * - `left` (string): The name of the left-side data set in the join.
 *
 * - `right` (string): The name of the right-side data set.
 *
 * - `clause` (FilterClause): A `FilterClause` object that defines the
 *   filtering conditions (e.g., keys or expressions) used to match
 *   records between the left and right data sets.
 *
 * ## Example:
 *
 * ```ts
 * const join: Join = {
 *   type: JoinTypeEnum.Inner,
 *   left: "orders",
 *   right: "customers",
 *   clause: {
 *     type: FilterOperator.And,
 *     filters: [
 *       {
 *         type: FilterType.Keys,
 *         options: { left: "order_id", right: "id" }
 *       }
 *     ],
 *     children: []
 *   }
 * };
 * ```
 *
 * In this example, an inner join is performed between the `orders`
 * and `customers` data sets, using a key-based filter on `order_id`
 * and `id`.
 */
export interface Join {
  type: JoinTypeEnum;
  left: string;
  right: string;
  clause: FilterClause;
  description: null | string;
}

/**
 * The `Model` interface represents a data model that includes a set
 * of tables and joins between them. It defines the structure of
 * related tables and how they are connected.
 *
 * ## Properties:
 *
 * - `name` (string): The name of the model, representing the
 *   collection of tables and their relationships.
 *
 * - `tables` (Table[]): An array of `Table` objects representing the
 *   tables included in the model.
 *
 * - `joins` (Join[]): An array of `Join` objects defining the
 *   relationships between the tables based on specific conditions.
 *
 * ## Example:
 *
 * ```ts
 * const model: Model = {
 *   name: "sales_model",
 *   tables: [
 *     {
 *       name: "orders",
 *       type: TableTypeEnum.Table,
 *       identifier: "`conn`.`db`.`orders`",
 *       fields: []
 *     },
 *     {
 *       name: "customers",
 *       type: TableTypeEnum.Table,
 *       identifier: "`conn`.`db`.`customers`",
 *       fields: []
 *     }
 *   ],
 *   joins: [
 *     {
 *       type: JoinTypeEnum.Inner,
 *       left: "orders",
 *       right: "customers",
 *       clause: {
 *         type: FilterOperator.And,
 *         filters: [
 *           {
 *             type: FilterType.Keys,
 *             options: { left: "customer_id", right: "id" }
 *           }
 *         ],
 *         children: []
 *       }
 *     }
 *   ]
 * };
 * ```
 *
 * In this example, the `Model` contains two tables (`orders` and
 * `customers`) with an inner join between them.
 */
export interface Model {
  name: string;
  description: null | string;
  tables: Table[];
  joins: Join[];
}

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Field } from "./Field";
import { FilterClause } from "./FilterClause";

/**
 * The `Frame` interface represents a query structure that is defined
 * over a `Model` or another `Frame`. It allows specifying fields,
 * filtering, grouping, and sorting conditions for data retrieval.
 *
 * ## Properties:
 *
 * - `name` (string): The name of the frame, representing the query.
 *
 * - `source` (string): The name of the `Model` or `Frame` from which
 *   data is queried.
 *
 * - `offset` (number): The starting point of the data to be
 *    retrieved.
 *
 * - `limit` (number): The maximum number of records to be returned.
 *
 * - `fields` (Field[]): An array of `Field` objects specifying the
 *   fields to be retrieved in the query.
 *
 * - `filter_by` (FilterClause): A `FilterClause` used to apply
 *   conditions for filtering the data.
 *
 * - `group_by` (Field[]): An array of `Field` objects representing
 *   the fields by which the data is grouped.
 *
 * - `split_by` (Field[]): An array of `Field` objects used to split
 *   the data into distinct segments.
 *
 * - `sort_by` (Field[]): An array of `Field` objects that determine
 *   the order in which the data is sorted.
 *
 * ## Example:
 *
 * ```ts
 * const frame: Frame = {
 *   name: "sales_frame",
 *   source: "sales_model",
 *   offset: 0,
 *   limit: 100,
 *   fields: [],
 *   filter_by: {
 *     type: FilterOperator.And,
 *     filters: [],
 *     children: []
 *   },
 *   group_by: [],
 *   split_by: [],
 *   sort_by: []
 * };
 * ```
 *
 * In this example, the frame queries data from the `sales_model` with
 * specified limits, filters, and grouping options.
 */
export interface Frame {
  name: string;
  description: null | string;
  source: string;
  offset: number;
  limit: number;
  fields: Field[];
  filter_by: FilterClause;
  group_by: Field[];
  split_by: Field[];
  sort_by: Field[];
}

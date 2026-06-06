/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Connection,
  Frame,
  Model,
  Table,
  Field,
  Join,
  FilterClause,
  Filter,
} from "@hdml/types";

export type HDDMData =
  | Connection
  | Frame
  | Model
  | Table
  | Field
  | Join
  | FilterClause
  | Filter;

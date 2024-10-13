/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  Include,
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
  | Include
  | Connection
  | Frame
  | Model
  | Table
  | Field
  | Join
  | FilterClause
  | Filter;

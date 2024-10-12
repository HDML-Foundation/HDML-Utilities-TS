/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import {
  IInclude,
  IConnection,
  IFrame,
  IModel,
  ITable,
  IField,
  IJoin,
  IFilterClause,
  IFilter,
} from "@hdml/schemas";

export type HDDMData =
  | IInclude
  | IConnection
  | IFrame
  | IModel
  | ITable
  | IField
  | IJoin
  | IFilterClause
  | IFilter;

/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Connection } from "./Connection";
import { Model } from "./Model";
import { Frame } from "./Frame";

/**
 * The `HDOM` interface represents the structure of an HDML document.
 * It provides a hierarchical representation, allowing for the
 * traversal of elements, attributes, and relationships within the
 * document.
 *
 * ## Properties:
 *
 * - `connections` (Connection[]): An array of `Connection` objects
 *   defining database connections and their parameters.
 *
 * - `models` (Model[]): An array of `Model` objects representing the
 *   data models, including tables and their relationships.
 *
 * - `frames` (Frame[]): An array of `Frame` objects defining queries
 *   over models or other frames with specific fields, filters, and
 *   sorting options.
 *
 * ## Example:
 *
 * ```ts
 * const hdom: HDOM = {
 *   connections: [],
 *   models: [],
 *   frames: []
 * };
 * ```
 *
 * In this example, the `HDOM` interface contains empty arrays for
 * connections, models, and frames, representing a basic HDML
 * document structure.
 */
export interface HDOM {
  connections: Connection[];
  models: Model[];
  frames: Frame[];
}

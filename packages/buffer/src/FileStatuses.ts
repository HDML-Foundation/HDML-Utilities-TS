/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Parallel arrays of file names, status strings, and message
 * strings. Used for serializing/deserializing
 * `DocumentFileStatusesStruct`.
 */
export interface FileStatuses {
  names: string[];
  statuses: string[];
  messages: string[];
}

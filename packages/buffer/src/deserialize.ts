/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { HDOM } from "@hdml/types";
import { structurize } from "./structurize";
import { objectifyHDOM } from "./objectify/objectifyHDOM";

/**
 * Deserializes a FlatBuffers binary format into an `HDOM` object.
 *
 * This function takes a `Uint8Array` of FlatBuffers binary data and
 * converts it back into an `HDOM` object. It uses the `structurize`
 * function to convert the binary data into a FlatBuffers struct, and
 * then uses `objectifyHDOM` to convert the struct into a TypeScript
 * `HDOM` object.
 *
 * @param bytes A `Uint8Array` containing the binary FlatBuffers data
 * to be deserialized. This should be a binary representation of an
 * `HDOMStruct` that was previously serialized using the `serialize`
 * function.
 *
 * @returns The deserialized `HDOM` object, which represents the
 * hierarchical structure of an HDML document.
 *
 * @example
 * ```ts
 * const uint8: Uint8Array = ...;  // Your binary FlatBuffers data
 * const hdom = deserialize(uint8);
 * // Now you can work with the `HDOM` object
 * ```
 */
export function deserialize(bytes: Uint8Array): HDOM {
  const hdomStruct = structurize(bytes);
  return objectifyHDOM(hdomStruct);
}

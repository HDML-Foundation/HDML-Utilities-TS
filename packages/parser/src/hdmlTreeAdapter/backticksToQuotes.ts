/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Normalizes the identifier quoting of a raw HDML attribute value.
 *
 * Authors quote SQL identifiers in `identifier` / `clause` attributes
 * with backticks so the value sits inside a double-quoted HTML
 * attribute cleanly (a literal double quote would close it early).
 * The canonical FlatBuffers form — and the SQL the stringifier
 * emits — uses standard double quotes, so the parser decodes the
 * backtick display form here. It is the inverse of the double-quote
 * -> backtick swap the stringifier applies when reconstructing HTML.
 *
 * @param value The raw attribute value as authored in the markup.
 *
 * @returns The value with backtick identifier quotes rewritten as
 * double quotes.
 */
export function backticksToQuotes(value: string): string {
  return value.replaceAll("`", '"');
}

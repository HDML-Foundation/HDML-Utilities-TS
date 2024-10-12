/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * The `Include` interface represents a reference to an external
 * HDML document that needs to be included in the current
 * document. It allows for specifying the path to a remote or
 * distributed document that can be merged into the current HDML
 * structure, facilitating the concept of modular and distributed
 * document composition.
 *
 * ## Properties:
 *
 * - `path` (string): Specifies the absolute path to the external
 *   document. The path points to the location where the external HDML
 *   document can be fetched and included. This document will be
 *   processed and merged with the current document by the HDIO
 *   server.
 *
 * ## Use case:
 *
 * Secure inclusion of remote documents with sensitive database
 * connection details.
 *
 * The `Include` interface can be used to reference external
 * HDML documents containing sensitive data, such as database
 * credentials. These documents are securely fetched and merged
 * server-side by the HDIO server using the `<hdml-include>`
 * component. This ensures that sensitive information, like
 * connection details, is never exposed to the client or network.
 *
 * Example:
 *
 * ```ts
 * const includeDoc: Include = {
 *   path: "/secure/db-connection.hdml"
 * };
 * ```
 */

export interface Include {
  path: string;
}

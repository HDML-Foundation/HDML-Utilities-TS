/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/**
 * Enumeration of FlatBuffers struct types that can be structurized
 * from binary data.
 */
export enum StructType {
  HDOMStruct = 1,
  ConnectionStruct = 2,
  ModelStruct = 3,
  FrameStruct = 4,
  FileStatusesStruct = 5,
}

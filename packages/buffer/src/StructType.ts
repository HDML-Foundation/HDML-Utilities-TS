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
  HDOMStruct = "HDOMStruct",
  ConnectionStruct = "ConnectionStruct",
  ModelStruct = "ModelStruct",
  FrameStruct = "FrameStruct",
}

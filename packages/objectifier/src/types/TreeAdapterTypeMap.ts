/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export interface TreeAdapterTypeMap<
  Node = unknown,
  ParentNode = unknown,
  ChildNode = unknown,
  Document = unknown,
  DocumentFragment = unknown,
  Element = unknown,
  CommentNode = unknown,
  TextNode = unknown,
  Template = unknown,
  DocumentType = unknown,
> {
  node: Node;
  parentNode: ParentNode;
  childNode: ChildNode;
  document: Document;
  documentFragment: DocumentFragment;
  element: Element;
  commentNode: CommentNode;
  textNode: TextNode;
  template: Template;
  documentType: DocumentType;
}

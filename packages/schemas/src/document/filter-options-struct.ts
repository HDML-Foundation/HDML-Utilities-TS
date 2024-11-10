// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import { ExpressionParametersStruct } from '../document/expression-parameters-struct.js';
import { KeysParametersStruct } from '../document/keys-parameters-struct.js';
import { NamedParametersStruct } from '../document/named-parameters-struct.js';


/**
 * Filter options.
 */
export enum FilterOptionsStruct {
  NONE = 0,
  ExpressionParametersStruct = 1,
  KeysParametersStruct = 2,
  NamedParametersStruct = 3
}

export function unionToFilterOptionsStruct(
  type: FilterOptionsStruct,
  accessor: (obj:ExpressionParametersStruct|KeysParametersStruct|NamedParametersStruct) => ExpressionParametersStruct|KeysParametersStruct|NamedParametersStruct|null
): ExpressionParametersStruct|KeysParametersStruct|NamedParametersStruct|null {
  switch(FilterOptionsStruct[type]) {
    case 'NONE': return null; 
    case 'ExpressionParametersStruct': return accessor(new ExpressionParametersStruct())! as ExpressionParametersStruct;
    case 'KeysParametersStruct': return accessor(new KeysParametersStruct())! as KeysParametersStruct;
    case 'NamedParametersStruct': return accessor(new NamedParametersStruct())! as NamedParametersStruct;
    default: return null;
  }
}

export function unionListToFilterOptionsStruct(
  type: FilterOptionsStruct, 
  accessor: (index: number, obj:ExpressionParametersStruct|KeysParametersStruct|NamedParametersStruct) => ExpressionParametersStruct|KeysParametersStruct|NamedParametersStruct|null, 
  index: number
): ExpressionParametersStruct|KeysParametersStruct|NamedParametersStruct|null {
  switch(FilterOptionsStruct[type]) {
    case 'NONE': return null; 
    case 'ExpressionParametersStruct': return accessor(index, new ExpressionParametersStruct())! as ExpressionParametersStruct;
    case 'KeysParametersStruct': return accessor(index, new KeysParametersStruct())! as KeysParametersStruct;
    case 'NamedParametersStruct': return accessor(index, new NamedParametersStruct())! as NamedParametersStruct;
    default: return null;
  }
}

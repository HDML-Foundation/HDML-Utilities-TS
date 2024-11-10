// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

/**
 * Parameters to connect to the MongoDB.
 */
export class MongoDBParametersStruct {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):MongoDBParametersStruct {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsMongoDBParametersStruct(bb:flatbuffers.ByteBuffer, obj?:MongoDBParametersStruct):MongoDBParametersStruct {
  return (obj || new MongoDBParametersStruct()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsMongoDBParametersStruct(bb:flatbuffers.ByteBuffer, obj?:MongoDBParametersStruct):MongoDBParametersStruct {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new MongoDBParametersStruct()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

host():string|null
host(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
host(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

port():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.readUint16(this.bb_pos + offset) : 0;
}

user():string|null
user(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
user(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

password():string|null
password(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
password(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

schema():string|null
schema(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
schema(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

ssl():boolean {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false;
}

static startMongoDBParametersStruct(builder:flatbuffers.Builder) {
  builder.startObject(6);
}

static addHost(builder:flatbuffers.Builder, hostOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, hostOffset, 0);
}

static addPort(builder:flatbuffers.Builder, port:number) {
  builder.addFieldInt16(1, port, 0);
}

static addUser(builder:flatbuffers.Builder, userOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, userOffset, 0);
}

static addPassword(builder:flatbuffers.Builder, passwordOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, passwordOffset, 0);
}

static addSchema(builder:flatbuffers.Builder, schemaOffset:flatbuffers.Offset) {
  builder.addFieldOffset(4, schemaOffset, 0);
}

static addSsl(builder:flatbuffers.Builder, ssl:boolean) {
  builder.addFieldInt8(5, +ssl, +false);
}

static endMongoDBParametersStruct(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createMongoDBParametersStruct(builder:flatbuffers.Builder, hostOffset:flatbuffers.Offset, port:number, userOffset:flatbuffers.Offset, passwordOffset:flatbuffers.Offset, schemaOffset:flatbuffers.Offset, ssl:boolean):flatbuffers.Offset {
  MongoDBParametersStruct.startMongoDBParametersStruct(builder);
  MongoDBParametersStruct.addHost(builder, hostOffset);
  MongoDBParametersStruct.addPort(builder, port);
  MongoDBParametersStruct.addUser(builder, userOffset);
  MongoDBParametersStruct.addPassword(builder, passwordOffset);
  MongoDBParametersStruct.addSchema(builder, schemaOffset);
  MongoDBParametersStruct.addSsl(builder, ssl);
  return MongoDBParametersStruct.endMongoDBParametersStruct(builder);
}
}

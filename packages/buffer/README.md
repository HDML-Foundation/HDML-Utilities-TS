# @hdml/buffer

This module is part of the **HDML-Utilities** monorepo and provides a set of utility functions to serialize and deserialize key components of the **HDML** (HyperData Markup Language) document model into and from FlatBuffers binary format. It enables efficient data transmission and storage of complex hierarchical structures such as fields, models, filter clauses, frames, connections, and full HDML documents.

## Features

This package provides the following main functions:

1. **serialize**: Serializes an `HDOM` object into a FlatBuffers binary format.
2. **deserialize**: Deserializes a FlatBuffers binary format back into an `HDOM` object.
3. **structurize**: Structurizes a FlatBuffers binary into a FlatBuffers struct object. Supports multiple struct types via optional `StructType` parameter (defaults to `HDOMStruct`).
4. **fileifize**: Converts a complete HDOM buffer into separate file buffers for connections, models, and frames.

Additionally, the package provides lower-level conversion functions organized into two directories:

- **bufferify/**: Functions that convert TypeScript objects from `@hdml/types` to FlatBuffers structs:
  - `bufferifyHDOM`: Converts `HDOM` to `HDOMStruct`
  - `bufferifyConnection`: Converts `Connection` to `ConnectionStruct`
  - `bufferifyModel`: Converts `Model` to `ModelStruct`
  - `bufferifyFrame`: Converts `Frame` to `FrameStruct`
  - `bufferifyField`: Converts `Field` to `FieldStruct`
  - `bufferifyFilterClause`: Converts `FilterClause` to `FilterClauseStruct`

- **objectify/**: Functions that convert FlatBuffers structs back to TypeScript objects:
  - `objectifyHDOM`: Converts `HDOMStruct` to `HDOM`
  - `objectifyConnection`: Converts `ConnectionStruct` to `Connection`
  - `objectifyModel`: Converts `ModelStruct` to `Model`
  - `objectifyFrame`: Converts `FrameStruct` to `Frame`
  - `objectifyField`: Converts `FieldStruct` to `Field`
  - `objectifyFilterClause`: Converts `FilterClauseStruct` to `FilterClause`

Additionally, the package exports:
- **StructType**: Enum with values `HDOMStruct`, `ConnectionStruct`, `ModelStruct`, `FrameStruct` for specifying which struct type to structurize.

## Dependencies

This module depends on the `@hdml/schemas` package, which distributes FlatBuffers schema-based classes for serialization, and `@hdml/types` package that distributes TypeScript interface definitions for HDML components.

## Installation

To install this module, simply add it to your project:

```bash
npm install @hdml/buffer
```

## Usage

### Basic Serialization and Deserialization

Here's a basic example of how to use the serialize and deserialize functions:

```typescript
import { HDOM } from "@hdml/types";
import { serialize, deserialize } from "@hdml/buffer";

const hdom: HDOM = { ... };  // Your HyperData Document

// Serialize to binary format
const bytes = serialize(hdom);
// Transmit or store the binary.

// Deserialize back to HDOM object
const deserialized = deserialize(bytes);
// deserialized is now equal to the original hdom
```

### Working with FlatBuffers Structs

If you need to work directly with FlatBuffers structs:

```typescript
import { HDOM } from "@hdml/types";
import { serialize, structurize, StructType, objectifyHDOM } from "@hdml/buffer";
import { HDOMStruct, ConnectionStruct, ModelStruct, FrameStruct } from "@hdml/schemas";

const hdom: HDOM = { ... };

// Serialize to binary
const bytes = serialize(hdom);

// Convert to HDOM FlatBuffers struct (default)
const hdomStruct = structurize(bytes, StructType.HDOMStruct) as HDOMStruct;
// Or simply: structurize(bytes) - defaults to HDOMStruct

// Convert to other struct types (when working with individual buffers)
const connBytes: Uint8Array = ...; // Individual connection buffer
const connStruct = structurize(connBytes, StructType.ConnectionStruct) as ConnectionStruct;

const modelBytes: Uint8Array = ...; // Individual model buffer
const modelStruct = structurize(modelBytes, StructType.ModelStruct) as ModelStruct;

const frameBytes: Uint8Array = ...; // Individual frame buffer
const frameStruct = structurize(frameBytes, StructType.FrameStruct) as FrameStruct;

// Convert back to HDOM object
const hdomFromStruct = objectifyHDOM(hdomStruct);
```

### Round-Trip Validation

The package ensures that serialization and deserialization are perfect inverses:

```typescript
import { HDOM } from "@hdml/types";
import { serialize, deserialize } from "@hdml/buffer";

const original: HDOM = { ... };
const bytes = serialize(original);
const restored = deserialize(bytes);

// restored is deeply equal to original
console.assert(JSON.stringify(restored) === JSON.stringify(original));
```

### Splitting HDOM into Individual File Buffers

The `fileifize` function allows you to split a complete HDOM buffer into separate buffers for each connection, model, and frame:

```typescript
import { serialize, fileifize } from "@hdml/buffer";

const hdom: HDOM = { ... };
const hdomBuffer = serialize(hdom);

// Split into individual file buffers
const result = fileifize(hdomBuffer);

// result.connections: Array<{ name: string; buffer: Uint8Array }>
// result.models: Array<{ name: string; buffer: Uint8Array }>
// result.frames: Array<{ name: string; buffer: Uint8Array }>

// Each buffer can be stored or transmitted independently
result.connections.forEach((conn) => {
  // Store conn.buffer as a file named conn.name
});
```

## License

Apache License Version 2.0

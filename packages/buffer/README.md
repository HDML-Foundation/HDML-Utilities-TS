# @hdml/buffer

This module is part of the **HDML-Utilities** monorepo and provides a set of utility functions to serialize and deserialize key components of the **HDML** (HyperData Markup Language) document model into and from FlatBuffers binary format. It enables efficient data transmission and storage of complex hierarchical structures such as fields, models, filter clauses, frames, connections, and full HDML documents.

## Features

This package provides the following main functions:

1. **serialize**: Serializes an `HDOM` object into a FlatBuffers binary format.
2. **deserialize**: Deserializes a FlatBuffers binary format back into an `HDOM` object.
3. **structurize**: Structurizes a FlatBuffers binary into an `HDOMStruct` object.

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
import { serialize, structurize, objectifyHDOM } from "@hdml/buffer";

const hdom: HDOM = { ... };

// Serialize to binary
const bytes = serialize(hdom);

// Convert to FlatBuffers struct
const struct = structurize(bytes);
// Interact with the FlatBuffers struct directly.

// Convert back to HDOM object
const hdomFromStruct = objectifyHDOM(struct);
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

## License

Apache License Version 2.0

# @hdml/buffer

This module is part of the **HDML-Utilities** monorepo and provides a set of utility functions to serialize key components of the **HDML** (HyperData Markup Language) document model into FlatBuffers binary format. It enables efficient data transmission and storage of complex hierarchical structures such as fields, models, filter clauses, frames, connections, and full HDML documents.

## Features

This package provides the following `buffer` functions:

1. **serialize**: Serializes the entire HDML document (HDDM), including includes, connections, models, and frames.
2. **structurize**: Structurizes a FlatBuffers binary into an `HDOMStruct` object.

## Dependencies

This module depends on the `@hdml/schemas` package, which distributes FlatBuffers schema-based classes for serialization, and `@hdml/types` package that distributes TypeScript interface definitions for HDML components.

## Installation

To install this module, simply add it to your project:

```bash
npm install @hdml/buffer
```

## Usage

Here’s a basic example of how to use the bufferify functions in your project:

```typescript
import { HDOM } from "@hdml/types";
import { serialize, structurize } from "@hdml/buffer";

const hdom: HDOM = { ... };  // Your HyperData Document

const bytes = serialize(hdom);
// Transmit or store the binary.

const struct = structurize(bytes);
// Interact with the FlatBuffers struct.
```

## License

Apache License Version 2.0
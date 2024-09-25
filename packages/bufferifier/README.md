# @hdml/bufferifier

This module is part of the **HDML-Utilities** monorepo and provides a set of utility functions to serialize key components of the **HDML** (HyperData Markup Language) document model into FlatBuffers binary format. It enables efficient data transmission and storage of complex hierarchical structures such as fields, models, filter clauses, frames, connections, and full HDML documents.

## Exports

This package provides the following `bufferify` functions:

1. **bufferifyField**: Serializes an `IField` object to its FlatBuffers binary representation.
2. **bufferifyModel**: Serializes an `IModel` object to FlatBuffers, supporting the hierarchical structure of HDML models.
3. **bufferifyFilterClause**: Converts an `IFilterClause` (SQL-like conditional expressions) into FlatBuffers format.
4. **bufferifyFrame**: Converts an `IFrame` object, which defines a query over an `IModel` or another `IFrame`.
5. **bufferifyConnection**: Serializes various database connection parameters (JDBC, BigQuery, Google Sheets, etc.) into FlatBuffers.
6. **bufferifyHDDM**: Serializes the entire HDML document (HDDM), including includes, connections, models, and frames.

## Dependencies

This module depends on the `@hdml/schemas` package, which distributes:

* TypeScript interface definitions for HDML components
* FlatBuffers schema-based classes for serialization

## Installation

To install this module, simply add it to your project:

```bash
npm install @hdml/bufferifier
```

## Usage

Here’s a basic example of how to use the bufferify functions in your project:

```typescript
import { Builder } from "flatbuffers";
import { IHDDM } from "@hdml/schemas";
import { bufferifyHDDM } from "@hdml/bufferifier";

const builder = new Builder(1024);
const hddm: IHDDM = { ... };  // Your HyperData Document Model object
const offset = bufferifyHDDM(builder, hddm);
builder.finish(offset);
const buffer = builder.asUint8Array();

// Transmit or store the binary buffer
```

## License

Apache License Version 2.0
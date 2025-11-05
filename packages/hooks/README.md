# @hdml/hooks

This module is part of the **HDML-Utilities** monorepo and provides a set of I/O utility functions for reading from stdin and writing to stdout. It's designed to work in environments like WebAssembly (Javy) where standard I/O operations require special handling.

## Features

This package provides the following I/O utility functions:

### Reading Functions

1. **readUint8Array**: Reads raw bytes from stdin and returns them as a `Uint8Array`.
2. **readString**: Reads a string from stdin by decoding the input bytes using UTF-8 encoding.
3. **readJson**: Reads and parses a JSON object from stdin.

### Writing Functions

1. **writeUint8Array**: Writes a `Uint8Array` to stdout and returns the number of bytes written.
2. **writeString**: Writes a string to stdout by encoding it as UTF-8 and returns the number of bytes written.
3. **writeJson**: Serializes a JSON object to a string and writes it to stdout, returning the number of bytes written.

## Dependencies

This module depends on:
- `@hdml/parser`: For parsing HDML documents
- `@hdml/schemas`: FlatBuffers schema-based classes for serialization
- `@hdml/types`: TypeScript interface definitions for HDML components

## Installation

To install this module, simply add it to your project:

```bash
npm install @hdml/hooks
```

## Usage

### Reading from stdin

```typescript
import { readString, readJson, readUint8Array } from "@hdml/hooks";

// Read a string from stdin
const text = readString();
console.log(text);

// Read and parse JSON from stdin
const data = readJson<{ name: string; age: number }>();
console.log(data.name, data.age);

// Read raw bytes from stdin
const bytes = readUint8Array();
console.log(bytes.length);
```

### Writing to stdout

```typescript
import { writeString, writeJson, writeUint8Array } from "@hdml/hooks";

// Write a string to stdout
const bytesWritten = writeString("Hello, world!");
console.log(`Wrote ${bytesWritten} bytes`);

// Write a JSON object to stdout
const bytesWritten = writeJson({ name: "John", age: 30 });
console.log(`Wrote ${bytesWritten} bytes`);

// Write raw bytes to stdout
const bytesWritten = writeUint8Array(new Uint8Array([1, 2, 3]));
console.log(`Wrote ${bytesWritten} bytes`);
```

### Complete Example

```typescript
import { readJson, writeJson } from "@hdml/hooks";

// Read JSON input from stdin
const input = readJson<{ message: string }>();

// Process the data
const output = {
  response: `Received: ${input.message}`,
  timestamp: Date.now(),
};

// Write JSON output to stdout
writeJson(output);
```

## Notes

- The functions use `Javy.IO.readSync` and `Javy.IO.writeSync` internally, making them suitable for WebAssembly environments like Javy.
- `readUint8Array` reads input in 1024-byte chunks and assembles them into a single array.
- All string operations use UTF-8 encoding/decoding.
- JSON operations use `JSON.parse` and `JSON.stringify` for parsing and serialization.

## License

Apache License Version 2.0

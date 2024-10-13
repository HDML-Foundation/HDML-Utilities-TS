# @hdml/parser

This module is part of the **HDML-Utilities** monorepo and provides a set of utility functions to parse **HTML** and **HDML** (HyperData Markup Language) documents into **DOM** and **HDOM** (HyperData Object Model) objects. It enables further manipulation and traversal of the document's structure.

## Features

This package provides the following `parser` functions:

1. **parseHTML**: Parse an HTML string, and return the root of the generated DOM object.
2. **parseHDML**: Parses an HDML string and converts it into an HDOM object.

## Dependencies

This module depends on the `@hdml/schemas` package, which distributes FlatBuffers schema-based classes for serialization, and `@hdml/types` package that distributes TypeScript interface definitions for HDML components.

## Installation

To install this module, simply add it to your project:

```bash
npm install @hdml/parser
```

## Usage

Here’s a basic example of how to use the parser functions in your project:

```typescript
import { parseHDML, parseHTML } from "@hdml/parser";

const hdml = "<hdml-model>...</hdml-model>";
const hdom = parseHDML(hdml);
console.log(hdom);

const html = "<html>...</html>";
const dom = parseHTML(html);
console.log(dom);
```

## License

Apache License Version 2.0
# @hdml/stringlifier

The `@hdml/stringlifier` package is part of the **HDML-Utilities** monorepo. It provides a suite of functions to convert HDML data structures into SQL or HTML string representations for further processing, enabling seamless integration of HDML components into web and database workflows.

## Features

This package offers the following stringification functions:

* `getConnectionHTML`: Converts a connection structure into an HTML string.
* `getConnectionSQLs`: Generates SQL statements for a connection.
* `getFrameHTML`: Converts a frame structure into an HTML string.
* `getFrameSQL`: Converts a frame structure into an SQL query string.
* `getModelHTML`: Converts a model structure into an HTML string.
* `getModelSQL`: Converts a model structure into an SQL query string.

These functions operate on data structures parsed using the `@hdml/buffer` package's deserialize function.

## Installation

To install this package, add it to your project:

```bash
npm install @hdml/stringlifier
```

## Usage

Here’s an example of using the `@hdml/stringlifier` functions:

```typescript
import { HDOM } from "@hdml/types";
import { ConnectorTypesEnum } from "@hdml/schemas";
import { serialize, deserialize } from "@hdml/buffer";
import { getConnectionSQLs, getConnectionHTML } from "@hdml/stringlifier";

const hdom: HDOM = {
  includes: [],
  connections: [
    {
      name: "",
      description: null,
      options: {
        connector: ConnectorTypesEnum.Postgres,
        parameters: {
          host: "",
          user: "",
          password: "",
          ssl: false,
        },
      },
    },
  ],
  models: [],
  frames: [],
};
const buf = serialize(hdom);
const struct = deserialize(buf);
const conn = struct.connections(0)!;
const sqls = getConnectionSQLs(conn);
const html = getConnectionHTML(conn);
```

## License

Apache License Version 2.0
# @hdml/hashifier

`@hdml/hashifier` is a lightweight utility library designed for hashing and generating unique identifiers. It provides various functions to handle hashing and timestamp-related operations, making it ideal for applications that require unique and consistent identifiers or time-based hashing. This module is part of the **HDML-Utilities** monorepo, which aims to provide tools for working with hierarchical data structures in web-based environments.

## Features

* **MD5 Hashing**: Compute MD5 hash values for strings.
* **UUID Generation**: Generate session-unique UUID-like strings.
* **Hashify**: Convert content to a unique hash name using a specific charset.
* **Hashed Timestamp**: Generate a consistent hash for a timestamp based on a timestep value.
* **Parse Time Hash**: Retrieve the timestamp from a hashed time string.

## Installation

To install `@hdml/hashifier`, use npm:

```bash
npm install @hdml/hashifier
```

## API

`md5(content: string): string`

Generates an MD5 hash from the provided string.

`uid(): string`

Generates a session-unique UUID-like string.

`hashify(content: string): string`

Converts a string to a unique hash name using a custom charset based on its MD5 value.

`hashtime(timestamp: number, timestep: number = 1): string`

Returns a persistent hash for the provided timestamp rounded by the given timestep (in milliseconds). The hash is represented in base-36 format.

`parsetime(hashtime: string, timestep: number = 1): number`

Converts the base-36 hashtime string back to its original timestamp using the provided timestep.

## License

Apache License Version 2.0

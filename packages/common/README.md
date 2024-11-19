# @hdml/common

The `@hdml/common` package is part of the **HDML-Utilities** monorepo. It serves as a centralized module for re-exporting commonly used third-party libraries, ensuring consistency and simplifying dependency management across HDML-related projects.

## Features

This package re-exports the following libraries:

- **[apache-arrow](https://github.com/apache/arrow)**: A cross-language development platform for in-memory data.
- **[uuid](https://github.com/uuidjs/uuid)**: A library for generating universally unique identifiers (UUIDs).
- **[throttle-debounce](https://github.com/niksy/throttle-debounce)**: A utility library for throttling and debouncing functions.

## Installation

To use `@hdml/common` in your project, install it via npm or yarn:

```bash
npm install @hdml/common
# or
yarn add @hdml/common
```

## Usage

Import the desired functionality directly from @hdml/common:

```typescript
import { uuid, arrow, throdeb } from '@hdml/common';

const { v4 } = uuid;
const { debounce } = throdeb;
const { Table } = arrow;

// Example: Generate a UUID
const id = uuidv4();

// Example: Use Apache Arrow
const table = Table.new(...);

// Example: Use a debounced function
const debouncedFunc = debounce(300, () => console.log('Debounced!'));
debouncedFunc();

```

## License

Apache License Version 2.0
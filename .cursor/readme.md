# HDML-Utilities-TS Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Package Details](#package-details)
4. [Development Guide](#development-guide)
5. [Build System](#build-system)
6. [Code Standards](#code-standards)
7. [Testing](#testing)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## Project Overview

**HDML-Utilities-TS** is a comprehensive TypeScript monorepo that provides utilities for working with **HDML (HyperData Markup Language)** documents. HDML is a specialized markup language designed for modeling complex data relationships in web-based environments, enabling hierarchical data representation with support for:

- Distributed documents
- External document inclusion
- Server-side processing
- Database integration
- Query generation

### Key Features

- **Type-Safe**: Full TypeScript support with strict type checking
- **Efficient Serialization**: FlatBuffers for compact binary format
- **Multiple Formats**: Support for HDML, SQL, HTML, and binary formats
- **Modular**: Independent packages with clear dependencies
- **Well-Tested**: Comprehensive test coverage
- **Documented**: Extensive JSDoc documentation

### Technology Stack

- **Language**: TypeScript 4.9.5
- **Package Manager**: npm with workspaces
- **Build Tool**: TypeScript Compiler + ESBuild
- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **Documentation**: TypeDoc
- **Serialization**: FlatBuffers 24.3.25
- **Parsing**: parse5, node-html-parser

---

## Architecture

### Monorepo Structure

The project is organized as an npm workspace monorepo with the following structure:

```
HDML-Utilities-TS/
├── packages/              # All packages
│   ├── schemas/          # FlatBuffers generated types
│   ├── types/            # TypeScript interfaces
│   ├── parser/           # HDML/HTML parsing
│   ├── stringifier/      # SQL/HTML generation
│   ├── buffer/           # FlatBuffers serialization
│   ├── hash/             # Hashing utilities
│   ├── hooks/            # I/O hooks
│   └── common/           # Shared utilities
├── HDML-Schemas/         # Git submodule (FlatBuffers schemas)
├── tsconfig/             # Shared TypeScript configs
├── scripts/              # Build scripts
└── .github/              # CI/CD workflows
```

### Package Dependency Graph

```
@hdml/common
  └── @hdml/hash

@hdml/schemas (FlatBuffers generated)
  ├── @hdml/types
  │   ├── @hdml/parser
  │   ├── @hdml/buffer
  │   ├── @hdml/stringifier
  │   └── @hdml/hooks
```

### Core Data Flow

1. **Parsing**: HDML string → `parseHDML()` → HDOM interface
2. **Serialization**: HDOM interface → `bufferify*()` → FlatBuffers struct → `serialize()` → Uint8Array
3. **Deserialization**: Uint8Array → `deserialize()` → FlatBuffers struct → TypeScript interface
4. **Stringification**: HDOM/Model/Frame → `get*SQL()` / `get*HTML()` → SQL/HTML string

---

## Package Details

### @hdml/schemas

**Purpose**: TypeScript types generated from FlatBuffers schema definitions.

**Key Features**:
- Auto-generated from `.fbs` files in HDML-Schemas submodule
- Provides low-level FlatBuffers struct types
- Base for all other packages

**Build Process**:
```bash
npm run compile_fbs  # Generates TypeScript from .fbs files
```

**Source**: `HDML-Schemas/src/*.fbs` → `packages/schemas/src/`

**Dependencies**: `flatbuffers`

---

### @hdml/types

**Purpose**: Core TypeScript interfaces for HDML documents and components.

**Key Exports**:
- `HDOM`: Root document structure
- `Connection`: Database connection definitions
- `Model`: Data models with tables and joins
- `Frame`: Query definitions
- `Field`: Column definitions
- `FilterClause`: Filtering conditions
- `Include`: External document references
- Enums: All HDML attribute values and types

**Key Interfaces**:

```typescript
interface HDOM {
  includes: Include[];
  connections: Connection[];
  models: Model[];
  frames: Frame[];
}

interface Connection {
  name: string;
  type: ConnectorTypeEnum;
  // ... connection-specific parameters
}

interface Model {
  name: string;
  tables: Table[];
  joins: Join[];
}

interface Frame {
  name: string;
  model: string;
  fields: Field[];
  filters: FilterClause[];
  // ... sorting and pagination
}
```

**Dependencies**: `@hdml/schemas`, `flatbuffers`

---

### @hdml/parser

**Purpose**: Parse HTML and HDML strings into DOM and HDOM objects.

**Key Functions**:
- `parseHDML(content: string): HDOM` - Parse HDML string to HDOM
- `parseHTML(content: string): HTMLElement` - Parse HTML string to DOM

**Implementation Details**:
- Uses `parse5` for HTML/HDML parsing
- Custom `HDMLTreeAdapter` for HDML-specific elements
- Handles all HDML tag types: `<hdml-model>`, `<hdml-connection>`, `<hdml-frame>`, etc.
- Validates attributes and converts to appropriate types

**Tree Adapter**:
- Located in `src/hdmlTreeAdapter/`
- Maps HDML elements to HDOM structures
- Handles attribute parsing and type conversion

**Dependencies**: `parse5`, `node-html-parser`, `@hdml/types`, `@hdml/schemas`

---

### @hdml/stringifier

**Purpose**: Convert HDML data structures to SQL or HTML string representations.

**Key Functions**:

**Connections**:
- `getConnectionSQLs(connection: ConnectionStruct): string[]` - Generate SQL statements
- `getConnectionHTML(connection: ConnectionStruct): string` - Generate HTML representation

**Models**:
- `getModelSQL(model: ModelStruct, level?: number): string` - Generate SQL query
- `getModelHTML(model: ModelStruct, level?: number): string` - Generate HTML representation

**Frames**:
- `getFrameSQL(frame: FrameStruct, level?: number): string` - Generate SQL query
- `getFrameHTML(frame: FrameStruct, level?: number): string` - Generate HTML representation

**SQL Generation**:
- Generates properly formatted SQL with indentation
- Handles WITH clauses for subqueries
- Generates SELECT, FROM, JOIN clauses
- Supports all join types and filter operations

**Dependencies**: `@hdml/types`, `@hdml/schemas`

---

### @hdml/buffer

**Purpose**: Serialize and deserialize HDML data structures using FlatBuffers.

**Key Functions**:
- `serialize(hdom: HDOMStruct): Uint8Array` - Serialize HDOM to binary
- `deserialize(buffer: Uint8Array): HDOMStruct` - Deserialize binary to HDOM

**Bufferify Functions** (TypeScript → FlatBuffers):
- `bufferifyHDOM(hdom: HDOM): HDOMStruct`
- `bufferifyConnection(connection: Connection): ConnectionStruct`
- `bufferifyModel(model: Model): ModelStruct`
- `bufferifyFrame(frame: Frame): FrameStruct`
- `bufferifyField(field: Field): FieldStruct`
- `bufferifyFilterClause(clause: FilterClause): FilterClauseStruct`

**Usage**:
```typescript
import { serialize, deserialize } from "@hdml/buffer";
import { bufferifyHDOM } from "@hdml/buffer";

const hdom: HDOM = { /* ... */ };
const struct = bufferifyHDOM(hdom);
const binary = serialize(struct);
// ... transmit or store binary
const restored = deserialize(binary);
```

**Dependencies**: `@hdml/types`, `@hdml/schemas`, `flatbuffers`

---

### @hdml/hash

**Purpose**: Utility functions for hashing and generating unique identifiers.

**Key Functions**:
- `md5(input: string): string` - MD5 hash
- `uid(): string` - UUID v4 generation
- `hashtime(time: Date): string` - Time-based hash
- `parsetime(hash: string): Date | null` - Parse time from hash
- `hashify(data: unknown): string` - Hash any data structure

**Dependencies**: `@hdml/common`

---

### @hdml/hooks

**Purpose**: I/O hooks for reading and writing HDML data in various formats.

**Key Functions**:

**Reading**:
- `readJson(path: string): Promise<HDOM>` - Read HDOM from JSON file
- `readString(content: string): HDOM` - Parse HDOM from string
- `readUint8Array(buffer: Uint8Array): HDOMStruct` - Deserialize from binary

**Writing**:
- `writeJson(hdom: HDOM, path: string): Promise<void>` - Write HDOM to JSON
- `writeString(hdom: HDOM): string` - Convert HDOM to string
- `writeUint8Array(struct: HDOMStruct): Uint8Array` - Serialize to binary

**Dependencies**: `@hdml/parser`, `@hdml/types`, `@hdml/schemas`

---

### @hdml/common

**Purpose**: Shared utilities used across multiple packages.

**Key Dependencies**:
- `apache-arrow`: Columnar data format
- `uuid`: UUID generation
- `throttle-debounce`: Function throttling/debouncing

**Usage**: Internal package, not typically imported directly by end users.

---

## Development Guide

### Prerequisites

- Node.js (version compatible with TypeScript 4.9.5)
- npm
- Git
- FlatBuffers compiler (`flatc`) - usually installed via npm

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone git@github.com:HDML-Foundation/HDML-Utilities-TS.git
   cd HDML-Utilities-TS
   ```

2. **Initialize git submodules**:
   ```bash
   git submodule update --init --recursive
   ```
   This initializes the `HDML-Schemas` submodule containing FlatBuffers schema definitions.

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Build schemas** (if needed):
   ```bash
   cd packages/schemas
   npm run compile_fbs
   cd ../..
   ```

### Development Workflow

1. **Make changes** to source files in `packages/{package}/src/`

2. **Run linter**:
   ```bash
   npm run lint
   ```

3. **Run tests**:
   ```bash
   npm run test
   ```

4. **Build package**:
   ```bash
   cd packages/{package}
   npm run build
   ```

5. **Test in browser** (if package supports it):
   ```bash
   npm run srv
   ```

### Package Development

Each package follows a consistent structure:

```
packages/{package}/
├── src/
│   ├── index.ts              # Main exports
│   ├── {feature}.ts          # Feature implementation
│   ├── {feature}.test.ts     # Tests
│   └── types/                # Type definitions (if needed)
├── tsconfig/
│   ├── cjs.json              # CommonJS config
│   ├── esm.json              # ES Module config
│   ├── dts.json              # Declaration files config
│   └── tst.json              # Test compilation config
├── package.json
└── README.md
```

### Adding a New Package

1. Create directory: `packages/{package-name}/`
2. Add to root `package.json` workspaces array
3. Create `package.json` with:
   - Package name: `@hdml/{package-name}`
   - Version: Match other packages
   - Dependencies: List required @hdml packages
   - Scripts: Copy from existing package
4. Create `tsconfig/` directory with config files (copy from existing package)
5. Create `src/` directory with `index.ts`
6. Follow existing package patterns

---

## Build System

### TypeScript Configurations

The project uses multiple TypeScript configurations for different output formats:

- **base.json**: Base configuration shared by all packages
- **cjs.json**: CommonJS output for Node.js
- **esm.json**: ES Module output for modern environments
- **dts.json**: TypeScript declaration files
- **tst.json**: Test file compilation

### Build Scripts

**Root Level**:
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run test` - Test all packages
- `npm run clear` - Clear all build outputs

**Package Level**:
- `npm run clear` - Remove build outputs
- `npm run lint` - Lint source files
- `npm run test` - Run tests with coverage
- `npm run build` - Full build (clear + lint + test + compile + docs)
- `npm run compile_cjs` - Compile CommonJS
- `npm run compile_esm` - Compile ES Modules
- `npm run compile_dts` - Generate type declarations
- `npm run compile_bin` - Bundle for browser (IIFE)
- `npm run compile_tst` - Compile test files
- `npm run compile_all` - Compile all formats
- `npm run docs` - Generate TypeDoc documentation
- `npm run srv` - Start development server (if supported)

### Output Directories

Each package generates outputs in the following directories:

- `cjs/` - CommonJS output
- `esm/` - ES Module output
- `dts/` - TypeScript declaration files
- `bin/` - Browser bundle (IIFE format)
- `tst/` - Compiled test files
- `coverage/` - Test coverage reports
- `docs/` - TypeDoc documentation

### Build Process

1. **Clear**: Remove previous build outputs
2. **Lint**: Check code style and type errors
3. **Test**: Run tests with coverage requirements
4. **Compile**: Generate all output formats
5. **Documentation**: Generate TypeDoc docs

---

## Code Standards

### TypeScript Rules

- **Strict Mode**: Enabled (`"strict": true`)
- **No Explicit Any**: Error (`@typescript-eslint/no-explicit-any: error`)
- **Explicit Module Boundaries**: Required (`@typescript-eslint/explicit-module-boundary-types: error`)
- **No Namespaces**: Disabled (allowed for compatibility)

### Formatting Rules

- **Line Length**: 70 characters maximum
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Trailing Commas**: Always in multi-line structures
- **Arrow Functions**: Always use parentheses: `(param) => {}`

### Documentation Requirements

- All exported functions must have JSDoc comments
- Include `@param` tags for all parameters
- Include `@returns` tag with description
- Include `@example` tag when helpful
- All interfaces must have descriptions

### File Naming

- Source files: `camelCase.ts`
- Test files: `{source}.test.ts`
- Type files: `{name}.ts` in `types/` directory

### Import Organization

1. External dependencies
2. Internal @hdml package dependencies
3. Local imports
4. Type-only imports: `import type { ... }`

---

## Testing

### Test Framework

- **Framework**: Jest
- **Test Pattern**: `**/?(*.)+(test).+(js)`
- **Coverage**: Required for builds
- **Location**: Same directory as source files

### Test Structure

```typescript
describe("functionName", () => {
  it("should handle basic case", () => {
    // Test implementation
  });

  it("should handle edge case", () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# All packages
npm run test

# Specific package
cd packages/{package}
npm run test
```

### Test Compilation

Tests are compiled to JavaScript before running:
- Uses `tst.json` TypeScript configuration
- Output to `tst/` directory
- Compiled before Jest execution

---

## Common Tasks

### Adding a New HDML Element

1. **Update FlatBuffers Schema**:
   - Edit `.fbs` file in `HDML-Schemas/src/`
   - Define struct with all fields

2. **Regenerate Schemas**:
   ```bash
   cd packages/schemas
   npm run compile_fbs
   ```

3. **Add TypeScript Interface**:
   - Create interface in `packages/types/src/`
   - Export from `packages/types/src/index.ts`

4. **Add Parser Support**:
   - Add handler in `packages/parser/src/hdmlTreeAdapter/`
   - Update tree adapter map

5. **Add Buffer Support**:
   - Create `bufferify*()` function in `packages/buffer/src/`
   - Handle serialization/deserialization

6. **Add Stringifier Support**:
   - Create `get*SQL()` and `get*HTML()` functions
   - Handle all enum values

7. **Add Tests**:
   - Write tests for all new functions
   - Test edge cases

8. **Update Documentation**:
   - Add JSDoc comments
   - Update README if needed

### Modifying Existing Elements

1. Update FlatBuffers schema (if structure changes)
2. Regenerate schemas
3. Update TypeScript interfaces
4. Update parser, buffer, and stringifier functions
5. Update tests
6. Ensure backward compatibility if possible

### Debugging Build Issues

1. **Clear all builds**:
   ```bash
   npm run clear
   ```

2. **Check TypeScript errors**:
   ```bash
   npm run lint
   ```

3. **Check test failures**:
   ```bash
   npm run test
   ```

4. **Rebuild from scratch**:
   ```bash
   npm run clear
   npm install
   npm run build
   ```

### Working with Git Submodules

**Update submodule**:
```bash
cd HDML-Schemas
git pull origin main
cd ..
git add HDML-Schemas
git commit -m "Update HDML-Schemas submodule"
```

**Initialize if missing**:
```bash
git submodule update --init --recursive
```

---

## Troubleshooting

### Common Issues

**Issue**: FlatBuffers types not found
- **Solution**: Run `npm run compile_fbs` in schemas package

**Issue**: Tests fail to compile
- **Solution**: Run `npm run compile_tst` in package directory

**Issue**: Import errors between packages
- **Solution**: Ensure all packages are built: `npm run build`

**Issue**: Linter errors about line length
- **Solution**: Break long lines to 70 characters or less

**Issue**: Type errors after schema changes
- **Solution**: Regenerate schemas and rebuild all packages

### Getting Help

1. Check package README files
2. Review test files for usage examples
3. Check TypeDoc documentation: `packages/{package}/docs/`
4. Review existing code patterns
5. Check GitHub issues

---

## Additional Resources

- **FlatBuffers Documentation**: https://google.github.io/flatbuffers/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/
- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **TypeDoc Documentation**: https://typedoc.org/

---

## License

This project is licensed under the Apache License 2.0.

---

**Last Updated**: Based on repository analysis
**Maintainer**: Artem Lytvynov

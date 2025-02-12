# path-typegen

[![CI Status](https://github.com/SaeWooKKang/path-typegen/actions/workflows/ci.yml/badge.svg)](https://github.com/SaeWooKKang/path-typegen/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/path-typegen.svg)](https://www.npmjs.com/package/path-typegen)
[![codecov](https://codecov.io/github/SaeWooKKang/path-typegen/graph/badge.svg?token=2U4N55K5EB)](https://codecov.io/github/SaeWooKKang/path-typegen)

`path-typegen` is a library that converts file paths to TypeScript types

## ToC
- [Installation](#installation)
- [Usage](#usage)
  - [ph](#ph)
  - [writeTS](#writets)
  - [CLI](#cli)

## Installation

``` bash
npm i path-typegen
```

## Usage

### ph
Provides flexible path type processing using method chaining with `map` and `filter`. 

##### Basic
``` ts
// 📦 src/components/
//  ┣ 📂Button
//  ┃ ┗ 📜index.tsx
//  ┣ 📂Card
//  ┃ ┗ 📜index.tsx

ph('./src/components', './src/types/components.ts')
  .write()

// ./src/types/components.ts
export type PathType = './src/components/Button/index.tsx' | './src/components/Card/index.tsx'
```

##### Processing
Uses method chaining with `map()` and `filter()` for path transformations. 
- All operations are **lazily evaluated** until `write()` is called.
- Use `typed` tagged template function for object type transformation

```ts
// 📦 src/pages/
//  ┣ 📜posts/[id].tsx
//  ┗ 📜users/[id]/settings.tsx

const paths = ph('./src/pages', './src/types/routes.ts')
  .filter(path => path.endsWith('.tsx')) // Lazy evaluation, Iterable is not consumed
  .map(path => typed`{
    path: ${path},
    params: {
      id: number,
    }
  }`) // Lazy evaluation, Iterable is still not consumed
  .write(prettier.format) // Iterable is consumed

// ./src/types/routes.ts
export type PathType = 
  | {
      path: './src/pages/posts/[id].tsx',
      params: {
        id: number
      }
    } 
  | {
      path: './src/pages/users/[id]/settings.tsx',
      params: {
        id: number
      }
    }
```

##### Configuration
``` ts
ph('./src/components', './src/types/components.ts')
  .setConfig({
    typeName: 'ComponentPaths',
    annotation: '/** @generated This is auto-generated type */\n'
  })
  .write()

// ./src/types/components.ts
/** @generated This is auto-generated type */
export type ComponentPaths = './src/components/Button/index.tsx' | './src/components/Card/index.tsx'
```

### writeTS
- Generates path structure to Typescript

##### Basic
``` ts
// 📦 src/assets/
//  ┣ 📂bar
//  ┃ ┗ 📜a.png
//  ┣ 📂foo
//  ┃ ┗ 📜b.jpeg

writeTS('./src/assets', './src/imageType.ts');

// ./src/imageType.ts
export type ImageType = './src/assets/bar/a.png' | './src/assets/foo/b.jpeg'
```

##### With options

``` ts
// 📦 src/pages/posts/
//  ┣ 📂[id]
//  ┃ ┗ 📜index.tsx

writeTS('./src/pages/posts', './src/pathType.ts', {
  description: 'Wrap your navigation Component',
  typeName: 'PathType',
  replacer: (path: string) => path.split('/').slice(1, -1).join('/'),
  output: {
    type: 'object',
    pattern: /(?<=\[)[^\]]*(?=\])/g; // [<PICK>]
  },
});

// ./src/pathType.ts

/** 
 * Wrap your navigation Component
 */
export type PathType = {
  path: "src/pages/posts/[id]";
  params: {
    id: string;
  };
};
```

### CLI

#### Options
- -h, --help — Prints help information
- -V, --version — Prints version information

#### Command

##### `init` command
Creates a new configuration file (path-typegen.config.cjs) in your project root with default settings. **Types are provided** through JSDoc annotations for better DX

``` bash
path-typegen init
```

##### `generate` command
Generates TypeScript types from your input files.

Options:
- -i, --input <path> — Input file path
- -o, --output <path> — Output file path

``` bash
# Generate TypeScript types
path-typegen generate -i ./assets/images -o ./ImageType.ts
```

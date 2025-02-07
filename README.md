# path-typegen

[![CI Status](https://github.com/SaeWooKKang/path-typegen/actions/workflows/ci.yml/badge.svg)](https://github.com/SaeWooKKang/path-typegen/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/path-typegen.svg)](https://www.npmjs.com/package/path-typegen)
[![codecov](https://codecov.io/github/SaeWooKKang/path-typegen/graph/badge.svg?token=2U4N55K5EB)](https://codecov.io/github/SaeWooKKang/path-typegen)

path-typegen is a library that converts file paths to TypeScript types


## Installation

``` bash
npm i path-typegen
```

## Usage

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

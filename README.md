# path-typegen
path-typegen is a library that converts file paths to TypeScript types and JSON Schema

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

### writeSchema
- Generates path structure to [JSON Schema](https://json-schema.org/)
- You can use the same Options type that was used in writeTS.

``` ts
// 📦 src/assets/
//  ┣ 📂bar
//  ┃ ┗ 📜a.png
//  ┣ 📂foo
//  ┃ ┗ 📜b.jpeg

writeSchema('./src/assets', './src/imageSchema.json');

// ./src/imageSchema.json
{
  "title": "ImageSchema",
  "type": "string",
  "enum": [
    "./src/assets/bar/a.png",
    "./src/assets/foo/b.jpeg",
  ],
  "description": "@summary this file was automatically generated by path-typegen"
}
```

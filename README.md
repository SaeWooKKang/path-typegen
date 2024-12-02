# path-typegen
path-typegen is a library that converts file paths to TypeScript types and JSON Schema

## Installation

``` bash
$ npm i path-typegen
```

## Usage

### writeTS
- Generates path structure to Typescript

``` ts
// 📦 src/assets/
//  ┣ 📂bar
//  ┃ ┗ 📜a.png
//  ┣ 📂foo
//  ┃ ┗ 📜b.jpeg

writeTS('./src/assets', './src/imageType.ts');

// ./src/imageType.ts
export type ImageType = './src/assets/bar/a.png' | './src/assets/foo.b.jpeg'
```

### writeSchema
- Generates path structure to [JSON Schema](https://json-schema.org/)

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
    "./src/assets/foo.b.jpeg",
  ],
  "description": "@summary this file was automatically generated by path-typegen"
}
```

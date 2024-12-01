import { describe, expect, it } from "vitest";
import { getAllFiles } from "../getAllFiles.js";
import { pathToSchema } from "../pathToSchema.js";

describe('pathToSchema', () => {
  it('should convert paths to basic json schema', () => {
    const DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';
    const files = getAllFiles(DIRECTORY_PATH);
    
    const jsonSchema = pathToSchema(files);

    const expectedSchema = JSON.stringify({
      "title": "FileType",
      "type": "string",
      "enum": [`${DIRECTORY_PATH}/index.ts`],
      "description": ""
    }, null, 2);

    expect(jsonSchema).toEqual(expectedSchema)
  })

  it('should convert paths with a custom replacer', () => {
    const DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';
    const files = getAllFiles(DIRECTORY_PATH);

    const getLastPath = (path: string) => path.split('/').pop() ?? '';
    const jsonSchema = pathToSchema(files, { replacer: getLastPath });

    const expectedSchema = JSON.stringify({
      "title": "FileType",
      "type": "string",
      "enum": ["index.ts"],
      "description": ""
    }, null, 2);

    expect(jsonSchema).toEqual(expectedSchema)
  })

  it('should convert paths with a type name', () => {
    const DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';
    const files = getAllFiles(DIRECTORY_PATH);

    const getLastPath = (path: string) => path.split('/').pop() ?? '';
    const jsonSchema = pathToSchema(files, { typeName: 'Routes', replacer: getLastPath });

    const expectedSchema = JSON.stringify({
      "title": "Routes",
      "type": "string",
      "enum": ["index.ts"],
      "description": ""
    }, null, 2);

    expect(jsonSchema).toEqual(expectedSchema)
  })

  it('should convert paths with description', () => {
    const DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';
    const files = getAllFiles(DIRECTORY_PATH);

    const getLastPath = (path: string) => path.split('/').pop() ?? '';
    const jsonSchema = pathToSchema(files, { typeName: 'Routes', replacer: getLastPath, description: '@deprecated this is deprecated' });

    const expectedSchema = JSON.stringify({
      "title": "Routes",
      "type": "string",
      "enum": ["index.ts"],
      "description": "@deprecated this is deprecated"
    }, null, 2);

    expect(jsonSchema).toEqual(expectedSchema)
  })
})

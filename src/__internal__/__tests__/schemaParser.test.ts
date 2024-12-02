import { describe, expect, it } from "vitest";

import { getAllFiles } from "../getAllFiles.js";
import { pathToSchema } from "../pathToSchema.js";
import { schemaParser } from "../schemaParser.js";

describe('schemaParser', () => {
  it('should convert schema to ts', async () => {
    const INPUT_DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';
  
    const schema = pathToSchema(getAllFiles(INPUT_DIRECTORY_PATH));
    const ts = await schemaParser(schema)

    const expectedFile = `/* eslint-disable */
/**
 * This file was automatically generated by path-typegen.
 * DO NOT MODIFY IT BY HAND. Instead, modify the writeTS function options parameters */

export type FileType = "./src/__internal__/__tests__/__assets__/bar/index.ts";
`

    expect(ts).toEqual(expectedFile)
  })
})

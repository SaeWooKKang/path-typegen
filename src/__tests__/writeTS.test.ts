import { describe, expect } from 'vitest'
import { writeTS } from '../writeTS.js';

import fs from 'node:fs';
import { it } from 'vitest';
import { afterEach } from 'vitest';

describe('writeTS', async () => {
  const OUTPUT_DIRECTORY_PATH = './src/__tests__/foo.ts';

  afterEach(() => {
    fs.rmSync(OUTPUT_DIRECTORY_PATH);
  } )
  it('should write ts file', async () => {
    const INPUT_DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';
  
    await writeTS(INPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_PATH)
  
    const file = fs.readFileSync(OUTPUT_DIRECTORY_PATH, 'utf-8');
    const expectedFile = `/* eslint-disable */
/**
 * This file was automatically generated by path-typegen.
 * DO NOT MODIFY IT BY HAND. Instead, modify the writeTS function options parameters */

export type FileType = "./src/__internal__/__tests__/__assets__/bar/index.ts";
`
  
    expect(file).toEqual(expectedFile)
  })
})

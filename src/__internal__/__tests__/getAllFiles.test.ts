import { describe, expect, it } from 'vitest';
import { getAllFiles } from '../getAllFiles';

describe('getAllFiles', () => {
  it('one file', () => {
    const DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';
    const first = getAllFiles(DIRECTORY_PATH).next().value;

    expect(first).toBe(`${DIRECTORY_PATH}/index.ts`);
  });

  it('recursive files', () => {
    const DIRECTORY_PATH = './src/__internal__/__tests__/__assets__';
    const res = [...getAllFiles(DIRECTORY_PATH)];

    expect(res.length).toBe(3);
  });
});

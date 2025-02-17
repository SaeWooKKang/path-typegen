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

  it('should handle path with trailing slash', () => {
    const PATH_WITHOUT_SLASH = './src/__internal__/__tests__/__assets__/bar';
    const PATH_WITH_SLASH = `${PATH_WITHOUT_SLASH}/`;

    const withSlash = getAllFiles(PATH_WITH_SLASH).next().value;
    const withWithoutSlash = getAllFiles(PATH_WITHOUT_SLASH).next().value;

    const res = `${PATH_WITHOUT_SLASH}/index.ts`;

    expect(withSlash).toBe(res);
    expect(withWithoutSlash).toBe(res);
  });
});

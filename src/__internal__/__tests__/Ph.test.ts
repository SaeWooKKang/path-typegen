import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { type Config, Ph } from '../Ph';
import { isIterable } from '../iterableHelpers';
import { typed } from '../typed';

vi.mock('node:fs', () => ({
  default: {
    promises: {
      writeFile: vi.fn(),
    },
  },
}));

describe('Ph', () => {
  const INPUT_DIRECTORY_PATH = './src/__internal__/__tests__/__assets__';
  const OUTPUT_FILE_PATH = './src/__tests__/foo.ts';

  const iterable = [
    './src/__internal__/__tests__/__assets__/index.md',
    './src/__internal__/__tests__/__assets__/foo/index.tsx',
    './src/__internal__/__tests__/__assets__/bar/index.ts',
  ] as const;

  describe('Path Setters', () => {
    it('should create new instance with updated input path', () => {
      const ph = new Ph(INPUT_DIRECTORY_PATH, OUTPUT_FILE_PATH, iterable);

      const newInstance = ph.setInputPath('/new-input');

      expect(newInstance).not.toBe(ph);
      expect(newInstance.inputPath).toBe('/new-input');
      expect(newInstance.outputPath).toBe(OUTPUT_FILE_PATH);
    });

    it('should create new instance with updated output path', () => {
      const ph = new Ph(INPUT_DIRECTORY_PATH, OUTPUT_FILE_PATH, iterable);
      const newInstance = ph.setOutputPath('/new-output');

      expect(newInstance).not.toBe(ph);
      expect(newInstance.inputPath).toBe(INPUT_DIRECTORY_PATH);
      expect(newInstance.outputPath).toBe('/new-output');
    });
  });

  describe('setConfig', () => {
    it('should update config with object', () => {
      const newConfig = { typeName: 'Test', annotation: 'Test Description' };
      const ph = new Ph(
        INPUT_DIRECTORY_PATH,
        OUTPUT_FILE_PATH,
        iterable,
      ).setConfig(newConfig);

      expect(ph.config).toEqual(newConfig);
    });

    it('should update config with callback function', () => {
      const configCallback = (prevConfig: Config) => ({
        ...prevConfig,
        typeName: 'Updated',
      });
      const ph = new Ph(
        INPUT_DIRECTORY_PATH,
        OUTPUT_FILE_PATH,
        iterable,
      ).setConfig(configCallback);

      expect(ph.config.typeName).toBe('Updated');
    });
  });

  describe('map', () => {
    it('transforms paths using provided callback', () => {
      const cb = (path: string) => path.toUpperCase();

      const ph = new Ph(INPUT_DIRECTORY_PATH, OUTPUT_FILE_PATH, iterable).map(
        cb,
      );

      expect(ph instanceof Ph).toBeTruthy();
      expect(isIterable(ph.paths)).toBeTruthy();
      expect(ph.paths[Symbol.iterator]().next().value).toBe(cb(iterable[0]));
    });
  });

  describe('filter', () => {
    it('excludes paths not matching predicate', () => {
      const cb = (path: string) => path.endsWith('.tsx');

      const ph = new Ph(
        INPUT_DIRECTORY_PATH,
        OUTPUT_FILE_PATH,
        iterable,
      ).filter(cb);

      expect(ph instanceof Ph).toBeTruthy();
      expect(isIterable(ph.paths)).toBeTruthy();
      expect(ph.paths[Symbol.iterator]().next().value).toBe(iterable[1]);
    });
  });

  describe('createUnionType', () => {
    it('should generate valid type definition without map transformation', () => {
      const code = new Ph(
        INPUT_DIRECTORY_PATH,
        OUTPUT_FILE_PATH,
        iterable,
      ).createUnionType();

      const expectedContent = `export type PathType = ${iterable
        .map((path) => `'${path}'`)
        .join(' | ')}`;

      expect(code).toBe(expectedContent);
    });

    it('should handle path mapping without typed function', () => {
      const code = new Ph(INPUT_DIRECTORY_PATH, OUTPUT_FILE_PATH, iterable)
        .map((path) => path)
        .createUnionType();

      const expectedContent = `export type PathType = ${iterable
        .map((path) => `'${path}'`)
        .join(' | ')}`;

      expect(code).toBe(expectedContent);
    });

    it('should handle path mapping with typed function', () => {
      const code = new Ph(INPUT_DIRECTORY_PATH, OUTPUT_FILE_PATH, iterable)
        .map((path) => typed`${path}`)
        .createUnionType();

      const expectedContent = `export type PathType = ${iterable
        .map((path) => `'${path}'`)
        .join(' | ')}`;

      expect(code).toBe(expectedContent);
    });

    it('should support chained transformations with multiple maps', () => {
      const code = new Ph(INPUT_DIRECTORY_PATH, OUTPUT_FILE_PATH, iterable)
        .map((path) => path.toLocaleLowerCase())
        .map((path) => `${path}`)
        .createUnionType();

      const expectedContent = `export type PathType = ${iterable
        .map((path) => path.toLocaleLowerCase())
        .map((path) => `'${path}'`)
        .join(' | ')}`;

      expect(code).toBe(expectedContent);
    });
  });

  describe('write', () => {
    it('should write file with default formatting', async () => {
      const ph = new Ph(INPUT_DIRECTORY_PATH, OUTPUT_FILE_PATH, iterable);
      await ph.write();

      const expectedContent = `export type PathType = ${iterable.map((path) => `'${path}'`).join(' | ')}`;

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        OUTPUT_FILE_PATH,
        expectedContent,
      );
    });

    it('should write file with custom formatter', () => {
      const formatter = (code: string) => code.toLowerCase();

      new Ph(INPUT_DIRECTORY_PATH, OUTPUT_FILE_PATH, iterable).write(formatter);

      const expectedContent = `export type PathType = ${iterable
        .map((path) => `'${path}'`)
        .join(' | ')
        .toLowerCase()}`;

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        OUTPUT_FILE_PATH,
        expectedContent,
      );
    });
  });
});

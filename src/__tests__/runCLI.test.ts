import { describe, it, expect, vi, afterEach } from 'vitest';

import { runCLI } from '../runCLI';

import { writeTS, writeSchema } from '../index';
import path from 'node:path';
import {
  CONFIG_FILENAME,
  generateConfig,
} from '../__internal__/generateConfig';

vi.mock('../index', () => ({
  writeSchema: vi.fn().mockResolvedValue(undefined),
  writeTS: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../__internal__/generateConfig', async (importOriginal) => {
  const actual = (await importOriginal()) as object;

  return {
    ...actual,
    generateConfig: vi.fn().mockResolvedValue(undefined),
  };
});

describe('CLI', () => {
  it('should execute CLI command with input and output paths', async () => {
    process.argv = [
      'node',
      './src/cli.ts',
      'generate',
      '-i',
      './src/__internal__',
      '-o',
      './src/foo.ts',
    ];

    await runCLI();

    expect(writeTS).toHaveBeenCalledWith(
      './src/__internal__',
      './src/foo.ts',
      undefined,
    );
  });

  it('should generate TypeScript types by default', async () => {
    process.argv = [
      'tsx',
      './src/cli.ts',
      'generate',
      '-i',
      './src/__internal__',
      '-o',
      './src/foo.ts',
    ];

    await runCLI();

    expect(writeTS).toHaveBeenCalledWith(
      './src/__internal__',
      './src/foo.ts',
      undefined,
    );
  });

  it('should generate JSON Schema when --schema flag is provided', async () => {
    process.argv = [
      'node',
      'cli.ts',
      'generate',
      '-i',
      './src/__internal__',
      '-o',
      'schema.json',
      '--schema',
    ];

    await runCLI();

    expect(writeSchema).toHaveBeenCalledWith(
      './src/__internal__',
      'schema.json',
      undefined,
    );
  });

  it('should generate a config file when init flag is provided', async () => {
    process.argv = ['node', 'cli.ts', 'init'];

    await runCLI();

    const configPath = path.join(process.cwd(), CONFIG_FILENAME);

    expect(generateConfig).toHaveBeenCalledWith(
      configPath,
      expect.any(Function),
      expect.any(Function),
    );
  });

  it('should use CLI options over config options', async () => {
    process.argv = [
      'node',
      'cli.ts',
      'generate',
      '-i',
      './src/__internal__',
      '-o',
      './src/path.json',
      '-s',
    ];

    const configPath = path.join(process.cwd(), CONFIG_FILENAME);

    await generateConfig(configPath);

    await runCLI();

    expect(writeSchema).toHaveBeenCalledWith(
      './src/__internal__',
      './src/path.json',
      undefined,
    );
  });

  it('should throw an error if input or output path does not exist', async () => {
    process.argv = ['node', 'cli.ts'];

    await expect(() => runCLI()).rejects.toThrow();
  });
});

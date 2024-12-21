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
      '-i',
      './src/__internal__',
      '-o',
      './src/foo.ts',
    ];

    await runCLI();

    expect(writeTS).toHaveBeenCalledWith('./src/__internal__', './src/foo.ts');
  });

  it('should generate TypeScript types by default', async () => {
    process.argv = [
      'tsx',
      './src/cli.ts',
      '-i',
      './src/__internal__',
      '-o',
      './src/foo.ts',
    ];

    await runCLI();

    expect(writeTS).toHaveBeenCalledWith('./src/__internal__', './src/foo.ts');
  });

  it('should generate JSON Schema when --schema flag is provided', async () => {
    process.argv = [
      'node',
      'cli.ts',
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
    );
  });

  it('should generate a config file when init flag is provided', async () => {
    process.argv = ['node', 'cli.ts', '--init'];

    await runCLI();

    const configPath = path.join(process.cwd(), CONFIG_FILENAME);

    expect(generateConfig).toHaveBeenCalledWith(
      configPath,
      expect.any(Function),
      expect.any(Function),
    );
  });
});

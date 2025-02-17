import { describe, expect, it, vi } from 'vitest';

import { runCLI } from '../runCLI';

import path from 'node:path';
import chalk from 'chalk';
import {
  CONFIG_FILENAME,
  generateConfig,
} from '../__internal__/generateConfig';
import { writeTS } from '../__internal__/writeTS';

vi.mock('../__internal__/writeTS', () => ({
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

  it('should generate a config file when init flag is provided', async () => {
    process.argv = ['node', 'cli.ts', 'init'];

    await runCLI();

    const configPath = path.join(process.cwd(), CONFIG_FILENAME);

    expect(generateConfig).toHaveBeenCalledWith(configPath);
  });

  it('should handle error when creating config file', async () => {
    process.argv = ['node', 'cli.ts', 'init'];

    const consoleLogSpy = vi.spyOn(console, 'log');

    vi.mocked(generateConfig).mockRejectedValueOnce(new Error('Test error'));

    await runCLI();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      chalk.red('❌ Failed to create configuration file: '),
      expect.any(Error),
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
    ];

    const configPath = path.join(process.cwd(), CONFIG_FILENAME);

    await generateConfig(configPath);

    await runCLI();

    expect(writeTS).toHaveBeenCalledWith(
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

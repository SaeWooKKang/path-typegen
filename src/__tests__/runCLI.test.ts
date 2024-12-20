import { describe, it, expect, vi, afterEach } from 'vitest';

import { runCLI } from '../runCLI';

import { writeTS, writeSchema } from '../index';

vi.mock('../index', () => ({
  writeSchema: vi.fn().mockResolvedValue(undefined),
  writeTS: vi.fn().mockResolvedValue(undefined),
}));

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

  it('should throw error when required options are missing', () => {
    process.argv = ['node', 'cli.ts'];

    expect(() => runCLI()).toThrow();
  });
});

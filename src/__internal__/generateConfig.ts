import fs from 'node:fs/promises';

export const CONFIG_FILENAME = 'path-typegen.config.js';

const DEFAULT_CONFIG = {
  input: './src',
  output: './types.ts',
};

export const generateConfig = async (
  path: string,
  success = () => null,
  fail = (error: unknown) => null,
) => {
  try {
    const configContent = `/** @type {import('path-typegen').CLIOptions} */
module.exports = ${JSON.stringify(DEFAULT_CONFIG, null, 2)}`;

    await fs.writeFile(path, configContent, 'utf-8');

    success();
  } catch (error) {
    fail(error);
  }
};

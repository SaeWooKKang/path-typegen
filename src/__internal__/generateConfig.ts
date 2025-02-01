import fs from 'node:fs/promises';

export const CONFIG_FILENAME = 'path-typegen.config.cjs';

const DEFAULT_CONFIG = {
  inputPath: './src',
  outputPath: './types.ts',
};

const CONFIG_CONTENTS = `/** @type {import('path-typegen').CLIOptions} */
module.exports = ${JSON.stringify(DEFAULT_CONFIG, null, 2)}`;

export const generateConfig = async (path: string) =>
  await fs.writeFile(path, CONFIG_CONTENTS, 'utf-8');

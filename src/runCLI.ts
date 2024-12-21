import chalk from 'chalk';
import { Command } from 'commander';
import { writeSchema, writeTS } from './index';
import { CONFIG_FILENAME, generateConfig } from './__internal__/generateConfig';
import nodePath from 'node:path';
import type { Options } from './__internal__/pathToSchema';
import fs from 'node:fs';

export type CLIOptions = {
  inputPath: string;
  outputPath: string;
  /** Default: false */
  isSchema?: boolean;
  options: Options;
};

const configPath = nodePath.join(process.cwd(), CONFIG_FILENAME);

export const runCLI = async () => {
  const program = new Command();

  program
    .option('--init')
    .option('-i --input <inputPath>')
    .option('-o, --output <outputPath>')
    .option('-s, --schema', 'Generate JSON Schema', false)
    .option('-ts, --typescript', 'Generate TypeScript types', true)
    .parse();

  const cliOptions = program.opts();

  if (cliOptions.init) {
    generateConfig(
      configPath,
      () =>
        console.log(chalk.green('✨ Configuration file created: '), configPath),
      (e) =>
        console.log(chalk.red('❌ Failed to create configuration file: '), e),
    );

    return;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation> TODO: fix
  let config: any;

  if (fs.existsSync(configPath)) {
    config = await import(configPath);
  }

  const inputPath = cliOptions.input ?? config?.default?.inputPath;
  const outputPath = cliOptions.output ?? config?.default?.outputPath;

  const isSchema = cliOptions.schema || config?.default?.isSchema;

  if (!inputPath || !outputPath) {
    throw new Error(chalk.red('❌ Please provide both input and output paths'));
  }

  if (isSchema) {
    writeSchema(inputPath, outputPath, config?.default?.options).then(() => {
      console.log(chalk.blue('✨ Generated JSON Schema: '), outputPath);
    });
  } else {
    writeTS(inputPath, outputPath, config?.default?.options).then(() => {
      console.log(chalk.blue('✨ Generated TypeScript types: '), outputPath);
    });
  }
};

import chalk from 'chalk';
import { Command } from 'commander';
import { writeSchema, writeTS } from './index';
import { CONFIG_FILENAME, generateConfig } from './__internal__/generateConfig';
import nodePath from 'node:path';
import type { Options } from './__internal__/pathToSchema';

export type CLIOptions = {
  inputPath: string;
  outputPath: string;
  /** Default: false */
  isSchema?: boolean;
  options: Options;
};

export const runCLI = () => {
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
    const configPath = nodePath.join(process.cwd(), CONFIG_FILENAME);

    generateConfig(
      configPath,
      () =>
        console.log(chalk.green('✨ Configuration file created: '), configPath),
      (e) =>
        console.log(chalk.red('❌ Failed to create configuration file: '), e),
    );

    return;
  }

  const inputPath = cliOptions.input;
  const outputPath = cliOptions.output;

  const isSchema = cliOptions.schema;

  if (isSchema) {
    writeSchema(inputPath, outputPath).then(() => {
      console.log(chalk.blue('✨ Generated JSON Schema: '), outputPath);
    });
  } else {
    writeTS(inputPath, outputPath).then(() => {
      console.log(chalk.blue('✨ Generated TypeScript types: '), outputPath);
    });
  }
};

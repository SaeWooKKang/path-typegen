import chalk from 'chalk';
import { Command } from 'commander';
import { writeSchema, writeTS } from './index';
import { CONFIG_FILENAME, generateConfig } from './__internal__/generateConfig';
import nodePath from 'node:path';
import type { Options } from './__internal__/pathToSchema';
import fs from 'node:fs';
import { version } from '../package.json';

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

  program.version(version);

  program
    .command('init')
    .description('Create a new configuration file')
    .action(() => {
      generateConfig(
        configPath,
        () =>
          console.log(
            chalk.green('✨ Configuration file created: '),
            configPath,
          ),
        (e) =>
          console.log(chalk.red('❌ Failed to create configuration file: '), e),
      );
    });

  program
    .command('generate')
    .description('Generate TypeScript types or JSON Schema')
    .option('-i, --input <inputPath>', 'Input file path')
    .option('-o, --output <outputPath>', 'Output file path')
    .option('-s, --schema', 'Generate JSON Schema instead of TypeScript', false)
    .action(async (options) => {
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation> FIXME:
      let config;
      if (fs.existsSync(configPath)) {
        config = await import(configPath);
      }

      const inputPath = options.input ?? config?.default?.inputPath;
      const outputPath = options.output ?? config?.default?.outputPath;

      if (!inputPath || !outputPath) {
        throw new Error(
          chalk.red('❌ Please provide both input and output paths'),
        );
      }

      if (options.schema) {
        await writeSchema(inputPath, outputPath, config?.default?.options);
        console.log(chalk.blue('✨ Generated JSON Schema: '), outputPath);
      } else {
        await writeTS(inputPath, outputPath, config?.default?.options);
        console.log(chalk.blue('✨ Generated TypeScript types: '), outputPath);
      }
    });

  program.parse();
};

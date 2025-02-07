import fs from 'node:fs';
import nodePath from 'node:path';
import chalk from 'chalk';
import { Command } from 'commander';
import { version } from '../package.json';
import { CONFIG_FILENAME, generateConfig } from './__internal__/generateConfig';
import type { Options } from './__internal__/pathToSchema';
import { writeTS } from './index';

export type CLIOptions = {
  inputPath: string;
  outputPath: string;
  options: Options;
};

const configPath = nodePath.join(process.cwd(), CONFIG_FILENAME);

export const runCLI = async () => {
  const program = new Command();

  program.version(version);

  program
    .command('init')
    .description('Create a new configuration file')
    .action(async () => {
      try {
        await generateConfig(configPath);

        console.log(chalk.green('✨ Configuration file created: '), configPath);
      } catch (e) {
        console.log(chalk.red('❌ Failed to create configuration file: '), e);
      }
    });

  program
    .command('generate')
    .description('Generate TypeScript types')
    .option('-i, --input <inputPath>', 'Input file path')
    .option('-o, --output <outputPath>', 'Output file path')
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

      await writeTS(inputPath, outputPath, config?.default?.options);
      console.log(chalk.blue('✨ Generated TypeScript types: '), outputPath);
    });

  program.parse();
};

import chalk from 'chalk';
import { Command } from 'commander';
import { writeSchema, writeTS } from './index';

export const runCLI = () => {
  const program = new Command();

  program
    .requiredOption('-i --input <inputPath>')
    .requiredOption('-o, --output <outputPath>')
    .option('-s, --schema', 'Generate JSON Schema', false)
    .option('-ts, --typescript', 'Generate TypeScript types', true);

  program.parse();

  const cliOptions = program.opts();
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

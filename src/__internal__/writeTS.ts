import fs from 'node:fs';
import { getAllFiles } from './getAllFiles';
import { type Options, pathToSchema } from './pathToSchema';
import { schemaParser } from './schemaParser';

export const writeTS = async (
  inputPath: string,
  outputPath: string,
  options?: Omit<Options, 'space'>,
) => {
  const allFiles = getAllFiles(inputPath);
  const schema = pathToSchema([...allFiles], options);

  const res = await schemaParser(schema);

  await fs.promises.writeFile(outputPath, res);
};

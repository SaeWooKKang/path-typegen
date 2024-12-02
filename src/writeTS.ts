import fs from 'node:fs';
import { getAllFiles } from './__internal__/getAllFiles';
import { type Options, pathToSchema } from './__internal__/pathToSchema';
import { schemaParser } from './__internal__/schemaParser';

export const writeTS = async (
  inputPath: string,
  outputPath: string,
  options?: Omit<Options, 'space'>,
) => {
  const allFiles = getAllFiles(inputPath);
  const schema = pathToSchema(allFiles, options);

  const res = await schemaParser(schema);

  await fs.promises.writeFile(outputPath, res);
};

import fs from 'node:fs';
import { getAllFiles } from './__internal__/getAllFiles';
import { type Options, pathToSchema } from './__internal__/pathToSchema';

export const writeSchema = async (
  inputPath: string,
  outputPath: string,
  options?: Options,
) => {
  const allFiles = getAllFiles(inputPath);
  const schema = pathToSchema(allFiles, options);

  await fs.promises.writeFile(outputPath, schema.toJSON());
};

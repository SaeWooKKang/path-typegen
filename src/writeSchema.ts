import fs from 'node:fs';
import { getAllFiles } from './__internal__/getAllFiles.js';
import { pathToSchema } from './__internal__/pathToSchema.js';

export const writeSchema = (inputPath: string, outputPath: string) => {
  const schema = pathToSchema(getAllFiles(inputPath));
  
  fs.writeFileSync(outputPath, schema);
};

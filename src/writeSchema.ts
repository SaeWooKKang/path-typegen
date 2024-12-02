import fs from 'node:fs';
import { getAllFiles } from './__internal__/getAllFiles';
import { pathToSchema } from './__internal__/pathToSchema';

export const writeSchema = async (inputPath: string, outputPath: string) => {
	const schema = pathToSchema(getAllFiles(inputPath));

	await fs.promises.writeFile(outputPath, schema.toJSON());
};

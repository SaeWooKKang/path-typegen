import fs from 'node:fs';
import { getAllFiles } from './__internal__/getAllFiles.js';
import { type Options, pathToSchema } from './__internal__/pathToSchema.js';
import { schemaParser } from './__internal__/schemaParser.js';

export const writeTS = async (
	inputPath: string,
	outputPath: string,
	options?: Options,
) => {
	const schema = pathToSchema(getAllFiles(inputPath), options);

	const res = await schemaParser(schema);

	if (fs.existsSync(outputPath)) {
		fs.rmSync(outputPath);
	}

	fs.writeFileSync(outputPath, res);
};

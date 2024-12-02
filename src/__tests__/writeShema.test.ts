import fs from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { writeSchema } from '../writeSchema';

describe('writeSchema', () => {
	const OUTPUT_DIRECTORY_PATH = './src/__tests__/foo.json';

	afterEach(() => {
		fs.rmSync(OUTPUT_DIRECTORY_PATH);
	});

	it('should write schema', () => {
		const INPUT_DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';

		writeSchema(INPUT_DIRECTORY_PATH, OUTPUT_DIRECTORY_PATH);

		const schema = fs.readFileSync(OUTPUT_DIRECTORY_PATH, 'utf-8');
		const expectedSchema = JSON.stringify(
			{
				title: 'FileType',
				type: 'string',
				enum: [`${INPUT_DIRECTORY_PATH}/index.ts`],
				description: '',
			},
			null,
			2,
		);

		expect(schema).toEqual(expectedSchema);
	});
});

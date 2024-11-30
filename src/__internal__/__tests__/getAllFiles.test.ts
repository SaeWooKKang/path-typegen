import { describe, expect, it } from 'vitest';
import { getAllFiles } from '../getAllFiles.js';

describe('getAllFiles', () => {
	it('one file', () => {
		const DIRECTORY_PATH = './src/__internal__/__tests__/__assets__/bar';
		const res = getAllFiles(DIRECTORY_PATH);

		expect(res[0]).toBe(`${DIRECTORY_PATH}/index.ts`);
	});

	it('recursive files', () => {
		const DIRECTORY_PATH = './src/__internal__/__tests__/__assets__';
		const res = getAllFiles(DIRECTORY_PATH);

		expect(res.length).toBe(3);
	});
});

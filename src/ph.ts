import { type PathGen, Ph } from './__internal__/Ph';
import { getAllFiles } from './__internal__/getAllFiles';

/**
 * Helps handle file paths flexibly through a chainable API. Uses method chaining with `map()`
 * and `filter()` for path transformations. All operations are **lazily evaluated** until `write()` is called.
 * @param inputPath Directory path to generate types from (e.g. './public/assets')
 * @param outputPath File path where generated type definition will be written (e.g. './types/paths.ts')
 */
export const ph = (inputPath: string, outputPath: string): PathGen<string> =>
  new Ph(inputPath, outputPath, getAllFiles(inputPath));

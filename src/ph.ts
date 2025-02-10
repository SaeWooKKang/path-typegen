import { type PathGen, Ph } from './__internal__/Ph';
import { getAllFiles } from './__internal__/getAllFiles';

export const ph = (inputPath: string, outputPath: string): PathGen<string> =>
  new Ph(inputPath, outputPath, getAllFiles(inputPath));

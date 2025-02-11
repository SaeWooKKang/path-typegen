import fs from 'node:fs';

export function* getAllFiles(inputPath: string): Generator<string> {
  const dir = fs.opendirSync(inputPath);
  let dirent: fs.Dirent | null;

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((dirent = dir.readSync())) {
    const fullPath = inputPath.concat('/', dirent.name);

    if (dirent.isDirectory()) {
      yield* getAllFiles(fullPath);
    } else {
      yield fullPath;
    }
  }

  dir.closeSync();
}

import fs from 'node:fs';

export const getAllFiles = (path: string): string[] =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .map((dirent) => ({
      isDirectory: dirent.isDirectory(),
      fullPath: path.concat('/', dirent.name),
    }))
    .flatMap(({ fullPath, isDirectory }) =>
      isDirectory ? getAllFiles(fullPath) : [fullPath],
    );

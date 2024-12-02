import fs from 'node:fs';

export const getAllFiles = (path: string) => {
  let files: string[] = [];

  const entries = fs.readdirSync(path, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.concat('/', entry.name);

    if (entry.isDirectory()) {
      const subFiles = getAllFiles(fullPath);

      files = [...files, ...subFiles];
    } else {
      files.push(fullPath);
    }
  }

  return files;
};

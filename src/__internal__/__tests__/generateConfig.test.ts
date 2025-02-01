import fs from 'node:fs';
import * as nodePath from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CONFIG_FILENAME, generateConfig } from '../generateConfig';

describe('generateConfig', () => {
  afterEach(() => {
    const path = nodePath.join(process.cwd(), CONFIG_FILENAME);

    if (fs.existsSync(path)) {
      fs.rmSync(path);
    }
  });

  it('should generate configuration file', async () => {
    const configPath = nodePath.join(process.cwd(), CONFIG_FILENAME);

    await generateConfig(configPath);

    expect(fs.existsSync(configPath)).toBe(true);
  });
});

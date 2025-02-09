import { getAllFiles } from './getAllFiles';
import { filter, join, map } from './iterableHelpers';
import fs from 'node:fs';

export interface Config {
  typeName: string;
  description: string;
}

export interface PathGen {
  inputPath: string;
  outputPath: string;
  config: Config;
  paths: Iterable<string>;
  setInputPath(path: string): PathGen;
  setOutputPath(path: string): PathGen;
  setConfig(config: Config | ((prevConfig: Config) => Config)): void;
  map(callbackFn: (path: string) => string): PathGen;
  filter(callbackFn: (path: string) => boolean): PathGen;
  write(formatter?: (code: string) => string): Promise<void>;
}

export class Ph implements PathGen {
  private _config: Config = {
    typeName: '',
    description: '',
  };

  constructor(
    public inputPath: string,
    public outputPath: string,
    public paths: Iterable<string>,
  ) {}

  setInputPath(path: string): Ph {
    return new Ph(path, this.outputPath, getAllFiles(path));
  }

  setOutputPath(path: string): Ph {
    return new Ph(this.inputPath, path, getAllFiles(path));
  }

  map(callbackFn: (path: string) => string): Ph {
    return new Ph(this.inputPath, this.outputPath, map(callbackFn, this.paths));
  }

  filter(callbackFn: (path: string) => boolean): Ph {
    return new Ph(
      this.inputPath,
      this.outputPath,
      filter(callbackFn, this.paths),
    );
  }

  get config() {
    return this._config;
  }

  public setConfig(config: Config | ((prevConfig: Config) => Config)) {
    if (typeof config === 'function') {
      this._config = config(this._config);

      return;
    }

    this._config = config;
  }

  async write(formatter?: (code: string) => string): Promise<void> {
    const DEFAULT_TYPE_NAME = 'PathType';
    const PREFIX = `export type ${this._config.typeName || DEFAULT_TYPE_NAME} = `;

    const reduced = join(
      ' | ',
      map((path) => `'${path}'`, this.paths),
    );
    const code = PREFIX + reduced;

    await fs.promises.writeFile(this.outputPath, formatter?.(code) ?? code);
  }
}

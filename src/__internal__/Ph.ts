import { getAllFiles } from './getAllFiles';
import { filter, join, map } from './iterableHelpers';
import fs from 'node:fs';

export interface Config {
  typeName: string;
  description: string;
}

export interface PathGen<A> {
  inputPath: string;
  outputPath: string;
  config: Config;
  paths: Iterable<A>;
  setInputPath(path: string): PathGen<string>;
  setOutputPath(path: string): PathGen<A>;
  setConfig(config: Config | ((prevConfig: Config) => Config)): void;
  map<B>(callbackFn: (path: A) => B): PathGen<B>;
  filter(callbackFn: (path: A) => boolean): PathGen<A>;
  write(formatter?: (code: string) => string): Promise<void>;
}

export class Ph<A> implements PathGen<A> {
  constructor(
    public inputPath: string,
    public outputPath: string,
    public paths: Iterable<A>,
    public config: Config = {
      description: '',
      typeName: 'PathType',
    },
  ) {}

  setInputPath(path: string): Ph<string> {
    return new Ph(path, this.outputPath, getAllFiles(path), this.config);
  }

  setOutputPath(path: string): Ph<A> {
    return new Ph(this.inputPath, path, this.paths, this.config);
  }

  map<B>(callbackFn: (path: A) => B): Ph<B> {
    return new Ph(
      this.inputPath,
      this.outputPath,
      map(callbackFn, this.paths),
      this.config,
    );
  }

  filter(callbackFn: (path: A) => boolean): Ph<A> {
    return new Ph(
      this.inputPath,
      this.outputPath,
      filter(callbackFn, this.paths),
      this.config,
    );
  }

  public setConfig(config: Config | ((prevConfig: Config) => Config)): Ph<A> {
    if (typeof config === 'function') {
      return new Ph(
        this.inputPath,
        this.outputPath,
        this.paths,
        config(this.config),
      );
    }

    return new Ph(this.inputPath, this.outputPath, this.paths, config);
    }

    return this;
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

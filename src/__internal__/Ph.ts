import fs from 'node:fs';
import { getAllFiles } from './getAllFiles';
import { filter, join, map } from './iterableHelpers';
import { isTyped, typed } from './typed';

export interface Config {
  typeName: string;
  annotation: string;
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
  writeSync(formatter?: (code: string) => string): Ph<A>;
}

export class Ph<A> implements PathGen<A> {
  constructor(
    public inputPath: string,
    public outputPath: string,
    public paths: Iterable<A>,
    public config: Config = {
      annotation: '',
      typeName: 'PathType',
    },
  ) {}

  public setInputPath(path: string): Ph<string> {
    return new Ph(path, this.outputPath, getAllFiles(path), this.config);
  }

  public setOutputPath(path: string): Ph<A> {
    return new Ph(this.inputPath, path, this.paths, this.config);
  }

  public map<B>(callbackFn: (path: A) => B): Ph<B> {
    return new Ph(
      this.inputPath,
      this.outputPath,
      map(callbackFn, this.paths),
      this.config,
    );
  }

  public filter(callbackFn: (path: A) => boolean): Ph<A> {
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

  public createUnionType() {
    const PREFIX = `${this.config.annotation}export type ${this.config.typeName} = `;

    const reduced = join(
      ' | ',
      map(
        (path) => (isTyped(path) ? path.toCode() : typed`${path}`.toCode()),
        this.paths,
      ),
    );

    const code = PREFIX + reduced;

    return code;
  }

  public async write(formatter?: (code: string) => string): Promise<void> {
    const code = this.createUnionType();

    await fs.promises.writeFile(this.outputPath, formatter?.(code) ?? code);
  }

  public writeSync(formatter?: (code: string) => string): Ph<A> {
    const code = this.createUnionType();

    fs.writeFileSync(this.outputPath, formatter?.(code) ?? code);

    return new Ph(this.inputPath, this.outputPath, this.paths, this.config);
  }
}

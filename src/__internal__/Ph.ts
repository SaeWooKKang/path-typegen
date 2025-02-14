import fs from 'node:fs';
import { getAllFiles } from './getAllFiles';
import { filter, join, map } from './iterableHelpers';
import { isTyped, typed } from './typed';

export interface Config {
  typeName: string;
  annotation: string | null;
}

export interface PathGen<A> {
  /**
   * Directory path to generate types from
   * @example
   * ```typescript
   * './public/assets'
   */
  inputPath: string;

  /**
   * File path where generated type definition will be written
   * @example
   * ```typescript
   * './types/pathsType.ts'
   * ```
   */
  outputPath: string;

  /**
   * Configuration for type generation
   */
  config: Config;

  /**
   * Iterable of paths generated from `inputPath`
   */
  paths: Iterable<A>;

  /**
   * Sets a new input directory path and change paths to new input dir iterable
   */
  setInputPath(path: string): PathGen<string>;

  /**
   * Sets a new output file path
   */
  setOutputPath(path: string): PathGen<A>;

  /**
   * Updates the configuration for type generation
   */
  setConfig(config: Config | ((prevConfig: Config) => Config)): PathGen<A>;

  /**
   * Transforms each path using the provided callback function
   * @note **Lazily evaluated** until `write()` is called
   * @note Use `typed` tagged template function for object type transformation
   * @example
   * ```typescript
   * const paths = ph('./input', './output.ts')
   *  .map(path => path.toUpperCase()) // literal type, iterable is not consumed
   *  .map(path => typed`{
   *     path: ${path}
   *   }`) // object type, iterable is still not consumed
   *
   * paths.write() // iterable is consumed
   * ```
   */
  map<B>(callbackFn: (path: A) => B): PathGen<B>;

  /**
   * Filters paths based on the provided callback function
   * @note **Lazily evaluated** until `write()` is called
   * @example
   * ```typescript
   * const paths = ph('./input', './output.ts') // iterable is not consumed
   *  .filter(path => path.endsWith('.ts'))
   *
   * paths.write() // iterable is consumed
   * ```
   */
  filter(callbackFn: (path: A) => boolean): PathGen<A>;

  /**
   * `Asynchronously` writes the generated type definition to the output file
   *
   * Calling this method consumes the iterable.
   * @param formatter Function to format the generated code before writing (e.g. Prettier)
   */
  write(formatter?: (code: string) => string): Promise<void>;

  /**
   * `Synchronously` writes the generated type definition to the output file
   *
   * Calling this method consumes the iterable.
   * @param formatter Function to format the generated code before writing (e.g. Prettier)
   *
   */
  writeSync(formatter?: (code: string) => string): Ph<A>;
}

export class Ph<A> implements PathGen<A> {
  constructor(
    public inputPath: string,
    public outputPath: string,
    public paths: Iterable<A>,
    public config: Config = {
      annotation: null,
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

  public _createUnionType() {
    const PREFIX = `${this.config.annotation ? `${this.config.annotation}\n` : ''}export type ${this.config.typeName} = `;

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
    const code = this._createUnionType();

    await fs.promises.writeFile(this.outputPath, formatter?.(code) ?? code);
  }

  public writeSync(formatter?: (code: string) => string): Ph<A> {
    const code = this._createUnionType();

    fs.writeFileSync(this.outputPath, formatter?.(code) ?? code);

    return new Ph(this.inputPath, this.outputPath, this.paths, this.config);
  }
}

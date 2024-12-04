type StringSchema = {
  type: 'string';
  title: string;
  enum: string[];
  description: string;
};

type ObjectSchema = {
  type: 'object';
  title: string;
  description: string;
  oneOf: Array<{
    type: 'object';
    properties: {
      path: {
        type: 'string';
        const: string;
      };
      params?: {
        type: 'object';
        properties: Record<string, { type: 'string' }>;
        required: string[];
        additionalProperties: boolean;
      };
    };
    required: string[];
    additionalProperties: boolean;
  }>;
};

type Schema = StringSchema | ObjectSchema;

type StringOutput = {
  type: 'string';
};

type ObjectOutput = {
  type: 'object';
  pattern?: RegExp;
};

type Output = StringOutput | ObjectOutput;

export type Options = {
  replacer?: (path: string) => string;
  space?: number;
  typeName?: string;
  description?: string;
  output?: Output;
};

export type SchemaOutput = {
  definition: Schema;
  toJSON: () => string;
};

const DEFAULT_SPACE = 2;

const isObjectOutput = (output?: Output): output is ObjectOutput => {
  return output?.type === 'object';
};

const createPathSchema = (
  paths: string[],
  options?: Omit<Options, 'space'>,
): Schema => {
  if (isObjectOutput(options?.output)) {
    const definition: ObjectSchema = {
      title: options.typeName ?? 'FileType',
      type: 'object',
      description: options?.description ?? '',
      oneOf: [],
    };

    const oneOf = paths.map((path) => {
      const parsedPath = options?.replacer ? options.replacer(path) : path;

      const one: ObjectSchema['oneOf'][number] = {
        type: 'object' as const,
        properties: {
          path: {
            type: 'string',
            const: parsedPath,
          },
        },
        required: ['path'],
        additionalProperties: false,
      };

      if (isObjectOutput(options?.output) && options.output?.pattern) {
        const params = [...(path.match(options.output.pattern) || [])];

        const properties = params.reduce(
          (acc, param) => {
            acc[param] = { type: 'string' as const };

            return acc;
          },
          {} as Record<string, { type: 'string' }>,
        );

        one.properties.params = {
          type: 'object',
          properties,
          required: params,
          additionalProperties: false,
        };
        one.required.push('params');
      }

      return one;
    });

    definition.oneOf = oneOf;

    return definition;
  }

  const definition: StringSchema = {
    title: options?.typeName ?? 'FileType',
    type: 'string',
    enum: [...paths],
    description: options?.description ?? '',
  };

  if (options?.replacer) {
    definition.enum = definition.enum.map(options.replacer);
  }

  return definition;
};

export const pathToSchema = (
  paths: string[],
  options?: Options,
): SchemaOutput => {
  const definition = createPathSchema(paths, options);
  const toJSON = () =>
    JSON.stringify(definition, null, options?.space ?? DEFAULT_SPACE);

  return {
    definition,
    toJSON,
  };
};

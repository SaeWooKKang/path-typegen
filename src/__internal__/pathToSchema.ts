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
        type: string;
        const: string;
      };
    };
    required: string[];
    additionalProperties: boolean;
  }>;
};

type Schema = StringSchema | ObjectSchema;

export type Options = {
  replacer?: (path: string) => string;
  space?: number;
  typeName?: string;
  description?: string;
  output?: {
    /**
     * Default: 'string'
     */
    type: 'string' | 'object';
  };
};

export type SchemaOutput = {
  definition: Schema;
  toJSON: () => string;
};

const DEFAULT_SPACE = 2;

const createPathSchema = (
  paths: string[],
  options?: Omit<Options, 'space'>,
): Schema => {
  if (options?.output?.type === 'object') {
    const definition: ObjectSchema = {
      title: 'FileType',
      type: 'object',
      description: '',
      oneOf: [],
    };

    const oneOf = paths.map((path) => {
      const parsedPath = options?.replacer ? options.replacer(path) : path;

      return {
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
    });

    definition.oneOf = oneOf;

    if (options?.description) {
      definition.description = options.description;
    }

    if (options?.typeName) {
      definition.title = options.typeName;
    }

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

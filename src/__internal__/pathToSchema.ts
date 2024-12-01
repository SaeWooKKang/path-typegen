type Schema = {
  title: string;
  type: string;
  enum: string[];
  description: string;
}

type Options = {
  replacer?: (path: string) => string;
  space?: number;
  typeName?: string;
  description?: string;
}

const DEFAULT_SPACE = 2

export const pathToSchema = (paths: string[], options?: Options): string => {
  const schema: Schema = {
    "title": "FileType",
    "type": "string",
    "enum": [],
    "description": ""
  };

  for (const path of paths) {
    schema.enum.push(path);
  }

  const replacer = (key: string, value: string[]) => {
    if (key === 'description' && options?.description) {
      console.log('options?.description,', options?.description)
      return options.description
    }

    if (key === 'title' && options?.typeName) {
      return options.typeName
    }

    if (key === 'enum' && options?.replacer) {
      return value.map(options.replacer);
    }

    return value
  }

  return JSON.stringify(schema, replacer, options?.space ?? DEFAULT_SPACE);
}

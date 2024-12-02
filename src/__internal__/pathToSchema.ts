type Schema = {
	title: string;
	type: 'string';
	enum: string[];
	description: string;
};

export type Options = {
	replacer?: (path: string) => string;
	space?: number;
	typeName?: string;
	description?: string;
};

export type SchemaOutput = {
	definition: Schema;
	toJSON: () => string;
};

const DEFAULT_SPACE = 2;

export const pathToSchema = (
	paths: string[],
	options?: Options,
): SchemaOutput => {
	const definition: Schema = {
		title: 'FileType',
		type: 'string',
		enum: [...paths],
		description: '',
	};

	if (options?.description) {
		definition.description = options.description;
	}

	if (options?.typeName) {
		definition.title = options.typeName;
	}

	if (options?.replacer) {
		definition.enum = definition.enum.map(options.replacer);
	}

	const toJSON = () =>
		JSON.stringify(definition, null, options?.space ?? DEFAULT_SPACE);

	return {
		definition,
		toJSON,
	};
};

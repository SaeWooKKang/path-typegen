export const TS_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'any',
  'unknown',
  'never',
  'void',
  'null',
  'undefined',
  'object',
  'bigint',
  'symbol',
  'true',
  'false',
]);

class Typed {
  constructor(
    private strs: TemplateStringsArray,
    private values: unknown[],
  ) {}

  toCode() {
    const newValues = [...this.values, null];
    const ziped = newValues.map((value, i) => [this.strs[i], value]);

    return ziped
      .flatMap(([str, value]) => {
        // Handle TypeScript primitive types
        if (typeof value === 'string' && TS_TYPES.has(value)) {
          return [str, value];
        }

        // Handle object types
        if (typeof value === 'string' && value.includes('{')) {
          return [str, value];
        }

        // Handle string literal types
        if (typeof value === 'string') {
          return [str, `'${value}'`];
        }

        return [str, `${value}`];
      })
      .slice(0, -1)
      .join('');
  }
}

export const typed = (
  strs: TemplateStringsArray,
  ...values: unknown[]
): Typed => {
  return new Typed(strs, values);
};

export const isTyped = (value: unknown): value is Typed => {
  return value instanceof Typed;
};

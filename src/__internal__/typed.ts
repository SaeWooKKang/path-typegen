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
    const result: string[] = [];

    for (let i = 0; i < this.values.length; i++) {
      const str = this.strs[i]!;
      const value = this.values[i];

      result.push(str);

      // Handle TypeScript primitive types
      if (typeof value === 'string' && TS_TYPES.has(value)) {
        result.push(value);
        continue;
      }

      // Handle object types
      if (typeof value === 'string' && value.includes('{')) {
        result.push(value);
        continue;
      }

      // Handle string literal types
      if (typeof value === 'string') {
        result.push(`'${value}'`);
        continue;
      }

      result.push(`${value}`);
    }

    // Add the final string part
    result.push(this.strs[this.strs.length - 1]!);

    return result.join('');
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

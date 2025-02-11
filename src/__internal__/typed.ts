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

/**
 * A tagged template function that converts template literals into TypeScript type expressions.
 *
 * @example
 * // Primitive TypeScript types are preserved as-is
 * typed`${'string'}` -> string
 *
 * // Regular strings are wrapped in quotes as literal types
 * typed`${'./src/foo.ts'}` -> './src/foo.ts'
 *
 * // Object types are preserved in their original form
 * typed`{ path: string }` -> { path: string }
 */
export const typed = (
  strs: TemplateStringsArray,
  ...values: unknown[]
): Typed => new Typed(strs, values);

export const isTyped = (value: unknown): value is Typed =>
  value instanceof Typed;

import { describe, expect, it } from 'vitest';
import { TS_TYPES, typed } from '../typed';

describe('typed', () => {
  it('should handle literal types', () => {
    const asset = './src/foo.ts';
    const res = typed`${asset}`.toCode();

    expect(res).toBe(`'${asset}'`);
  });

  it('should handle object types', () => {
    const asset = './src/foo.ts';
    const params = `{
      /** 
      * @summary JSDoc test
      */
      path: ${asset},
      params: {
        a: string,
        b: number
      }
    }`;

    const res = typed`${params}`.toCode();

    expect(res).toBe(params);
  });

  it('should expose TypeScript types as is', () => {
    for (const type of TS_TYPES) {
      expect(typed`${type}`.toCode()).toBe(type);
    }
  });

  it('should preserve whitespace and newlines', () => {
    const res = typed`
      ${'value'}
    `.toCode();
    expect(res).toBe(`
      'value'
    `);
  });
});

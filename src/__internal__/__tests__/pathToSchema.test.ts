import { describe, expect, it } from 'vitest';
import { pathToSchema } from '../pathToSchema';

describe('pathToSchema', () => {
  it('should convert paths to basic json schema', () => {
    const samplePaths = ['./src/assets/favicon.ico'];

    const schema = pathToSchema(samplePaths);

    const expectedSchema = JSON.stringify(
      {
        title: 'FileType',
        type: 'string',
        enum: samplePaths,
        description: '',
      },
      null,
      2,
    );

    expect(schema.toJSON()).toEqual(expectedSchema);
  });

  it('should convert paths with a custom replacer', () => {
    const samplePaths = ['./src/assets/favicon.ico'];

    const getLastPath = (path: string) => path.split('/').pop() ?? '';
    const schema = pathToSchema(samplePaths, { replacer: getLastPath });

    const expectedSchema = JSON.stringify(
      {
        title: 'FileType',
        type: 'string',
        enum: ['favicon.ico'],
        description: '',
      },
      null,
      2,
    );

    expect(schema.toJSON()).toEqual(expectedSchema);
  });

  it('should convert paths with a type name', () => {
    const samplePaths = ['./src/assets/favicon.ico'];

    const getLastPath = (path: string) => path.split('/').pop() ?? '';
    const schema = pathToSchema(samplePaths, {
      typeName: 'ImageType',
      replacer: getLastPath,
    });

    const expectedSchema = JSON.stringify(
      {
        title: 'ImageType',
        type: 'string',
        enum: ['favicon.ico'],
        description: '',
      },
      null,
      2,
    );

    expect(schema.toJSON()).toEqual(expectedSchema);
  });

  it('should convert paths with description', () => {
    const samplePaths = ['./src/assets/favicon.ico'];

    const getLastPath = (path: string) => path.split('/').pop() ?? '';
    const schema = pathToSchema(samplePaths, {
      typeName: 'ImageType',
      replacer: getLastPath,
      description: '@deprecated this is deprecated',
    });

    const expectedSchema = JSON.stringify(
      {
        title: 'ImageType',
        type: 'string',
        enum: ['favicon.ico'],
        description: '@deprecated this is deprecated',
      },
      null,
      2,
    );

    expect(schema.toJSON()).toEqual(expectedSchema);
  });

  it('should convert paths to object schema', () => {
    const samplePaths = ['pages/about.tsx'];

    const schema = pathToSchema(samplePaths, {
      output: {
        type: 'object',
      },
    });

    const expectedSchema = JSON.stringify(
      {
        title: 'FileType',
        type: 'object',
        description: '',
        oneOf: [
          {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                const: 'pages/about.tsx',
              },
            },
            required: ['path'],
            additionalProperties: false,
          },
        ],
      },
      null,
      2,
    );

    expect(schema.toJSON()).toEqual(expectedSchema);
  });

  it('should convert paths to object schema with params', () => {
    const samplePaths = ['pages/products/[category]/[id].tsx'];
    const pattern = /(?<=\[)[^\]]*(?=\])/g;

    const schema = pathToSchema(samplePaths, {
      output: {
        type: 'object',
        pattern: pattern,
      },
    });

    const expectedSchema = JSON.stringify(
      {
        title: 'FileType',
        type: 'object',
        description: '',
        oneOf: [
          {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                const: 'pages/products/[category]/[id].tsx',
              },
              params: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string',
                  },
                  id: {
                    type: 'string',
                  },
                },
                required: ['category', 'id'],
                additionalProperties: false,
              },
            },
            required: ['path', 'params'],
            additionalProperties: false,
          },
        ],
      },
      null,
      2,
    );

    expect(schema.toJSON()).toEqual(expectedSchema);
  });
});

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: ['./src/db/schema/**/*.graphql.ts'],
  generates: {
    './src/db/schema/': {
      preset: 'graphql-modules',
      presetConfig: {
        baseTypesPath: '../__types/graphql-types.ts',
        filename: '__types/module-types.ts',
      },
      plugins: [
        { add: { content: '/* eslint-disable */' } },
        'typescript',
        'typescript-resolvers',
      ],
      config: {
        contextType: '../graph#ResolverContextType',
        allowParentTypeOverride: true,
        scalars: {
          DateType: 'number',
        },
      },
    },
    './src/db/__types_client/': {
      documents: 'src/api/**/*.{ts,tsx}',
      preset: 'client',
      config: {
        scalars: {
          DateType: 'string',
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;

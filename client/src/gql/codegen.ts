import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/gql',
  documents: ['./src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/__types/': {
      preset: 'client',
      config: {
        scalars: {
          DateType: 'string',
        },
      },
    },
  },
};

export default config;

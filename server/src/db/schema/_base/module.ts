import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';

const Module = createModule({
  id: '_base',
  dirname: __dirname,
  typeDefs,
});

export default Module;

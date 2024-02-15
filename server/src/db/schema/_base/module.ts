import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const Module = createModule({
  id: '_base',
  dirname: __dirname,
  typeDefs: [typeDefs],
  resolvers,
});

export default Module;

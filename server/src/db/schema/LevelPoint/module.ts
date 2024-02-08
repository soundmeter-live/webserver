import { createModule } from 'graphql-modules';

import typeDefs from './types.graphql';
import resolvers from './resolvers';

const LevelPointModule = createModule({
  id: 'LevelPoint',
  dirname: __dirname,
  typeDefs,
  resolvers,
});

export default LevelPointModule;

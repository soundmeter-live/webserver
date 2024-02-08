import { timestamp } from '@/db/utilities';

import * as f from './functions';

import { LevelPointModule } from './__types/module-types';

const resolvers: LevelPointModule.Resolvers = {
  Query: {
    levelPoints: f.getLevelPoints,
  },
  Mutation: {
    levelPointCreate: f.levelPointCreate,
    levelPointCreateMultiple: f.levelPointCreateMultiple,
  },
  LevelPoint: {
    timestamp,
  },
};

export default resolvers;

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
    levelPointUpdate: f.levelPointUpdate,
    levelPointDelete: f.levelPointDelete,
  },
  LevelPoint: {
    timestamp,
  },
};

export default resolvers;

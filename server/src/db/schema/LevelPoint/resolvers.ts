import { timestamp } from '@/db/utilities';

import * as f from './functions';

import { LevelPointModule } from './__types/module-types';

const resolvers: LevelPointModule.Resolvers = {
  Query: {
    levelPoints: f.getLevelPoints,
    levelPoint: f.getLevelPoint,
    levelPointsAfterDate: f.getLevelPointsAfterDate,
    levelPointsBetweenDates: f.getLevelPointsBetweenDates,
  },
  Mutation: {
    levelPointCreate: f.levelPointCreate,
    levelPointCreateMultiple: f.levelPointCreateMultiple,
    levelPointUpdate: f.levelPointUpdate,
    levelPointDelete: f.levelPointDelete,
    levelPointDeleteAllBeforeDate: f.levelPointDeleteAllBeforeDate,
  },
  LevelPoint: {
    timestamp,
  },
};

export default resolvers;

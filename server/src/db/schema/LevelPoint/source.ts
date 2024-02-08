import Model from '@/db/lib/Model';

import type { LevelPoint } from '@/db/__types/graphql-types';

export type DBLevelPoint = LevelPoint & {};

class LevelPointSource extends Model<DBLevelPoint> {
  protected table = 'soundmeter-data';
  protected type = 'point';
}

export default LevelPointSource;

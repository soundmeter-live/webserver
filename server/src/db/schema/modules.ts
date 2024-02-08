import BaseModule from './_base/module';

import LevelPointModule from './LevelPoint/module';
import LevelPointSource from './LevelPoint/source';

// DEFINE SCHEMA

export const modules = [
  BaseModule,
  // -----------
  LevelPointModule,
];

export const sources = () => ({
  levelPoint: new LevelPointSource(),
});

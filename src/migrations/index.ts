import * as migration_20260905_163027_initial from './20260905_163027_initial';

export const migrations = [
  {
    up: migration_20260905_163027_initial.up,
    down: migration_20260905_163027_initial.down,
    name: '20260905_163027_initial'
  },
];

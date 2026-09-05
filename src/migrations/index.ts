import * as migration_20260905_163027_initial from './20260905_163027_initial';
import * as migration_20260905_170418_owner_requests from './20260905_170418_owner_requests';

export const migrations = [
  {
    up: migration_20260905_163027_initial.up,
    down: migration_20260905_163027_initial.down,
    name: '20260905_163027_initial',
  },
  {
    up: migration_20260905_170418_owner_requests.up,
    down: migration_20260905_170418_owner_requests.down,
    name: '20260905_170418_owner_requests'
  },
];

export { store, type RootState } from './store';

export * from './hooks';

export { SYNC_EVENT_NAME } from './middleware/syncPeers';

import * as game from './slices/game';
import * as location from './slices/location';
import * as player from './slices/player';
import * as saves from  './slices/saves';

export const selectors = {
  game: game.selectors,
  location: location.selectors,
  player: player.selectors,
  saves: saves.selectors,
};

import { actions as shared } from './slices/sharedActions';

export const actions = {
  shared,
  game: game.actions,
  location: location.actions,
  player: player.actions,
  saves: saves.actions
};

export { HostP2PListener, ClientP2PListener } from './P2PListeners';

export { type PlayerData } from './slices/player';

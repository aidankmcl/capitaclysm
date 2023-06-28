export { store } from './store';

import * as game from './slices/game';
import * as location from './slices/location';
import * as player from './slices/player';

export const selectors = {
  game: game.selectors,
  location: location.selectors,
  player: player.selectors,
};

export const actions = {
  game: game.actions,
  location: location.actions,
  player: player.actions
};
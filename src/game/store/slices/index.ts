
import * as game from './game';
import * as location from './locations';
import * as player from './players';
import * as saves from  './saves';
import * as notifications from  './saves';
import * as deals from './deals';

import { actions as shared } from './sharedActions';

export const actions = {
  shared,
  game: game.actions,
  location: location.actions,
  player: player.actions,
  saves: saves.actions,
  notifications: notifications.actions,
  deals: deals.actions
};

export { type PlayerData } from './players';
export { type PropertyDeal } from './deals';
export { type LocationData } from './locations';

import * as game from "./game";
import * as location from "./locations";
import * as player from "./players";
import * as saves from  "./saves";
import * as notifications from  "./saves";
import * as stocks from "./stocks";

import { actions as shared } from "./sharedActions";

export const actions = {
  shared,
  game: game.actions,
  location: location.actions,
  player: player.actions,
  saves: saves.actions,
  notifications: notifications.actions,
  stocks: stocks.actions
};

export { type PlayerData } from "./players";
export { type LocationData } from "./locations";
export { type StocksState } from "./stocks";

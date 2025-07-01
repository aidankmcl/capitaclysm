import * as game from "./game";
import * as location from "./locations";
import * as player from "./players";
import * as saves from  "./saves";
import * as notifications from  "./notifications";
import * as stocks from "./stocks";

import { actions as shared } from "./shared";

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

// Re-export individual slice actions for easier access
export { actions as gameActions } from "./game";
export { actions as locationActions } from "./locations";
export { actions as playerActions } from "./players";
export { actions as savesActions } from "./saves";
export { actions as notificationsActions } from "./notifications";
export { actions as stocksActions } from "./stocks";
export { actions as sharedActions } from "./shared";

// Re-export stock selectors for transaction support
export { selectors as stockSelectors } from "./stocks";

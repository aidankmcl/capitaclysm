import { createSelector } from "@reduxjs/toolkit";

import { RootState } from ".";

// Player selectors
const selectPlayerItems = (state: RootState) => state.players.items;
const selectPlayerIDs = (state: RootState) => state.players.playerIDs;

const playersSelectors = {
  selectPlayerItems,
  selectPlayerIDs,
  selectPlayers: createSelector([selectPlayerItems, selectPlayerIDs], (playerItems, playerIDs) => {
    return playerIDs.map(id => playerItems[id]);
  }),
  selectPlayer: (state: RootState, playerID: string | undefined) => playerID ? state.players.items[playerID] : undefined,
  selectActivePlayerID: (state: RootState) => state.players.activePlayerID,
  selectClientPlayerID: (state: RootState) => state.players.clientPlayerID
};

// Notifications selectors
export const notificationsSelectors = {};

// Locations selectors
const getLocations = (state: RootState) => state.locations.items;

const locationsSelectors = {
  getLocations,
  getLocation: (state: RootState, locationIndex: number) => {
    return state.locations.items[locationIndex];
  },
  getPlayerLocation: (state: RootState, playerID: string) => {
    const owner = state.players.items[playerID];
    if (!owner) return undefined;

    return state.locations.items[owner.locationIndex];
  },
  selectClientPlayerProperties: createSelector(
    playersSelectors.selectClientPlayerID,
    getLocations,
    (playerID, locations) => locations
      .filter(location => location.owners.some(owner => owner.ownerID === playerID))
  )
};

// Game selectors
const gameSelectors = {
  isHost: (state: RootState) => state.game.clientIsHost
};

// Trades selectors
const tradesSelectors = {
  selectTradeLog: (state: RootState) => state.trades.log,
};

// Saves selectors
export const savesSelectors = {};



export const selectors = {
  game: gameSelectors,
  locations: locationsSelectors,
  players: playersSelectors,
  saves: savesSelectors,
  notifications: notificationsSelectors,
  trades: tradesSelectors
};

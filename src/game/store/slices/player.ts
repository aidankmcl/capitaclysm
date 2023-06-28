
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { selectors as gameSelectors } from './game';
import { RootState } from '../store';

export type PlayerData = {
  id: string;
  gameID: string;
  created: number;
  name: string;
  money: number;
  propertyIDs: string[];
}

// Define a type for the slice state
interface PlayerState {
  items: Record<string, PlayerData>;
  playersByGame: Record<string, string[]>;
  activePlayerID: string | undefined;
}

// Define the initial state using that type
const initialState: PlayerState = {
  items: {},
  playersByGame: {},
  activePlayerID: undefined
};

export const playerSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<{ name: string, gameID: string }>) => {
      const { name, gameID } = action.payload;

      const player: PlayerData = {
        id: v4(),
        gameID,
        created: Date.now(),
        name,
        money: 1500,
        propertyIDs: []
      };

      state.items[player.id] = player;
      state.playersByGame[gameID] = state.playersByGame[gameID] || [];
      if (!state.playersByGame[gameID].includes(player.id)) state.playersByGame[gameID].push(player.id);
    },
    setPlayer: (state, action: PayloadAction<string>) => {
      const playerID = action.payload;
      state.activePlayerID = playerID;
    }
  },
});

export const actions = playerSlice.actions;

const selectPlayersByGame = (state: RootState) => state.players.playersByGame;
const selectPlayerItems = (state: RootState) => state.players.items;

export const selectors = {
  selectPlayers: createSelector([gameSelectors.selectActiveGameID, selectPlayersByGame, selectPlayerItems], (gameID, playersByGame, playerItems) => {
    if (!gameID) return [];

    const playerIDs = playersByGame[gameID] || [];
    return playerIDs.map(id => playerItems[id]);
  })
};

export default playerSlice.reducer;

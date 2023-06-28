import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import type { RootState } from '../store';

type GameData = {
  id: string;
  created: number;
  playerIDs: string[];
  propertyIDs: string[];
}

// Define a type for the slice state
interface GameState {
  items: Record<string, GameData>;
  activeGameID: string | undefined;
}

// Define the initial state using that type
const initialState: GameState = {
  items: {},
  activeGameID: undefined
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    newGame: (state) => {
      const game: GameData = {
        id: v4(),
        created: Date.now(),
        playerIDs: [],
        propertyIDs: []
      };

      state.items[game.id] = game;
      state.activeGameID = game.id;
    },
    deleteGame: (state, action: PayloadAction<string>) => {
      const gameID = action.payload;
      delete state.items[gameID];

      if (gameID === state.activeGameID) {
        state.activeGameID = undefined;
      }
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    addPlayers: (state, action: PayloadAction<string[]>) => {
      if (!state.activeGameID) return;

      const newPlayers = action.payload;
      const oldPlayers = state.items[state.activeGameID].playerIDs;
      state.items[state.activeGameID].playerIDs = oldPlayers.filter(id => !(id in newPlayers)).concat(newPlayers);
    },
  },
});

export const actions = gameSlice.actions;

export const selectors = {
  selectGame: (state: RootState) => state.games.activeGameID ? state.games.items[state.games.activeGameID] : undefined,
  selectActiveGameID: (state: RootState) => state.games.activeGameID
};

export default gameSlice.reducer;

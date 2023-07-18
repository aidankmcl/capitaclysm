import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { actions as shared } from './sharedActions';
import { actions as playerActions } from './player';


// Define a type for the slice state
interface GameState {
  id: string | undefined;
  gameActive: boolean;
  created: number | undefined;
  turn: number;
  clientIsHost: boolean;
}

// Define the initial state using that type
const initialState: GameState = {
  id: undefined,
  gameActive: false,
  created: undefined,
  turn: 0,
  clientIsHost: false
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(shared.syncState, (state, action) => {
        return {
          ...action.payload.games,
          clientIsHost: state.clientIsHost
        };
      })
      .addCase(playerActions.endTurn, (state) => {
        state.turn++;
      });
  },
  reducers: {
    setHost: (state, action: PayloadAction<boolean>) => {
      state.clientIsHost = action.payload;
    },
    newGame: (state) => {
      return {
        id: v4(),
        gameActive: true,
        created: Date.now(),
        turn: 0,
        clientIsHost: state.clientIsHost
      };
    },
  },
});

export const actions = gameSlice.actions;

export const selectors = {};

export default gameSlice.reducer;

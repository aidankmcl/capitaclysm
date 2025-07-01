import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { actions as shared } from "./shared";
import { actions as playerActions } from "./players";


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
  name: "game",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(shared.syncState, (state, action) => {
        // The syncState action may contain a full or partial state update.
        // We only care about the `game` slice here, so cast to a partial
        // RootState to access it safely without using `any`.
        const payload = action.payload as Partial<import("../store").RootState>;

        // If the payload contains a `game` slice, merge it, otherwise keep the existing state
        if (payload.game) {
          return {
            ...payload.game,
            // Preserve the current host flag on the client
            clientIsHost: state.clientIsHost,
          };
        }

        return state;
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

export default gameSlice.reducer;

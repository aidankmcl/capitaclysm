import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { actions as shared } from "./shared";

// Define a type for the slice state
interface SavesState {
  items: Record<string, unknown>; // Snapshot of entire state except 'saves' slice
  activeSaveID: string | undefined;
}

// Define the initial state using that type
const initialState: SavesState = {
  items: {},
  activeSaveID: undefined
};

export const savesSlice = createSlice({
  name: "saves",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(shared.save, (state, action) => {
        const { game, ...rest } = action.payload as { game?: { id?: string } } & Record<string, unknown>;
        const gameID = game?.id;

        if (!gameID) return;
        state.items[gameID] = rest;
      });
  },
  reducers: {
    deleteSave: (state, action: PayloadAction<string>) => {
      const saveID = action.payload;
      delete state.items[saveID];
    }
  }
});

export const actions = savesSlice.actions;

export default savesSlice.reducer;

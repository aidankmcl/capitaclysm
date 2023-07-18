import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '~/store';

import { actions as shared } from './sharedActions';

// Define a type for the slice state
interface SavesState {
  items: Record<string, Omit<RootState, 'saves'>>;
  activeSaveID: string | undefined;
}

// Define the initial state using that type
const initialState: SavesState = {
  items: {},
  activeSaveID: undefined
};

export const savesSlice = createSlice({
  name: 'game',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(shared.save, (state, action) => {
        const { saves, ...rest } = action.payload;
        const gameID = rest.games.id;

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

export const selectors = {};

export default savesSlice.reducer;

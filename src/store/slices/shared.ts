import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FinalizedTradePayload } from "./trades";


const initialState = {};

const sharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    syncState: (_, __: PayloadAction<unknown>) => {
      // This action doesn't modify state, it's handled by middleware
    },
    save: (_, __: PayloadAction<unknown>) => {
      // This action doesn't modify state, it's handled by middleware
    },
    finalizeTrade: (_, __: PayloadAction<FinalizedTradePayload>) => {
      // This action doesn't modify state, it's handled by other slices
    },
    purchaseProperty: (_, __: PayloadAction<{
      playerID: string;
      locationIndex: number;
      price: number;
    }>) => {
      // This action doesn't modify state, it's handled by other slices
    },
  },
});

export const actions = sharedSlice.actions;
export default sharedSlice.reducer;

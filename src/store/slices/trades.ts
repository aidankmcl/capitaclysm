import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { finalizeTrade, syncState } from "../actions";

// --- Action Payloads ---

export interface StockTrade {
  symbol: string;
  shares: number;
  marketPrice: number; // price at time of trade
}

export interface TradeItem {
  money: number;
  propertyIndices: number[];
  stocks: StockTrade[];
}

export interface FinalizedTradePayload {
  id: string; // unique id for the trade
  playerAId: string;
  playerBId: string;
  playerAItems: TradeItem; // items from A to B
  playerBItems: TradeItem; // items from B to A
  timestamp: number;
}

// --- Slice State ---
interface TradesState {
  log: FinalizedTradePayload[];
}

const initialState: TradesState = {
  log: [],
};

// --- Slice ---

const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(syncState, (_, action) => {
        return action.payload.trades;
      })
      .addCase(
        finalizeTrade,
        (state, action: PayloadAction<FinalizedTradePayload>) => {
          state.log.push(action.payload);
        }
      );
  },
});

export default tradesSlice.reducer; 
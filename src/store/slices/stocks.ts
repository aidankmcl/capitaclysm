import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StockHolding } from "../../services";
import { actions as sharedActions } from "./sharedActions";

export interface StocksState {
  holdings: Record<string, StockHolding[]>; // playerID -> holdings
}

const initialState: StocksState = {
  holdings: {}
};

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(sharedActions.finalizeTrade, (state, action) => {
      const { playerAId, playerBId, playerAItems, playerBItems } =
        action.payload;

      // Transfer stocks from Player A to Player B
      playerAItems.stocks.forEach((stockToTrade) => {
        // --- Remove stock from Player A ---
        const holdingA = state.holdings[playerAId]?.find(
          (h) => h.symbol === stockToTrade.symbol
        );
        if (holdingA && holdingA.shares >= stockToTrade.shares) {
          holdingA.shares -= stockToTrade.shares;
          if (holdingA.shares === 0) {
            state.holdings[playerAId] = state.holdings[playerAId].filter(
              (h) => h.symbol !== stockToTrade.symbol
            );
          }
        }

        // --- Add stock to Player B ---
        if (!state.holdings[playerBId]) {
          state.holdings[playerBId] = [];
        }
        const holdingB = state.holdings[playerBId].find(
          (h) => h.symbol === stockToTrade.symbol
        );
        if (holdingB) {
          const totalValue =
            holdingB.shares * holdingB.averagePrice +
            stockToTrade.shares * stockToTrade.marketPrice;
          const totalShares = holdingB.shares + stockToTrade.shares;
          holdingB.averagePrice = totalValue / totalShares;
          holdingB.shares = totalShares;
        } else {
          state.holdings[playerBId].push({
            symbol: stockToTrade.symbol,
            shares: stockToTrade.shares,
            averagePrice: stockToTrade.marketPrice,
          });
        }
      });

      // Transfer stocks from Player B to Player A
      playerBItems.stocks.forEach((stockToTrade) => {
        // --- Remove stock from Player B ---
        const holdingB = state.holdings[playerBId]?.find(
          (h) => h.symbol === stockToTrade.symbol
        );
        if (holdingB && holdingB.shares >= stockToTrade.shares) {
          holdingB.shares -= stockToTrade.shares;
          if (holdingB.shares === 0) {
            state.holdings[playerBId] = state.holdings[playerBId].filter(
              (h) => h.symbol !== stockToTrade.symbol
            );
          }
        }

        // --- Add stock to Player A ---
        if (!state.holdings[playerAId]) {
          state.holdings[playerAId] = [];
        }
        const holdingA = state.holdings[playerAId].find(
          (h) => h.symbol === stockToTrade.symbol
        );
        if (holdingA) {
          const totalValue =
            holdingA.shares * holdingA.averagePrice +
            stockToTrade.shares * stockToTrade.marketPrice;
          const totalShares = holdingA.shares + stockToTrade.shares;
          holdingA.averagePrice = totalValue / totalShares;
          holdingA.shares = totalShares;
        } else {
          state.holdings[playerAId].push({
            symbol: stockToTrade.symbol,
            shares: stockToTrade.shares,
            averagePrice: stockToTrade.marketPrice,
          });
        }
      });
    });
  },
  reducers: {
    buyStock: (state, action: PayloadAction<{
      playerID: string;
      symbol: string;
      shares: number;
      price: number;
    }>) => {
      const { playerID, symbol, shares, price } = action.payload;
      
      if (!state.holdings[playerID]) {
        state.holdings[playerID] = [];
      }
      
      const existingHolding = state.holdings[playerID].find((h: StockHolding) => h.symbol === symbol);
      
      if (existingHolding) {
        // Update existing holding
        const totalShares = existingHolding.shares + shares;
        const totalValue = (existingHolding.shares * existingHolding.averagePrice) + (shares * price);
        existingHolding.averagePrice = totalValue / totalShares;
        existingHolding.shares = totalShares;
      } else {
        // Create new holding
        state.holdings[playerID].push({
          symbol,
          shares,
          averagePrice: price
        });
      }
    },
    
    sellStock: (state, action: PayloadAction<{
      playerID: string;
      symbol: string;
      shares: number;
      price: number;
    }>) => {
      const { playerID, symbol, shares } = action.payload;
      
      if (!state.holdings[playerID]) return;
      
      const holding = state.holdings[playerID].find((h: StockHolding) => h.symbol === symbol);
      if (!holding || holding.shares < shares) return;
      
      holding.shares -= shares;
      
      // Remove holding if no shares left
      if (holding.shares === 0) {
        state.holdings[playerID] = state.holdings[playerID].filter((h: StockHolding) => h.symbol !== symbol);
      }
    }
  }
});

export const actions = stocksSlice.actions;
export default stocksSlice.reducer;

// Selectors
export const selectors = {
  selectPlayerHoldings: (playerID: string) => (state: { stocks: StocksState }) => 
    state.stocks.holdings[playerID] || [],
  selectPlayerHolding: (playerID: string, symbol: string) => (state: { stocks: StocksState }) => 
    state.stocks.holdings[playerID]?.find((h: StockHolding) => h.symbol === symbol),
  selectAllHoldings: (state: { stocks: StocksState }) => state.stocks.holdings
}; 
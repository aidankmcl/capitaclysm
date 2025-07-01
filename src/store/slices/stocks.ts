import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StockHolding } from "~/services/stocks";
import { actions as sharedActions } from "./shared";
import { FinalizedTradePayload, StockTrade } from "./trades";

export interface StocksState {
  holdings: Record<string, StockHolding[]>; // playerID -> holdings
  transactionHistory: Array<{
    id: string;
    type: 'buy' | 'sell' | 'trade';
    playerID: string;
    symbol: string;
    shares: number;
    price: number;
    timestamp: number;
  }>;
}

const initialState: StocksState = {
  holdings: {},
  transactionHistory: []
};

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(sharedActions.syncState, (state, action) => {
        const payload = action.payload as any;
        // Handle both full state sync and partial updates
        if (payload.stocks) {
          return payload.stocks;
        }
        return state; // No stocks data in partial update
      })
      .addCase(sharedActions.finalizeTrade, (state, action: PayloadAction<FinalizedTradePayload>) => {
        const { playerAId, playerBId, playerAItems, playerBItems } =
          action.payload;

        // Transfer stocks from Player A to Player B
        playerAItems.stocks.forEach((stockToTrade: StockTrade) => {
          // --- Remove stock from Player A ---
          const holdingAIndex = state.holdings[playerAId]?.findIndex(
            (h: StockHolding) => h.symbol === stockToTrade.symbol
          );
          if (holdingAIndex >= 0) {
            const holdingA = state.holdings[playerAId][holdingAIndex];
            if (holdingA.shares >= stockToTrade.shares) {
              const newShares = holdingA.shares - stockToTrade.shares;
              if (newShares === 0) {
                state.holdings[playerAId] = state.holdings[playerAId].filter(
                  (h: StockHolding) => h.symbol !== stockToTrade.symbol
                );
              } else {
                state.holdings[playerAId][holdingAIndex] = {
                  ...holdingA,
                  shares: newShares
                };
              }
              
              // Record transaction
              state.transactionHistory.push({
                id: `${action.payload.id}-a-to-b-${stockToTrade.symbol}`,
                type: 'trade',
                playerID: playerAId,
                symbol: stockToTrade.symbol,
                shares: stockToTrade.shares,
                price: stockToTrade.marketPrice,
                timestamp: action.payload.timestamp
              });
            }
          }

          // --- Add stock to Player B ---
          if (!state.holdings[playerBId]) {
            state.holdings[playerBId] = [];
          }
          const holdingBIndex = state.holdings[playerBId].findIndex(
            (h) => h.symbol === stockToTrade.symbol
          );
          if (holdingBIndex >= 0) {
            const holdingB = state.holdings[playerBId][holdingBIndex];
            const totalValue =
              holdingB.shares * holdingB.averagePrice +
              stockToTrade.shares * stockToTrade.marketPrice;
            const totalShares = holdingB.shares + stockToTrade.shares;
            state.holdings[playerBId][holdingBIndex] = {
              ...holdingB,
              averagePrice: totalValue / totalShares,
              shares: totalShares
            };
          } else {
            state.holdings[playerBId].push({
              symbol: stockToTrade.symbol,
              shares: stockToTrade.shares,
              averagePrice: stockToTrade.marketPrice,
            });
          }
        });

        // Transfer stocks from Player B to Player A
        playerBItems.stocks.forEach((stockToTrade: StockTrade) => {
          // --- Remove stock from Player B ---
          const holdingBIndex = state.holdings[playerBId]?.findIndex(
            (h: StockHolding) => h.symbol === stockToTrade.symbol
          );
          if (holdingBIndex >= 0) {
            const holdingB = state.holdings[playerBId][holdingBIndex];
            if (holdingB.shares >= stockToTrade.shares) {
              const newShares = holdingB.shares - stockToTrade.shares;
              if (newShares === 0) {
                state.holdings[playerBId] = state.holdings[playerBId].filter(
                  (h: StockHolding) => h.symbol !== stockToTrade.symbol
                );
              } else {
                state.holdings[playerBId][holdingBIndex] = {
                  ...holdingB,
                  shares: newShares
                };
              }
              
              // Record transaction
              state.transactionHistory.push({
                id: `${action.payload.id}-b-to-a-${stockToTrade.symbol}`,
                type: 'trade',
                playerID: playerBId,
                symbol: stockToTrade.symbol,
                shares: stockToTrade.shares,
                price: stockToTrade.marketPrice,
                timestamp: action.payload.timestamp
              });
            }
          }

          // --- Add stock to Player A ---
          if (!state.holdings[playerAId]) {
            state.holdings[playerAId] = [];
          }
          const holdingAIndex = state.holdings[playerAId].findIndex(
            (h: StockHolding) => h.symbol === stockToTrade.symbol
          );
          if (holdingAIndex >= 0) {
            const holdingA = state.holdings[playerAId][holdingAIndex];
            const totalValue =
              holdingA.shares * holdingA.averagePrice +
              stockToTrade.shares * stockToTrade.marketPrice;
            const totalShares = holdingA.shares + stockToTrade.shares;
            state.holdings[playerAId][holdingAIndex] = {
              ...holdingA,
              averagePrice: totalValue / totalShares,
              shares: totalShares
            };
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
      transactionId?: string;
    }>) => {
      const { playerID, symbol, shares, price, transactionId } = action.payload;
      
      if (!state.holdings[playerID]) {
        state.holdings[playerID] = [];
      }
      
      const existingHoldingIndex = state.holdings[playerID].findIndex((h: StockHolding) => h.symbol === symbol);
      
      if (existingHoldingIndex >= 0) {
        // Update existing holding
        const existingHolding = state.holdings[playerID][existingHoldingIndex];
        const totalShares = existingHolding.shares + shares;
        const totalValue = (existingHolding.shares * existingHolding.averagePrice) + (shares * price);
        state.holdings[playerID][existingHoldingIndex] = {
          ...existingHolding,
          averagePrice: totalValue / totalShares,
          shares: totalShares
        };
      } else {
        // Create new holding
        state.holdings[playerID].push({
          symbol,
          shares,
          averagePrice: price
        });
      }
      
      // Record transaction
      state.transactionHistory.push({
        id: transactionId || `buy-${Date.now()}-${symbol}`,
        type: 'buy',
        playerID,
        symbol,
        shares,
        price,
        timestamp: Date.now()
      });
    },
    
    sellStock: (state, action: PayloadAction<{
      playerID: string;
      symbol: string;
      shares: number;
      price: number;
      transactionId?: string;
    }>) => {
      const { playerID, symbol, shares, transactionId } = action.payload;
      
      if (!state.holdings[playerID]) return;
      
      const holdingIndex = state.holdings[playerID].findIndex((h: StockHolding) => h.symbol === symbol);
      if (holdingIndex < 0) return;
      
      const holding = state.holdings[playerID][holdingIndex];
      if (holding.shares < shares) return;
      
      const newShares = holding.shares - shares;
      
      if (newShares === 0) {
        // Remove holding if no shares left
        state.holdings[playerID] = state.holdings[playerID].filter((h: StockHolding) => h.symbol !== symbol);
      } else {
        // Update holding with new share count
        state.holdings[playerID][holdingIndex] = {
          ...holding,
          shares: newShares
        };
      }
      
      // Record transaction
      state.transactionHistory.push({
        id: transactionId || `sell-${Date.now()}-${symbol}`,
        type: 'sell',
        playerID,
        symbol,
        shares,
        price: action.payload.price,
        timestamp: Date.now()
      });
    },
    
    // New action to validate stock transactions
    validateStockTransaction: (_, __: PayloadAction<{
      playerID: string;
      symbol: string;
      shares: number;
      action: 'buy' | 'sell';
    }>) => {
      // This action doesn't modify state, it's for validation purposes
      // The actual validation logic is in the useTransactionValidation hook
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
  selectAllHoldings: (state: { stocks: StocksState }) => state.stocks.holdings,
  
  // New selectors for transaction support
  selectPlayerTransactionHistory: (playerID: string) => (state: { stocks: StocksState }) =>
    state.stocks.transactionHistory.filter(t => t.playerID === playerID),
  selectStockTransactionHistory: (symbol: string) => (state: { stocks: StocksState }) =>
    state.stocks.transactionHistory.filter(t => t.symbol === symbol),
  selectTransactionHistory: (state: { stocks: StocksState }) => state.stocks.transactionHistory,
  
  // Validation selectors
  selectCanBuyStock: (playerID: string, symbol: string, shares: number) => 
    (state: { stocks: StocksState; players: { items: Record<string, { money: number }> } }) => {
      const price = state.stocks.holdings[playerID]?.find((holding: StockHolding) => holding.symbol === symbol)?.averagePrice || 0;
      const player = state.players.items[playerID];
      if (!player) return false;
      return player.money >= shares * price;
    },
  selectCanSellStock: (playerID: string, symbol: string, shares: number) => 
    (state: { stocks: StocksState }) => {
      const holding = state.stocks.holdings[playerID]?.find(h => h.symbol === symbol);
      return holding ? holding.shares >= shares : false;
    }
}; 
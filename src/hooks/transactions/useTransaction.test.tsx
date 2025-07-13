import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';


import { useTransaction } from './useTransaction';
import { actions } from '~/store';
import { locations } from '~/data';
import { StockHolding } from '~/services/stocks';

// Mock the store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      players: (state = {
        items: {
          'player-1': {
            id: 'player-1',
            name: 'Player 1',
            money: 1500,
            ownedPropertyIndices: [1, 2],
            active: true,
            created: Date.now(),
            color: '#ff0000',
            locationIndex: 0,
            icon: 'car'
          },
          'player-2': {
            id: 'player-2',
            name: 'Player 2',
            money: 2000,
            ownedPropertyIndices: [3, 4],
            active: true,
            created: Date.now(),
            color: '#00ff00',
            locationIndex: 0,
            icon: 'iron'
          }
        },
        playerIDs: ['player-1', 'player-2'],
        activePlayerID: 'player-1',
        clientPlayerID: 'player-1'
      }, action: import('@reduxjs/toolkit').AnyAction) => {
        switch (action.type) {
          case actions.shared.purchaseProperty.type:
            const { playerID, price } = action.payload;
            return {
              ...state,
              items: {
                ...state.items,
                [playerID]: {
                  ...state.items[playerID],
                  money: state.items[playerID].money - price,
                  ownedPropertyIndices: [...state.items[playerID].ownedPropertyIndices, action.payload.locationIndex]
                }
              }
            };
          case actions.shared.finalizeTrade.type:
            const { playerAId, playerBId, playerAItems, playerBItems } = action.payload;
            return {
              ...state,
              items: {
                ...state.items,
                [playerAId]: {
                  ...state.items[playerAId],
                  money: state.items[playerAId].money - playerAItems.money + playerBItems.money,
                  ownedPropertyIndices: [
                    ...state.items[playerAId].ownedPropertyIndices.filter((i: number) => !playerAItems.propertyIndices.includes(i)),
                    ...playerBItems.propertyIndices
                  ]
                },
                [playerBId]: {
                  ...state.items[playerBId],
                  money: state.items[playerBId].money - playerBItems.money + playerAItems.money,
                  ownedPropertyIndices: [
                    ...state.items[playerBId].ownedPropertyIndices.filter((i: number) => !playerBItems.propertyIndices.includes(i)),
                    ...playerAItems.propertyIndices
                  ]
                }
              }
            };
          case actions.stocks.buyStock.type:
            const { playerID: buyPlayerID, shares, price: buyPrice } = action.payload;
            const totalCost = shares * buyPrice;
            return {
              ...state,
              items: {
                ...state.items,
                [buyPlayerID]: {
                  ...state.items[buyPlayerID],
                  money: state.items[buyPlayerID].money - totalCost
                }
              }
            };
          case actions.stocks.sellStock.type:
            const { playerID: sellPlayerID, shares: sellShares, price: sellPrice } = action.payload;
            const totalProceeds = sellShares * sellPrice;
            return {
              ...state,
              items: {
                ...state.items,
                [sellPlayerID]: {
                  ...state.items[sellPlayerID],
                  money: state.items[sellPlayerID].money + totalProceeds
                }
              }
            };
          default:
            return state;
        }
      },
      locations: (
        state = {
          items: locations.map((location, index) => ({
            ...location,
            locationIndex: index,
            owners:
              index === 1 || index === 2
                ? [{ ownerID: 'player-1', percentOwnership: 100 }]
                : index === 3 || index === 4
                  ? [{ ownerID: 'player-2', percentOwnership: 100 }]
                  : [],
          })),
        },
        action: import('@reduxjs/toolkit').AnyAction
      ) => {
        switch (action.type) {
          case actions.shared.purchaseProperty.type:
            const { playerID, locationIndex } = action.payload;
            return {
              ...state,
              items: state.items.map((item: Record<string, unknown>, index: number) => 
                index === locationIndex 
                  ? { ...item, owners: [{ ownerID: playerID, percentOwnership: 100 }] }
                  : item
              )
            };
          case actions.shared.finalizeTrade.type:
            const { playerAItems, playerBItems } = action.payload;
            return {
              ...state,
              items: state.items.map((item: Record<string, unknown>, index: number) => {
                if (playerAItems.propertyIndices.includes(index)) {
                  return { ...item, owners: [{ ownerID: 'player-2', percentOwnership: 100 }] };
                }
                if (playerBItems.propertyIndices.includes(index)) {
                  return { ...item, owners: [{ ownerID: 'player-1', percentOwnership: 100 }] };
                }
                return item;
              })
            };
          default:
            return state;
        }
      },
      stocks: (state = {
        holdings: {
          'player-1': [
            { symbol: 'AAPL', shares: 50, averagePrice: 150 }
          ],
          'player-2': [
            { symbol: 'GOOGL', shares: 30, averagePrice: 2500 }
          ]
        },
        transactionHistory: []
      }, action: import('@reduxjs/toolkit').AnyAction) => {
        switch (action.type) {
          case actions.stocks.buyStock.type:
            const { playerID: buyPlayerID, symbol, shares, price: buyPrice, transactionId } = action.payload;
            const buyHoldings = { ...state.holdings };
            if (!buyHoldings[buyPlayerID]) {
              buyHoldings[buyPlayerID] = [];
            }
            
            const existingHoldingIndex = buyHoldings[buyPlayerID].findIndex((h: StockHolding) => h.symbol === symbol);
            
            if (existingHoldingIndex >= 0) {
              // Update existing holding
              const existingHolding = buyHoldings[buyPlayerID][existingHoldingIndex];
              const totalShares = existingHolding.shares + shares;
              const totalValue = (existingHolding.shares * existingHolding.averagePrice) + (shares * buyPrice);
              buyHoldings[buyPlayerID] = [...buyHoldings[buyPlayerID]];
              buyHoldings[buyPlayerID][existingHoldingIndex] = {
                ...existingHolding,
                averagePrice: totalValue / totalShares,
                shares: totalShares
              };
            } else {
              // Create new holding
              buyHoldings[buyPlayerID] = [...buyHoldings[buyPlayerID], {
                symbol,
                shares,
                averagePrice: buyPrice
              }];
            }
            
            // Add transaction to history
            const buyTransactionHistory = [...state.transactionHistory, {
              id: transactionId || `buy-${Date.now()}-${symbol}`,
              type: 'buy',
              playerID: buyPlayerID,
              symbol,
              shares,
              price: buyPrice,
              timestamp: Date.now()
            }];
            
            return {
              ...state,
              holdings: buyHoldings,
              transactionHistory: buyTransactionHistory
            };
          case actions.stocks.sellStock.type:
            const { playerID: sellPlayerID, symbol: sellSymbol, shares: sellShares, price: sellPrice, transactionId: sellTransactionId } = action.payload;
            const sellHoldings = { ...state.holdings };
            const holdingIndex = sellHoldings[sellPlayerID]?.findIndex((h: StockHolding) => h.symbol === sellSymbol);
            if (holdingIndex >= 0) {
              const holding = sellHoldings[sellPlayerID][holdingIndex];
              const newShares = holding.shares - sellShares;
              
              if (newShares === 0) {
                // Remove holding if no shares left
                sellHoldings[sellPlayerID] = sellHoldings[sellPlayerID].filter((h: StockHolding) => h.symbol !== sellSymbol);
              } else {
                // Update holding with new share count
                sellHoldings[sellPlayerID] = [...sellHoldings[sellPlayerID]];
                sellHoldings[sellPlayerID][holdingIndex] = {
                  ...holding,
                  shares: newShares
                };
              }
            }
            
            // Add transaction to history
            const sellTransactionHistory = [...state.transactionHistory, {
              id: sellTransactionId || `sell-${Date.now()}-${sellSymbol}`,
              type: 'sell',
              playerID: sellPlayerID,
              symbol: sellSymbol,
              shares: sellShares,
              price: sellPrice,
              timestamp: Date.now()
            }];
            
            return {
              ...state,
              holdings: sellHoldings,
              transactionHistory: sellTransactionHistory
            };
          default:
            return state;
        }
      },
      trades: (state = { log: [] }, action: import('@reduxjs/toolkit').AnyAction) => {
        switch (action.type) {
          case actions.shared.finalizeTrade.type:
            return {
              ...state,
              log: [...state.log, action.payload]
            };
          default:
            return state;
        }
      }
    },
    preloadedState: initialState
  });
};

// Test wrapper component
const TestWrapper = ({ children, initialState }: { children: React.ReactNode; initialState?: Record<string, unknown> }) => {
  const store = createMockStore(initialState);
  return <Provider store={store}>{children}</Provider>;
};

// Helper to render hook with store
function renderHookWithStore<T>(
  hook: () => T,
  initialState?: Record<string, unknown>
) {
  return renderHook(hook, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <TestWrapper initialState={initialState}>{children}</TestWrapper>
    ),
  });
}

describe('useTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('executePropertyPurchase', () => {
    it('should successfully purchase a property', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executePropertyPurchase(
          'player-1',
          5, // Baltic Avenue (unowned)
          60 // Price
        );

        expect(transactionResult.success).toBe(true);
        expect(transactionResult.transaction).toMatchObject({
          type: 'property-purchase',
          playerID: 'player-1',
          locationIndex: 5,
          price: 60,
          amount: 60
        });
      });
    });

    it('should fail when player has insufficient funds', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executePropertyPurchase(
          'player-1',
          5,
          2000 // More than player has
        );

        expect(transactionResult.success).toBe(false);
        expect(transactionResult.validation?.errors).toContain('Insufficient funds');
      });
    });

    it('should fail when property is already owned', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executePropertyPurchase(
          'player-1',
          1, // Mediterranean Avenue (owned by player-1)
          60
        );

        expect(transactionResult.success).toBe(false);
        expect(transactionResult.validation?.errors).toContain('Property is already owned');
      });
    });

    it('should fail when player does not exist', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executePropertyPurchase(
          'non-existent-player',
          5,
          60
        );

        expect(transactionResult.success).toBe(false);
        expect(transactionResult.validation?.errors).toContain('Player does not exist');
      });
    });
  });

  describe('executeRentPayment', () => {
    it('should successfully pay rent', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executeRentPayment(
          'player-2',
          1, // Mediterranean Avenue (owned by player-1)
          'player-1',
          10 // Rent amount
        );

        expect(transactionResult.success).toBe(true);
        expect(transactionResult.transaction).toMatchObject({
          type: 'rent-payment',
          playerID: 'player-2',
          locationIndex: 1,
          ownerID: 'player-1',
          rentAmount: 10,
          amount: 10
        });
      });
    });

    it('should fail when payer has insufficient funds', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executeRentPayment(
          'player-1',
          3, // States Avenue (owned by player-2)
          'player-2',
          2000 // More than player-1 has
        );

        expect(transactionResult.success).toBe(false);
        expect(transactionResult.validation?.errors).toContain('Insufficient funds for rent payment');
      });
    });
  });

  describe('executeStockTrade', () => {
    it('should successfully buy stocks', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executeStockTrade(
          'player-1',
          'MSFT',
          5,
          200,
          'buy'
        );

        if (!transactionResult.success) {
          console.error('Transaction failed:', transactionResult.validation);
        }

        expect(transactionResult.success).toBe(true);
        expect(transactionResult.transaction).toMatchObject({
          type: 'stock-trade',
          playerID: 'player-1',
          symbol: 'MSFT',
          shares: 5,
          price: 200,
          action: 'buy',
          amount: 1000
        });
      });
    });

    it('should successfully sell stocks', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executeStockTrade(
          'player-1',
          'AAPL',
          20,
          160,
          'sell'
        );

        expect(transactionResult.success).toBe(true);
        expect(transactionResult.transaction).toMatchObject({
          type: 'stock-trade',
          playerID: 'player-1',
          symbol: 'AAPL',
          shares: 20,
          price: 160,
          action: 'sell',
          amount: 3200
        });
      });
    });

    it('should fail when buying with insufficient funds', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executeStockTrade(
          'player-1',
          'MSFT',
          100,
          300,
          'buy'
        );

        expect(transactionResult.success).toBe(false);
        expect(transactionResult.validation?.errors).toContain('Insufficient funds for stock purchase');
      });
    });

    it('should fail when selling more shares than owned', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      act(() => {
        const transactionResult = result.current.executeStockTrade(
          'player-1',
          'AAPL',
          100, // More than the 50 shares owned
          160,
          'sell'
        );

        expect(transactionResult.success).toBe(false);
        expect(transactionResult.validation?.errors).toContain('Insufficient shares to sell');
      });
    });
  });

  describe('validation helpers', () => {
    it('should validate player exists', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      expect(result.current.validatePlayerExists('player-1')).toBe(true);
      expect(result.current.validatePlayerExists('non-existent')).toBe(false);
    });

    it('should validate player has money', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      expect(result.current.validatePlayerHasMoney('player-1', 1000)).toBe(true);
      expect(result.current.validatePlayerHasMoney('player-1', 2000)).toBe(false);
    });

    it('should validate location exists', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      expect(result.current.validateLocationExists(1)).toBe(true);
      expect(result.current.validateLocationExists(999)).toBe(false);
    });

    it('should validate property ownership', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      expect(result.current.validatePropertyOwnership('player-1', 1)).toBe(true);
      expect(result.current.validatePropertyOwnership('player-1', 3)).toBe(false);
    });

    it('should validate stock holdings', () => {
      const { result } = renderHookWithStore(() => useTransaction());

      expect(result.current.validateStockHolding('player-1', 'AAPL', 30)).toBe(true);
      expect(result.current.validateStockHolding('player-1', 'AAPL', 100)).toBe(false);
      expect(result.current.validateStockHolding('player-1', 'NONEXISTENT', 10)).toBe(false);
    });
  });
}); 
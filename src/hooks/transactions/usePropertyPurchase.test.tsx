import { renderHook, act } from '@testing-library/react';
import { usePropertyPurchase } from './usePropertyPurchase';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// ---- Support ----------------------------------------------------------------

import { actions } from '~/store';

// Helper to build minimal state required by selectors
interface MockOptions {
  playerMoney?: number;
  locationOwnedBy?: Record<number, string | null>;
}

const buildMockState = (options: MockOptions = {}) => {
  const { playerMoney = 1000, locationOwnedBy = {} } = options;

  return {
    players: {
      items: {
        p1: { id: 'p1', money: playerMoney },
      },
    },
    locations: {
      items: Array.from({ length: 10 }, (_, idx) => ({
        owners: locationOwnedBy[idx]
          ? [{ ownerID: locationOwnedBy[idx], percentOwnership: 100 }]
          : [],
      })),
    },
    stocks: {
      holdings: {},
    },
  } as Record<string, unknown>;
};

// Render hook with a lightweight Redux store using the supplied state
function renderHookWithState<T>(state: Record<string, unknown>, hook: () => T) {
  const store = configureStore({
    // Cast is safe for testing purposes where we only access limited slices
    reducer: (s: import('~/store').RootState = state as unknown as import('~/store').RootState) => s,
    preloadedState: state as unknown as import('~/store').RootState,
  });

  const dispatchSpy = jest.spyOn(store, 'dispatch');

  const rendered = renderHook(hook, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });

  return { result: rendered.result, dispatchSpy } as const;
}

// -----------------------------------------------------------------------------

describe('usePropertyPurchase', () => {
  it('executes a successful purchase when validation passes', () => {
    const state = buildMockState();

    const { result, dispatchSpy } = renderHookWithState(state, () => usePropertyPurchase());

    act(() => {
      const res = result.current.executePropertyPurchase('p1', 5, 200);
      expect(res.success).toBe(true);
      expect(res.transaction).toMatchObject({
        type: 'property-purchase',
        playerID: 'p1',
        locationIndex: 5,
        price: 200,
        amount: 200,
      });
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      actions.shared.purchaseProperty({
        playerID: 'p1',
        locationIndex: 5,
        price: 200,
      }),
    );
  });

  it('fails when player lacks funds', () => {
    const state = buildMockState({ playerMoney: 50 });

    const { result } = renderHookWithState(state, () => usePropertyPurchase());

    const output = result.current.executePropertyPurchase('p1', 2, 100);

    expect(output.success).toBe(false);
    expect(output.validation?.errors).toContain('Insufficient funds');
  });

  it('fails when property is already owned', () => {
    const state = buildMockState({ locationOwnedBy: { 3: 'someoneelse' } });

    const { result } = renderHookWithState(state, () => usePropertyPurchase());

    const response = result.current.executePropertyPurchase('p1', 3, 180);
    expect(response.success).toBe(false);
    expect(response.validation?.errors).toContain('Property is already owned');
  });

  it('fails when player ID does not exist', () => {
    const state = buildMockState();

    const { result } = renderHookWithState(state, () => usePropertyPurchase());

    const res = result.current.executePropertyPurchase('unknown', 1, 50);
    expect(res.success).toBe(false);
    expect(res.validation?.errors).toContain('Player does not exist');
  });
}); 
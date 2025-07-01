import { Middleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { actions } from "../slices";

export const SYNC_EVENT_NAME = "redux-sync-peers";

// Actions that should trigger state broadcasts to peers
const shouldBroadcastState = isAnyOf(
  // Game state changes
  actions.game.newGame,
  
  // Player changes
  actions.player.addPlayer,
  actions.player.movePlayer,
  actions.player.endTurn,
  actions.player.setActivePlayer,
  
  // Location/property changes
  actions.shared.purchaseProperty,
  actions.shared.finalizeTrade,
  
  // Stock transactions
  actions.stocks.buyStock,
  actions.stocks.sellStock,
  
  // Notifications
  actions.notifications.addNotification
);

const syncChangedSlices = (changedSlices: Record<string, unknown>) => {
  const customEvt = new CustomEvent(SYNC_EVENT_NAME, { detail: changedSlices });
  window.dispatchEvent(customEvt);
};

export const broadcastStateChange: Middleware = (store) => {
  let previousState: RootState = store.getState();

  return (next) => (action) => {
    const result = next(action);
    const nextState: RootState = store.getState();

    // Only broadcast for specific actions and only if host
    if (nextState.game.clientIsHost && shouldBroadcastState(action)) {
      // Use shallow comparison to detect which slices actually changed
      const changedSlices: Record<string, unknown> = {};
      
      // Check each slice for reference equality (Immer/RTK guarantees this)
      const sliceKeys = Object.keys(nextState) as (keyof RootState)[];
      
      for (const sliceKey of sliceKeys) {
        if (nextState[sliceKey] !== previousState[sliceKey]) {
          // Type assertion is safe because we're assigning a known slice.
          changedSlices[sliceKey as string] = nextState[sliceKey];
        }
      }
      
      // Only broadcast if something actually changed
      if (Object.keys(changedSlices).length > 0) {
        console.log(`Broadcasting changed slices:`, Object.keys(changedSlices));
        syncChangedSlices(changedSlices);
      }
    }

    previousState = nextState;
    return result;
  };
};

import { configureStore } from "@reduxjs/toolkit";

import gamesReducer from "./slices/game";
import locationReducer from "./slices/locations";
import playerReducer from "./slices/players";
import savesReducer from "./slices/saves";
import notificationsReducer from "./slices/notifications";
import stocksReducer from "./slices/stocks";
import tradesReducer from "./slices/trades";
import sharedSliceReducer from "./slices/shared";

import { forwardActionsToHost, broadcastStateChange } from "./middlewares";
import { listenerMiddleware } from "./listeners";

export const store = configureStore({
  reducer: {
    game: gamesReducer,
    locations: locationReducer,
    players: playerReducer,
    saves: savesReducer,
    notifications: notificationsReducer,
    stocks: stocksReducer,
    trades: tradesReducer,
    shared: sharedSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(forwardActionsToHost, listenerMiddleware.middleware)
      .concat(broadcastStateChange),
  devTools: process.env.NODE_ENV !== "production" ? { trace: true } : false,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

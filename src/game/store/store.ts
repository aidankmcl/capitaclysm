import { configureStore } from '@reduxjs/toolkit';

import gamesReducer from './slices/game';
import locationReducer from './slices/locations';
import playerReducer from './slices/players';
import savesReducer from './slices/saves';
import notificationsReducer from './slices/notifications';
import dealsReducer from './slices/deals';

import { forwardActionsToHost, broadcastStateChange } from './middlewares';
import { listenerMiddleware } from './listeners';


export const store = configureStore({
  reducer: {
    game: gamesReducer,
    locations: locationReducer,
    players: playerReducer,
    saves: savesReducer,
    notifications: notificationsReducer,
    deals: dealsReducer
  },
  middleware: (getDefaultMiddleware) => [forwardActionsToHost, listenerMiddleware.middleware, ...getDefaultMiddleware(), broadcastStateChange]
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

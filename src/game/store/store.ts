import { configureStore } from '@reduxjs/toolkit';

import gamesReducer from './slices/game';
import locationReducer from './slices/location';
import playerReducer from './slices/player';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    locations: locationReducer,
    players: playerReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

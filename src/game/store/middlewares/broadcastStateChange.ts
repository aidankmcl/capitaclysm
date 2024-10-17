import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const SYNC_EVENT_NAME = 'redux-sync-peers';

const syncEvent = (state: RootState) => {
  const customEvt = new CustomEvent(SYNC_EVENT_NAME, { detail: state });
  window.dispatchEvent(customEvt);
};

export const broadcastStateChange: Middleware = store => next => action => {
  const result = next(action);
  const nextState: RootState = store.getState();

  if (nextState.game.clientIsHost) {
    syncEvent(nextState);
  }

  return result;
};

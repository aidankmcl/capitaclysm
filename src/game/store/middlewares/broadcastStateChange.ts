import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const SYNC_EVENT_NAME = 'redux-sync-peers';

const syncEvent = (state: RootState) => {
  console.log('syncing', { state });
  const customEvt = new CustomEvent(SYNC_EVENT_NAME, { detail: state });
  window.dispatchEvent(customEvt);
};

const timerLabel = 'grab states and resolve action';

export const broadcastStateChange: Middleware = store => next => action => {
  console.group('broadcast', action.type);
  console.time(timerLabel);

  const result = next(action);
  const nextState: RootState = store.getState();

  if (nextState.game.clientIsHost) {
    syncEvent(nextState);
  }

  console.timeEnd(timerLabel);
  console.groupEnd();
  return result;
};

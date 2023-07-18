import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const SYNC_EVENT_NAME = 'redux-sync-peers';

const syncEvent = (state: RootState) => {
  const customEvt = new CustomEvent(SYNC_EVENT_NAME, { detail: state });
  window.dispatchEvent(customEvt);
};

const timerLabel = 'grab states and resolve action';

export const syncPeers: Middleware = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  console.time(timerLabel);
  const originalState = store.getState() as RootState;
  const result = next(action);
  const nextState = store.getState();
  console.timeEnd(timerLabel);
  if (originalState.games.clientIsHost) syncEvent(nextState);
  console.groupEnd();
  return result;
};

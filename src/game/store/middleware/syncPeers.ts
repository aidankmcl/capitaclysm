import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const SYNC_EVENT_NAME = 'redux-sync-peers';

const syncEvent = (state: RootState) => {
  const customEvt = new CustomEvent(SYNC_EVENT_NAME, { detail: state });
  window.dispatchEvent(customEvt);
};

export const syncPeers: Middleware = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  const nextState = store.getState();
  console.log('next state', nextState);
  syncEvent(nextState);
  console.groupEnd();
  return result;
};

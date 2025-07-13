import { Action, Middleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { actions } from "../slices";

export const FORWARD_ACTION_EVENT_NAME = "redux-send-upstream";

const sendEventUpstream = (action: Action) => {
  const customEvt = new CustomEvent(FORWARD_ACTION_EVENT_NAME, { detail: action });
  window.dispatchEvent(customEvt);
};

// Some actions we do want to process locally and not forward
const isLocalAction = isAnyOf(
  actions.game.setHost,
  actions.shared.syncState,
  actions.player.setClientPlayer
);

/** This middleware comes before redux-sagas middleware to forward all action processing to game host */
export const forwardActionsToHost: Middleware = store => next => (action: unknown) => {
  const originalState = store.getState() as RootState;
  const isHost = originalState.game.clientIsHost;
  let result;

  // If a client, don't act on action
  if (isHost || isLocalAction(action as Action)) {
    result = next(action);
  } else if (!originalState.game.clientIsHost) {
    sendEventUpstream(action as Action);
  }

  return result;
};

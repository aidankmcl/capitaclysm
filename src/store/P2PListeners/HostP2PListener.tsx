import { useEffect } from "react";
import { AnyAction } from "@reduxjs/toolkit";

import { createCallback, createDataCallback, usePeer } from "~/services/p2p";
import { useOnce } from "~/hooks";
import { FORWARD_ACTION_EVENT_NAME, actions, selectors, useAppDispatch, useAppSelector } from "..";
import { ConnectionEvent } from "~/services/p2p/events";

export const HostP2PListener = () => {
  const dispatch = useAppDispatch();

  const players = useAppSelector(selectors.players.selectPlayers);
  const clientPlayerID = useAppSelector(selectors.players.selectClientPlayerID);
  const isHostRedux = useAppSelector(selectors.game.isHost);

  const { code, addCallbacks, isHost, setHost } = usePeer();

  const onConnection = (data: CustomEvent<ConnectionEvent>) => {
    const connID = data.detail.connection.connectionId;
    if (!data.detail.connection.open) {
      dispatch(actions.player.togglePlayer({ connectionID: connID, active: false }));
    } else {
      dispatch(actions.player.addPlayer({ connectionID: connID, name: data.detail.connection.label }));
    }
  };

  const childOpenCB = createCallback("child", "open", onConnection);
  const childCloseCB = createCallback("child", "close", onConnection);

  // useOnce waits for undefined values to be defined, regardless of truthiness
  const hostCheck = isHost && isHostRedux ? true : undefined;

  useOnce(() => {
    if (code && hostCheck) {
      addCallbacks([childOpenCB, childCloseCB]);
      dispatch(actions.game.newGame()); // TODO: Remove when there's a button to begin game
      dispatch(actions.player.addPlayer({ connectionID: "123", name: "Mr. Monopoly" }));
    }
  }, [dispatch, addCallbacks, code, hostCheck]);

  useEffect(() => {
    if (code && !clientPlayerID) {
      const hostPlayer = players.find((player) => player.id === "123");
      if (hostPlayer) dispatch(actions.player.setClientPlayer(hostPlayer.id));
    }
  }, [dispatch, clientPlayerID, players, code]);

  const childActions = createDataCallback("child", FORWARD_ACTION_EVENT_NAME, (data) => {
    console.log("received child action", data);
    dispatch(data as AnyAction); // The origin of this data can only be an action creator
  });

  useOnce(() => {
    setHost(true);
    dispatch(actions.game.setHost(true));
    addCallbacks([childActions]);
  }, [dispatch, addCallbacks]);

  return <></>;
};

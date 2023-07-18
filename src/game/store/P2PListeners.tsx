import { DataConnection } from 'peerjs';

import { createCallback, createDataCallback, usePeer } from '~/services/p2p';
import { useOnce } from '~/components';
import { actions, selectors, useAppDispatch, useAppSelector } from '.';
import { useEffect } from 'react';

const hostPlayerID = '123'; // Need to update to be able to set this

export const HostP2PListener = () => {
  const dispatch = useAppDispatch();
  const players = useAppSelector(selectors.player.selectPlayers);
  const clientPlayerID = useAppSelector(selectors.player.selectClientPlayerID);

  const { addCallbacks, setHost } = usePeer();

  const moveCB = createDataCallback('child', 'move', (data) => {
    dispatch(actions.player.movePlayer(data));
  });

  const onConnection = (data: { connection: DataConnection }) => {
    const connID = data.connection.connectionId;
    if (!data.connection.open) {
      dispatch(actions.player.togglePlayer({ connectionID: connID, active: false }));
    } else {
      dispatch(actions.player.addPlayer({ connectionID: connID, name: data.connection.label }));
    }
  };

  const childOpenCB = createCallback('child', 'open', onConnection);
  const childCloseCB = createCallback('child', 'close', onConnection);

  useOnce(() => {
    addCallbacks([childOpenCB, childCloseCB]);
    dispatch(actions.game.newGame());
    dispatch(actions.player.addPlayer({ connectionID: hostPlayerID, name: 'Mr. Monopoly' }));
  }, [dispatch, addCallbacks]);

  useEffect(() => {
    if (!clientPlayerID) {
      const hostPlayer = players.find(player => player.id === hostPlayerID);
      if (hostPlayer) dispatch(actions.player.setClientPlayer(hostPlayer.id));
    }
  }, [players])

  useOnce(() => {
    dispatch(actions.game.setHost(true));
    setHost(true);
    addCallbacks([moveCB]);
  }, [dispatch, addCallbacks]);
  
  return <></>;
};

export const ClientP2PListener = () => {
  const dispatch = useAppDispatch();
  const { addCallbacks } = usePeer();

  const syncCB = createDataCallback('client', 'redux-sync-peers', (data) => {
    dispatch(actions.shared.syncState(data));
  });

  useOnce(() => {
    addCallbacks([syncCB]);
  }, [addCallbacks]);

  return <></>;
};

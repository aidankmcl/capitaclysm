import { createDataCallback, usePeer } from '~/services/p2p';
import { actions, useAppDispatch } from '.';

export const HostP2PListener = () => {
  const dispatch = useAppDispatch();

  const moveCB = createDataCallback('child', 'move', (data) => {
    dispatch(actions.player.movePlayer(data));
  });

  usePeer([moveCB]);

  return <></>;
};

export const ClientP2PListener = () => {
  const dispatch = useAppDispatch();

  const syncCB = createDataCallback('client', 'redux-sync-peers', (data) => {
    dispatch(actions.game.sync(data.games));
    dispatch(actions.location.sync(data.locations));
    dispatch(actions.player.sync(data.players));
  });

  usePeer([syncCB]);

  return <></>;
};


import { createDataCallback, usePeer } from '~/services/p2p';
import { actions, useAppDispatch } from '.';
import { useOnce } from '~/components';

export const HostP2PListener = () => {
  const dispatch = useAppDispatch();
  const { addCallbacks } = usePeer();

  const moveCB = createDataCallback('child', 'move', (data) => {
    dispatch(actions.player.movePlayer(data));
  });

  useOnce(() => {
    dispatch(actions.game.setHost(true));
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

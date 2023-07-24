
import { createDataCallback, usePeer } from '~/services/p2p';
import { useOnce } from '~/components';
import { SYNC_EVENT_NAME, actions, useAppDispatch } from '..';


export const ClientP2PListener = () => {
  const dispatch = useAppDispatch();
  const { addCallbacks } = usePeer();

  const syncCB = createDataCallback('client', SYNC_EVENT_NAME, (data) => {
    dispatch(actions.shared.syncState(data));
  });

  useOnce(() => {
    addCallbacks([syncCB]);
  }, [addCallbacks]);

  return <></>;
};

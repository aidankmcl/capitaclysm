import { createDataCallback, usePeer } from "~/services/p2p";
import { useOnce } from "~/hooks";
import { SYNC_EVENT_NAME, actions, useAppDispatch } from "..";


export const ClientP2PListener = () => {
  const dispatch = useAppDispatch();
  const { addCallbacks } = usePeer();

  const syncCB = createDataCallback("client", SYNC_EVENT_NAME, (data) => {
    if (data && typeof data === 'object') {
      const keys = Object.keys(data);
      
      // Heuristic: if it has most/all slices, treat as full state sync
      // Otherwise, treat as partial update
      const hasMultipleSlices = keys.length >= 3;
      const hasGameSlice = keys.includes('game');
      const hasPlayersSlice = keys.includes('players');
      
      if (hasMultipleSlices && hasGameSlice && hasPlayersSlice) {
        // Full state sync (initial connection)
        dispatch(actions.shared.syncState(data));
      } else {
        // Partial state update - merge with current state
        // This dispatches to all slices that listen for syncState
        // but only the changed slices will be included in the payload
        dispatch(actions.shared.syncState(data));
      }
    }
  });

  useOnce(() => {
    addCallbacks([syncCB]);
  }, [addCallbacks]);

  return <></>;
};

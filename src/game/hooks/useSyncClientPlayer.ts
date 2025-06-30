import { useEffect } from "react";

import { usePeer } from "~/services/p2p";
import { actions, selectors, useAppDispatch, useAppSelector } from "~/store";

export const useSyncClientPlayer = () => {
  const dispatch = useAppDispatch();
  const { connection } = usePeer();
  const players = useAppSelector(selectors.players.selectPlayers);
  const clientPlayerID = useAppSelector(selectors.players.selectClientPlayerID);

  useEffect(() => {
    if (connection && players.length && !clientPlayerID) {
      const myPlayer = players.find(
        (player) => player.name === connection.label
      );
      if (myPlayer) {
        dispatch(actions.player.setClientPlayer(myPlayer.id));
      }
    }
  }, [connection, players, clientPlayerID, dispatch]);
}; 
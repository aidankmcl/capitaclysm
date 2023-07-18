
import { useEffect } from 'react';

import { actions, selectors, useAppDispatch, useAppSelector, ClientP2PListener } from '~/store';
import { usePeer } from '~/services/p2p';
import { Gamegrid } from '~/components';

import { Map } from '../components/map';
import { ManageClientConnection } from './ManageClientConnection';


export const ClientView = () => {
  const dispatch = useAppDispatch();

  const { connection, sendData } = usePeer();

  const players = useAppSelector(selectors.player.selectPlayers);
  const activePlayerID = useAppSelector(selectors.player.selectActivePlayerID);
  const clientPlayerID = useAppSelector(selectors.player.selectClientPlayerID);

  useEffect(() => {
    if (connection && players.length && !clientPlayerID) {
      const myPlayer = players.find(player => player.name === connection.label);
      if (myPlayer) dispatch(actions.player.setClientPlayer(myPlayer.id));
    }
  }, [connection, players, dispatch]);

  const sendMove = () => clientPlayerID && sendData('move', {
    playerID: clientPlayerID,
    steps: Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6)
  });

  return (
    <Gamegrid
      map={<Map />}
      manage={<ManageClientConnection />}
      content={connection && (
        <button disabled={activePlayerID !== clientPlayerID} onClick={sendMove}>Move</button>
      )}
    >
      <ClientP2PListener />
    </Gamegrid>
  );
};

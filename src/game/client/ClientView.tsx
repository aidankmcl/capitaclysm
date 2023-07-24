
import { useEffect } from 'react';

import { actions, selectors, useAppDispatch, useAppSelector, ClientP2PListener } from '~/store';
import { usePeer } from '~/services/p2p';

import { Gamegrid } from '../components/layout';
import { Map } from '../components/map';
import { Controls } from '../components/controls';

import { ManageClientConnection } from './ManageClientConnection';


export const ClientView = () => {
  const dispatch = useAppDispatch();

  const { connection } = usePeer();

  const players = useAppSelector(selectors.players.selectPlayers);
  const clientPlayerID = useAppSelector(selectors.players.selectClientPlayerID);

  useEffect(() => {
    if (connection && players.length && !clientPlayerID) {
      const myPlayer = players.find(player => player.name === connection.label);
      if (myPlayer) dispatch(actions.player.setClientPlayer(myPlayer.id));
    }
  }, [connection, players, dispatch]);

  return (
    <Gamegrid
      map={<Map />}
      manage={<ManageClientConnection />}
      content={<Controls />}
    >
      <ClientP2PListener />
    </Gamegrid>
  );
};


import { FC } from 'react';
import { DataConnection } from 'peerjs';

import { HostP2PListener, actions, useAppDispatch } from '~/store';
import { createCallback, createDataCallback, usePeer } from '~/services/p2p';
import { Gamegrid, useOnce } from '~/components';

import { Map } from '../components/map';
import { PlayerList } from '../components/players';


export const HostView: FC = () => {
  const dispatch = useAppDispatch();

  const onConnection = (data: { connection: DataConnection }) => {
    const connID = data.connection.connectionId;
    if (!data.connection.open) {
      dispatch(actions.player.togglePlayer({ connectionID: connID, active: false }));
    } else {
      dispatch(actions.player.addPlayer({ connectionID: connID, name: data.connection.label }));
    }
  };

  const hostCB = createCallback('host', 'open', (data) => { console.log('host cb open:', data); });
  const childOpenCB = createCallback('child', 'open', onConnection);
  const childCloseCB = createCallback('child', 'close', onConnection);
  const clientCB = createCallback('client', 'open', (data) => { console.log('client cb open:', data); });
  const dataCB = createDataCallback('child', 'move', (data) => { console.log('PLACES EVERYONE!!', data.steps); });

  const { code, addCallbacks } = usePeer();

  useOnce(() => {
    addCallbacks([hostCB, childOpenCB, childCloseCB, clientCB, dataCB]);
    dispatch(actions.game.newGame());
    dispatch(actions.player.addPlayer({ connectionID: '123', name: 'cops' }));
  }, [dispatch, addCallbacks]);

  return (
    <Gamegrid
      map={<Map />}
      manage={(<>
        <h2>{code}</h2>
      </>)}
      content={<>
        <PlayerList />
      </>}
    >
      <HostP2PListener />
    </Gamegrid>
  );
};

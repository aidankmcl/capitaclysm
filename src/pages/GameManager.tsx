import { useEffect, useState } from 'react';
import { DataConnection } from 'peerjs';

import { createCallback, createDataCallback, usePeer } from '../services/p2p';
import { Layout } from '../components';
import { Game } from '../game';
import { useAppDispatch, useAppSelector } from '../game/store/hooks';
import { actions, selectors } from '../game/store';

export const GameManager = () => {
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [gameActive, setGameActive] = useState(false);

  const dispatch = useAppDispatch();
  const gameID = useAppSelector(selectors.game.selectActiveGameID);
  const players = useAppSelector(selectors.player.selectPlayers);

  console.log(gameID, players);

  useEffect(() => {
    if (gameID) {
      dispatch(actions.location.newGame(gameID));
      connections.forEach(conn => {
        dispatch(actions.player.addPlayer({ name: conn.label, gameID }));
      });
    }
  }, [gameID]);

  useEffect(() => {
    if (gameActive && !gameID) {
      dispatch(actions.game.newGame());
    }
  }, [gameActive]);

  const onConnection = (data: { connection: DataConnection }) => {
    setConnections((connections) => {
      if (!data.connection.open) {
        return connections.filter(conn => conn.connectionId !== data.connection.connectionId);
      }
      return [...connections, data.connection];
    });
  };

  const hostCB = createCallback('host', 'open', (data) => { console.log('host cb open:', data); });
  const childOpenCB = createCallback('child', 'open', onConnection);
  const childCloseCB = createCallback('child', 'close', onConnection);
  const clientCB = createCallback('client', 'open', (data) => { console.log('client cb open:', data); });

  const dataCB = createDataCallback('child', 'move', (data) => { console.log('PLACES EVERYONE!!', data.steps); });

  const { code } = usePeer([hostCB, childOpenCB, childCloseCB, clientCB, dataCB]);

  const closeGame = () => setGameActive(false);

  return <Layout>
    <h1>Host</h1>
    <p>ID: {code}</p>
    
    {connections.length > 0 && (!gameActive) ? (
      <div>
        <button onClick={() => setGameActive(true)}>Start Game</button>

        <h2>Connections</h2>
        <ul>
          {connections.map((conn, i) => <li key={i}>{conn.label}</li>)}
        </ul>
      </div>
    ) : (
      gameActive && <Game close={closeGame} />
    )}
  </Layout>;
};

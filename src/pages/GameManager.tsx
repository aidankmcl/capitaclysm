import { useEffect, useState } from 'react';
import { DataConnection } from 'peerjs';

import { Host } from '../services/p2p';
import { Layout } from '../components';
import { Game } from '../game';

export const GameManager = () => {

  const [host, setHost] = useState<Host>();

  const [connected, setConnected] = useState(false);
  const [hostID, setHostID] = useState<string>();
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [gameActive, setGameActive] = useState(false);

  const onOpen = (connID: string) => {
    const lastChunk = connID.split('-').slice(-1).join('');
    setConnected(true);
    setHostID(lastChunk);
  };

  const onConnection = (connection: DataConnection, remove = false) => {
    setConnections((connections) => {
      if (remove) {
        return connections.filter(conn => conn.connectionId !== connection.connectionId);
      }
      return [...connections, connection];
    });
  };

  const closeGame = () => setGameActive(false);

  useEffect(() => {
    if (!connected) {
      setHost(new Host({
        onOpen,
        onConnection,
        onClose: () => console.log('closed')
      }));
      setConnected(true);
    }
  }, [connected]);

  return <Layout>
    <h1>Host</h1>
    <p>ID: {hostID}</p>
    
    {connections.length > 0 && (!gameActive) ? (
      <div>
        <button onClick={() => setGameActive(true)}>Start Game</button>

        <h2>Connections</h2>
        <ul>
          {connections.map((conn, i) => <li key={i}>{conn.label}</li>)}
        </ul>
      </div>
    ) : (
      gameActive && host && <Game close={closeGame} host={host} />
    )}
  </Layout>;
};

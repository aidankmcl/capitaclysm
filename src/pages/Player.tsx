import { useState, useEffect } from 'react';

import { Client } from '../services/p2p';
import { Layout } from '../components';

export const Player = () => {

  const [hostIDInput, setHostIDInput] = useState('');
  const [clientName, setClientName] = useState('');

  const [peer, setPeer] = useState<Client>();
  const [connected, setConnected] = useState<boolean>(false);

  const connect = (id: string) => {
    if (!id) return;

    console.log(id, peer, connected);
    if (peer && !connected) {
      peer.connect(id, clientName);
      setConnected(true);
    }
  };

  const disconnect = () => {
    if (peer) {
      peer.disconnect();
      setConnected(false);
    }
  };

  useEffect(() => {
    if (!peer) {
      setPeer(new Client({
        onOpen: (connID) => console.log(connID),
        onConnection: (connection) => console.log(connection),
        onClose: () => console.log('closed')
      }));
    }
  }, [peer]);

  return <Layout>
    <h1>Client</h1>
    {!connected ? (
      <div>
        <div style={{ textAlign: 'left' }}>
          <label>
            Host ID<br/>
            <input
              type="text"
              value={hostIDInput}
              onChange={(evt) => setHostIDInput(evt.target.value)}
              style={{ width: '100%' }}
            />
          </label><br/>
          <br/>
          <label>
            Name<br/>
            <input
              type="text"
              placeholder="Min 3 characters"
              value={clientName}
              onChange={(evt) => setClientName(evt.target.value)}
              style={{ width: '100%' }}
            />
          </label><br/>
        </div>

        <button
          style={{ marginTop: 20 }}
          disabled={clientName.length < 3}
          onClick={() => hostIDInput && connect(hostIDInput)}
        >
          Connect
        </button>
      </div>
    ) : (
      <div>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )}
  </Layout>;
};

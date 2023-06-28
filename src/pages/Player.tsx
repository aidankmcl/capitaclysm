import { useState } from 'react';

import { usePeer } from '../services/p2p';
import { Layout } from '../components';

export const Player = () => {

  const { connect, connection, disconnect, sendData } = usePeer();

  const [hostIDInput, setHostIDInput] = useState('');
  const [clientName, setClientName] = useState('');


  return <Layout>
    <h1>Client</h1>
    {!connection ? (
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
          onClick={() => hostIDInput && connect(hostIDInput, clientName)}
        >
          Connect
        </button>
      </div>
    ) : (
      <div>
        <button onClick={() => sendData('move', { places: 1 })}>Data!</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )}
  </Layout>;
};

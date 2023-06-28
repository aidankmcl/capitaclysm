import { useState } from 'react';

import { usePeer, createCallback, createDataCallback } from '../services/p2p';
import { Layout } from '../components';
import {  } from '../services/p2p/events';
// import { SubTest } from '../components/SubTest';

export const Test = () => {

  const hostCB = createCallback('host', 'open', (data) => { console.log('host cb open:', data); });
  const childCB = createCallback('child', 'open', (data: unknown) => { console.log('child cb open:', data); });
  const clientCB = createCallback('client', 'open', (data: unknown) => { console.log('client cb open:', data); });

  const dataCB = createDataCallback('child', 'move', (data) => { console.log('PLACES EVERYONE!!', data.places); });

  const { code, connect, connection, sendData } = usePeer([hostCB, childCB, clientCB, dataCB]);

  const [peerName, setPeerName] = useState('');
  const [hostCodeInput, setHostCodeInput] = useState('');

  return <Layout>
    <h1>Test</h1>
    <p>{code}</p>
    {/* <SubTest hostCode={hostCodeInput} name={peerName} /> */}
    <input type="text" onChange={(evt) => setPeerName(evt.target.value)} value={peerName} />
    <input type="text" onChange={(evt) => setHostCodeInput(evt.target.value)} value={hostCodeInput} />
    {hostCodeInput && peerName && (
      <button onClick={() => connect(hostCodeInput, peerName)}>Connect</button>
    )}
    {connection && (
      <button onClick={() => sendData('move', { places: 1 })}>Data!</button>
    )}
  </Layout>;
};

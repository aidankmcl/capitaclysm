import { useEffect, useState } from 'react';

import { actions, selectors, useAppDispatch, useAppSelector } from '~/store';

import { usePeer } from '../services/p2p';
import { Layout } from '../components';
import { ClientP2PListener } from '~/store';

export const Player = () => {
  const dispatch = useAppDispatch();

  const players = useAppSelector(selectors.player.selectPlayers);
  const activePlayerID = useAppSelector(selectors.player.selectActivePlayerID);

  const { connect, connection, disconnect, sendData } = usePeer();

  const [hostIDInput, setHostIDInput] = useState('');
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    if (connection && players.length) {
      dispatch(actions.player.setPlayer(players[0].id));
    }
  }, [connection, players]);

  const sendMove = () => activePlayerID && sendData('move', {
    playerID: activePlayerID,
    steps: Math.ceil(Math.random() * 12)
  });


  return <Layout>
    <ClientP2PListener />
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
        {activePlayerID && <h2>{activePlayerID}</h2>}
        <button onClick={sendMove}>Data!</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )}
  </Layout>;
};


import { useState } from 'react';
import { Stack } from '@mui/joy';

import { selectors, useAppSelector } from '~/store';
import { usePeer } from '~/services/p2p';
import { Input, Button } from '~/components';


export const ManageClientConnection = () => {
  const clientPlayerID = useAppSelector(selectors.players.selectClientPlayerID);

  const { connect, connection, disconnect } = usePeer();

  const [hostIDInput, setHostIDInput] = useState('');
  const [clientName, setClientName] = useState('');

  return (!connection ? (
    <Stack direction="column" spacing={2}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} justifyContent="space-between">
        <Input
          label="Host Code"
          placeholder="4 character code"
          value={hostIDInput}
          onChange={(evt) => setHostIDInput(evt.target.value)}
          sx={{ flex: 1 }}
        />

        <Input
          label="Player Name"
          placeholder="Min 3 characters"
          value={clientName}
          onChange={(evt) => setClientName(evt.target.value)}
          sx={{ flex: 1 }}
        />
      </Stack>

      <Button
        variant="solid"
        disabled={clientName.length < 3}
        onClick={() => hostIDInput && connect(hostIDInput, clientName)}
      >
        Connect
      </Button>
    </Stack>
  ) : (
    <div>
      {clientPlayerID && <h2>{clientPlayerID}</h2>}
      <button onClick={disconnect}>Disconnect</button>
    </div>
  ));
};

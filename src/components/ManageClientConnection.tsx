import { useState } from "react";
import { Typography, Button, Input } from "~/ui";

import { usePeer } from "~/services/p2p";


export const ManageClientConnection = () => {
  const { connect, connection, disconnect } = usePeer();

  const [hostIDInput, setHostIDInput] = useState("");
  const [clientName, setClientName] = useState("");

  // Helper to derive the host code when a connection exists. The peer ID that
  // we receive from PeerJS includes a long prefix (see `getConnectionID`).
  // Stripping everything before the final '-' gives us the 4-character code
  // originally generated on the host.
  const connectedHostCode = connection?.peer
    ? connection.peer.split("-").pop()
    : undefined;

  return (!connection ? (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col lg:flex-row gap-2 justify-between">
        <Input
          label="Host Code"
          placeholder="4 character code"
          value={hostIDInput}
          onChange={(evt) => setHostIDInput(evt.target.value)}
          className="flex-1"
        />

        <Input
          label="Player Name"
          placeholder="Min 3 characters"
          value={clientName}
          onChange={(evt) => setClientName(evt.target.value)}
          className="flex-1"
        />
      </div>

      {/* Surface the host code next to the inputs so players can double-check
          the ID they are joining. */}
      {hostIDInput && (
        <Typography level="body-sm" className="font-mono text-center">
          Host ID: {hostIDInput}
        </Typography>
      )}

      <Button
        variant="solid"
        disabled={clientName.length < 3}
        onClick={() => hostIDInput && connect(hostIDInput, clientName)}
      >
        Connect
      </Button>
    </div>
  ) : (
    <div className="flex flex-col gap-2 items-center">
      {/* After a successful connection, we now show the host's ID rather than the
          client's own ID to make it clear who we are connected to. */}
      {connectedHostCode && (
        <Typography level="h4" className="text-center font-mono">
          Host: {connectedHostCode}
        </Typography>
      )}
      <Button variant="outlined" onClick={disconnect}>
        Disconnect
      </Button>
    </div>
  ));
};

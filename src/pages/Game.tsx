import { FC } from "react";

import { HostP2PListener, ClientP2PListener } from "~/store";
import { usePeer } from "~/services/p2p";

import { Gamegrid } from "~/ui";
import { Controls } from "~/components/controls";
import { DealModalProvider } from "~/components/controls";
import { ManageClientConnection } from "~/components/ManageClientConnection";
import { useSyncClientPlayer } from "~/hooks";
import { Layout } from "~/ui";

const ClientLogic: FC = () => {
  useSyncClientPlayer();
  return null;
};

export const Game: FC = () => {
  const { code, isHost } = usePeer();

  return (
    <Layout>
      {!isHost && <ClientLogic />}
      <Gamegrid
        map={<div>Map placeholder - will be replaced with new mapping solution</div>}
        manage={isHost ? <h2>{code}</h2> : <ManageClientConnection />}
        content={<Controls />}
      >
        {isHost ? (
          <>
            <DealModalProvider />
            <HostP2PListener />
          </>
        ) : (
          <ClientP2PListener />
        )}
      </Gamegrid>
    </Layout>
  );
}; 
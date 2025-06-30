import { FC } from "react";

import { HostP2PListener, ClientP2PListener } from "~/store";
import { usePeer } from "~/services/p2p";

import { Gamegrid } from "../components/layout";
import { Map } from "../components/map";
import { Controls } from "../components/controls";
import { DealModalProvider } from "../components/controls";
import { ManageClientConnection } from "../components/ManageClientConnection";
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
        map={<Map />}
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
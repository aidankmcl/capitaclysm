import { FC, useState } from "react";

import { HostP2PListener, ClientP2PListener } from "~/store";
import { usePeer } from "~/services/p2p";

import { PhoneScreen, StatusBar, HomeScreen, NavigationBar, AppContainer } from "~/ui";
import { useSyncClientPlayer } from "~/hooks";
import { Layout } from "~/ui";

const ClientLogic: FC = () => {
  useSyncClientPlayer();
  return null;
};

export const Game: FC = () => {
  const { isHost } = usePeer();
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [isHomeScreen, setIsHomeScreen] = useState(true);

  const handleAppSelect = (appId: string) => {
    setCurrentApp(appId);
    setIsHomeScreen(false);
  };

  const handleCloseApp = () => {
    setCurrentApp(null);
    setIsHomeScreen(true);
  };

  return (
    <Layout>
      {!isHost && <ClientLogic />}
      
      <div className="flex items-center justify-center min-h-screen p-8">
        <PhoneScreen>
          <StatusBar />
          
          {isHomeScreen ? (
            <HomeScreen onAppSelect={handleAppSelect} />
          ) : (
            <AppContainer appId={currentApp} onClose={handleCloseApp} />
          )}
          
          <NavigationBar onHomePress={handleCloseApp} />
        </PhoneScreen>
      </div>
      
      {isHost ? <HostP2PListener /> : <ClientP2PListener />}
    </Layout>
  );
}; 
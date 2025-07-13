import { FC } from "react";

import { selectors, useAppSelector } from "~/store";
import { Tabs } from "~/ui";

import { PlayerList } from "./PlayerList";
import { Move } from "./Move";
import { PropertiesList } from "./PropertiesList";
import { Gambling } from "../stocks";

export const Controls: FC = () => {
  const activePlayerID = useAppSelector(selectors.players.selectActivePlayerID);
  const clientPlayerID = useAppSelector(selectors.players.selectClientPlayerID);

  return <Tabs 
    tabLabels={["Move", "Players", "Properties", "Gambling"]}
    tabContents={[
      <Move key="move" activePlayerID={activePlayerID} clientPlayerID={clientPlayerID} />,
      <PlayerList key="players" activePlayerID={activePlayerID} />,
      <PropertiesList key="properties" />,
      <Gambling key="gambling" />
    ]}
  />;
}; 
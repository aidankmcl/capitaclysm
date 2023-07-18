
import { FC } from "react";

import { PlayerList } from "../players";
import { selectors, useAppSelector } from "~/store";
import { Tabs } from "~/components";
import { Typography } from "@mui/joy";
import { MoveControls } from "./move";

export const Controls: FC = () => {
  const players = useAppSelector(selectors.player.selectPlayers);
  const activePlayerID = useAppSelector(selectors.player.selectActivePlayerID);
  const clientPlayerID = useAppSelector(selectors.player.selectClientPlayerID);

  return <Tabs 
    tabLabels={[
      <Typography>Move</Typography>,
      <Typography>Players</Typography>,
      <Typography>Properties</Typography>,
      <Typography>Gambling</Typography>
    ]}
    tabContents={[
      <MoveControls players={players} activePlayerID={activePlayerID} clientPlayerID={clientPlayerID} />,
      <PlayerList players={players} activePlayerID={activePlayerID} />
    ]}
  />
}

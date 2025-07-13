import { FC } from "react";
import { useDispatch } from "react-redux";
import { Chip, Typography, Box } from "~/ui";

import { Avatar, List, Money } from "~/ui";
import { actions, selectors, useAppSelector } from "~/store";
import { locations } from "~/data";

type Props = {
  activePlayerID?: string;
}

export const PlayerList: FC<Props> = (props) => {
  const { activePlayerID } = props;
  
  const players = useAppSelector(selectors.players.selectPlayers);
  const dispatch = useDispatch();

  return <List items={players.map(player => {    
    const location = locations[player.locationIndex];

    return {
      decorator: <Avatar className="flex-shrink-0" player={player} activePlayerID={activePlayerID} />,
      content: (
        <div className="flex flex-row gap-2 ml-[15px] items-center" onClick={() => dispatch(actions.player.setActivePlayer(player.id))}>
          <Typography level="body-md" noWrap className="overflow-hidden text-ellipsis">{player.name}</Typography>
          <Money amount={player.money} size="lg" />
          <Chip 
            variant="outlined"
            color="neutral"
            size="lg"
            startDecorator={<Box className="w-4 h-4 rounded-full" style={{ backgroundColor: location.color }} />}
          >
            <Typography fontWeight="bold" level="body-sm">{location.name}</Typography>
          </Chip>
        </div>
      )
    };
  })} />;
}; 
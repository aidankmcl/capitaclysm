import { FC } from "react";
import { useDispatch } from "react-redux";
import { Chip, Stack, Typography, Box } from "~/ui";

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
      decorator: <Avatar style={{ flexShrink: 0 }} player={player} activePlayerID={activePlayerID} />,
      content: (
        <Stack direction="row" spacing={2} sx={{ marginLeft: "15px", alignItems: "center" }} onClick={() => dispatch(actions.player.setActivePlayer(player.id))}>
          <Typography level="body-md" noWrap className="overflow-hidden text-ellipsis">{player.name}</Typography>
          <Money amount={player.money} size="lg" />
          <Chip 
            variant="outlined"
            color="neutral"
            size="lg"
            startDecorator={<Box sx={{ width: "1em", height: "1em", borderRadius: "100%", backgroundColor: location.color }} />}
          >
            <Typography fontWeight="bold" level="body-sm">{location.name}</Typography>
          </Chip>
        </Stack>
      )
    };
  })} />;
}; 
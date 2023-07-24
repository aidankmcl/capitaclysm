
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, Stack, Typography, Avatar as JoyAvatar } from '@mui/joy';

import { Avatar, List, Money } from '~/components';
import { actions, selectors, useAppSelector } from '~/store';
import { locations } from '~/data/map';

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
        <Stack direction="row" spacing={2} sx={{ marginLeft: '15px', alignItems: 'center' }} onClick={() => dispatch(actions.player.setActivePlayer(player.id))}>
          <Typography level="h6" overflow="hidden" textOverflow="ellipsis" noWrap>{player.name}</Typography>
          <Money amount={player.money} size="lg" />
          <Chip 
            variant="outlined"
            color="neutral"
            size="lg"
            startDecorator={<JoyAvatar size="sm" sx={{ backgroundColor: location.color }}>&nbsp;</JoyAvatar>}
          >
            <Typography fontWeight="bold" level="h6">{location.name}</Typography>
          </Chip>
        </Stack>
      )
    };
  })} />;
};

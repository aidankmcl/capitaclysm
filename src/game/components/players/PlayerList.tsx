
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Chip, ColorPaletteProp, Stack, Typography, Avatar as JoyAvatar } from '@mui/joy';

import { Avatar, List } from '~/components';
import { PlayerData, actions } from '~/store';
import { locations } from '~/data/map';

type Props = {
  players: PlayerData[];
  activePlayerID?: string;
}

export const PlayerList: FC<Props> = (props) => {
  const { players, activePlayerID } = props;
  
  const dispatch = useDispatch();

  return <List items={players.map(player => {
    const moneyColor: ColorPaletteProp = player.money > 1000
      ? 'success'
      : player.money > 500
        ? 'warning'
        : 'danger';
    
    const location = locations[player.locationIndex];

    return {
      decorator: <Avatar style={{ flexShrink: 0 }} player={player} activePlayerID={activePlayerID} />,
      content: (
        <Stack direction="row" spacing={2} sx={{ marginLeft: '15px', alignItems: 'center' }} onClick={() => dispatch(actions.player.setActivePlayer(player.id))}>
          <Typography fontWeight="bold" level="h6" overflow="hidden" textOverflow="ellipsis" noWrap>{player.name}</Typography>
          <Chip color={moneyColor} variant="soft" size="lg">
            <Typography color={moneyColor} fontWeight="bold">${player.money}</Typography>
          </Chip>
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

import { Chip, ColorPaletteProp, Stack, Typography, Avatar as JoyAvatar } from '@mui/joy';
import { FC } from 'react';

import { Avatar, List } from '~/components';
import { selectors, useAppSelector } from '~/store';
import { locations } from '~/data/map';

export const PlayerList: FC = () => {
  const players = useAppSelector(selectors.player.selectPlayers);

  return <List items={players.map(player => {
    const moneyColor: ColorPaletteProp = player.money > 1000
      ? 'success'
      : player.money > 500
        ? 'warning'
        : 'danger';
    
    const location = locations[player.locationIndex];

    return {
    decorator: <Avatar player={player} />,
    content: (
      <Stack direction="row" spacing={2} sx={{ marginLeft: '15px', alignItems: 'center' }}>
        <Typography fontWeight="bold" level="h6">{player.name}</Typography>
        <Chip color={moneyColor} variant="soft">
          <Typography color={moneyColor} fontWeight="bold">${player.money}</Typography>
        </Chip>
        <Chip 
          variant="outlined"
          color="neutral"
          startDecorator={<JoyAvatar size="sm" sx={{ backgroundColor: location.color }}>&nbsp;</JoyAvatar>}
        >
          <Typography fontWeight="bold" level="h6">{location.name}</Typography>
        </Chip>
      </Stack>
    )
  };})} />;
};

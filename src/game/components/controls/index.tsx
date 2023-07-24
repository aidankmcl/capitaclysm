
import { FC } from 'react';
import { Typography } from '@mui/joy';

import { selectors, useAppSelector } from '~/store';
import { Tabs } from '~/components';

import { PlayerList } from './players';
import { Move } from './move';
import { PropertiesList } from './properties';

export const Controls: FC = () => {
  const activePlayerID = useAppSelector(selectors.players.selectActivePlayerID);
  const clientPlayerID = useAppSelector(selectors.players.selectClientPlayerID);

  return <Tabs 
    tabLabels={[
      <Typography>Move</Typography>,
      <Typography>Players</Typography>,
      <Typography>Properties</Typography>,
      <Typography>Gambling</Typography>
    ]}
    tabContents={[
      <Move activePlayerID={activePlayerID} clientPlayerID={clientPlayerID} />,
      <PlayerList activePlayerID={activePlayerID} />,
      <PropertiesList />
    ]}
  />;
};

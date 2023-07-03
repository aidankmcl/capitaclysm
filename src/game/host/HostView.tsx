import { FC } from 'react';

import { Map } from '../components/map';
import { HostP2PListener } from '~/store';

export const HostView: FC = () => {
  return <div>
    <HostP2PListener />
    <Map />
  </div>;
};

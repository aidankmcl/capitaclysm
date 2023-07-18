
import { FC } from 'react';

import { HostP2PListener } from '~/store';
import { usePeer } from '~/services/p2p';
import { Gamegrid } from '~/components';

import { Map } from '../components/map';
import { Controls } from '../components/controls';


export const HostView: FC = () => {
  const { code } = usePeer();

  return (
    <Gamegrid
      map={<Map />}
      manage={(<>
        <h2>{code}</h2>
      </>)}
      content={<Controls />}
    >
      <HostP2PListener />
    </Gamegrid>
  );
};

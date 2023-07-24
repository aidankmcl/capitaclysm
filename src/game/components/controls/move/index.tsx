
import { FC } from 'react';

import { RollButton } from './RollButton';

type Props = {
  activePlayerID: string | undefined;
  clientPlayerID: string | undefined;
}

export const Move: FC<Props> = (props) => {

  return <>
    <RollButton {...props} />
  </>;
};

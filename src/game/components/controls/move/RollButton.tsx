
import { FC } from 'react';

import { Button } from '~/components';
import { actions, useAppDispatch } from '~/store';


type Props = {
  activePlayerID: string | undefined;
  clientPlayerID: string | undefined;
}

export const RollButton: FC<Props> = (props) => {
  const { activePlayerID, clientPlayerID } = props;

  const dispatch = useAppDispatch();

  const canMoveActively = activePlayerID && clientPlayerID && activePlayerID === clientPlayerID;

  const sendMove = () => {
    if (canMoveActively) {
      dispatch(actions.player.movePlayer({ playerID: clientPlayerID }));
    }
  };

  return <Button disabled={!canMoveActively} onClick={sendMove} size="lg" sx={{ width: '100%' }}>Move</Button>;
};


import { FC, useEffect, useState } from "react";

import { Button, toast } from "~/components";
import { usePeer } from "~/services/p2p";
import { PlayerData } from "~/store"

type Props = {
  players: PlayerData[],
  activePlayerID?: string;
  clientPlayerID?: string;
}

const roll = () => Math.ceil(Math.random() * 6);

export const MoveControls: FC<Props> = (props) => {
  const { activePlayerID, clientPlayerID } = props;
  const canMoveActively = activePlayerID === clientPlayerID;

  const { sendData } = usePeer();
  const [steps, setSteps] = useState(0);

  const sendMove = () => {
    const twoDiceRoll = roll() + roll();
    if (clientPlayerID) {
      sendData('move', {
        playerID: clientPlayerID,
        steps: twoDiceRoll
      });
    }
    setSteps(twoDiceRoll);
  };

  useEffect(() => {
    if (steps) toast(<>{steps}</>);
  }, [steps]);

  return <>
    <Button disabled={!canMoveActively} onClick={sendMove} size="lg" sx={{ width: '100%' }}>Move</Button>
  </>
}

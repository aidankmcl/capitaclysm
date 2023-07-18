
import { FC } from "react";

import { Button } from "~/components";
import { usePeer } from "~/services/p2p";
import { PlayerData } from "~/store"

type Props = {
  players: PlayerData[],
  activePlayerID?: string;
  clientPlayerID?: string;
}

export const MoveControls: FC<Props> = (props) => {
  const { activePlayerID, clientPlayerID } = props;
  const canMoveActively = activePlayerID === clientPlayerID;

  const { sendData } = usePeer();

  const sendMove = () => clientPlayerID && sendData('move', {
    playerID: clientPlayerID,
    steps: Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6)
  });

  return <>
    <Button disabled={!canMoveActively} onClick={sendMove}>Move</Button>
  </>
}

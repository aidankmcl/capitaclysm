import { FC } from 'react';
import { Host } from '../services/p2p';

import styles from './Game.module.css';
import { Monopoly } from './monopoly';

type Props = {
  host: Host;
  close: () => void;
}

export const Game: FC<Props> = (props) => {
  return <div className={styles.wrapper}>
    <button onClick={props.close} className={styles.closeButton}>Back</button>
    <Monopoly />
  </div>;
};

import { FC } from 'react';

import styles from './Game.module.css';
import { Monopoly } from './monopoly';

type Props = {
  close: () => void;
}

export const Game: FC<Props> = (props) => {
  return <div className={styles.wrapper}>
    <button onClick={props.close} className={styles.closeButton}>Back</button>
    <Monopoly />
  </div>;
};

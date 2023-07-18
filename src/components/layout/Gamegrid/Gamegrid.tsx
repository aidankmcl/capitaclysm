
import { FC, PropsWithChildren } from 'react';
import { Card, Sheet } from '@mui/joy';

import styles from './Gamegrid.module.css';

type Props = PropsWithChildren<{
  map?: JSX.Element;
  manage?: JSX.Element;
  content?: JSX.Element;
}>

export const Gamegrid: FC<Props> = (props) => {
  return <Sheet className={styles.container} sx={{ background: 'var(--joy-palette-primary-500)' }}>
    {props.children}

    <Card className={styles.mapSection}>
      {props.map}
    </Card>

    <Card className={styles.manageSection}>
      {props.manage}
    </Card>

    <Card className={styles.contentSection}>
      {props.content}
    </Card>
  </Sheet>;
};

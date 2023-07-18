import { FC, PropsWithChildren } from 'react';

import { Navbar } from '../../navigation';

import styles from './Layout.module.css';

export const Layout: FC<PropsWithChildren> = (props) => {
  return <div className={styles.layoutWrapper}>
    <div className={styles.navbarContainer}>
      <Navbar />
    </div>
    <div className={styles.contentContainer}>
      {props.children}
    </div>
  </div>;
};

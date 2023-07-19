import { FC, PropsWithChildren } from 'react';

import { Navbar } from '../../navigation';

import styles from './Layout.module.css';
import { ToastProvider } from '~/components';

export const Layout: FC<PropsWithChildren> = (props) => {
  return <div className={styles.layoutWrapper}>
    <ToastProvider />

    <div className={styles.navbarContainer}>
      <Navbar />
    </div>
    <div className={styles.contentContainer}>
      {props.children}
    </div>
  </div>;
};

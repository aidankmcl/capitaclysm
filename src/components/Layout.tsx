import { FC, PropsWithChildren } from 'react';
import { Navbar } from './Navbar';

export const Layout: FC<PropsWithChildren> = (props) => {
  return <div>
    <Navbar />
    {props.children}
  </div>;
};

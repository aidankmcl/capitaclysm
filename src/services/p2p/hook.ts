
import { useContext } from 'react';
import { PeerContext } from '.';

export const usePeer = () => {
  const value = useContext(PeerContext);
  return value;
};


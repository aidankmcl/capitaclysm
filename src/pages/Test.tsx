// import { useState } from 'react';

import { Layout } from '~/components';
import { Map } from '../game/components/map';
import { actions, useAppDispatch } from '~/store';
import { useEffect, useRef } from 'react';

export const Test = () => {
  const dispatch = useAppDispatch();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      dispatch(actions.game.newGame());
      initRef.current = true;
    }
  }, [initRef, dispatch]);

  return <Layout>
    <div style={{ height: '80vh', width: '80vh'}}>
      <Map />
    </div>
  </Layout>;
};

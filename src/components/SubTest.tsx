import { useEffect } from 'react';
import { usePeer } from '~/services/p2p';

export const SubTest = (props: { hostCode: string, name: string }) => {
  const { hostCode, name } = props;
  const { code, connect, connection } = usePeer([]);

  useEffect(() => {
    if (hostCode && name) {
      connect(hostCode, name);
    }
  }, [hostCode, name, connect]);

  return <div>
    {code}
    {connection?.label}
  </div>;
};

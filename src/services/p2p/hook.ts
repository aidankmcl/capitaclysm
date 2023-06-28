import { DataConnection, Peer } from 'peerjs';
import { useEffect, useState } from 'react';

import { generateCode, getConnectionID } from './utils';
import { CallbackObject, addCallbacks, sendConnectionEvent, sendData as sendDataEvent } from './events';


const code = generateCode();
const peer = new Peer(getConnectionID(code));

peer.on('open', (connectionID) => {
  sendConnectionEvent('host', 'open', { connectionID });

  peer.on('connection', (connection) => {
    connection.on('open', () => {
      sendConnectionEvent('child', 'open', { connection });
    });
  
    connection.on('data', (data) => {
      sendConnectionEvent('child', 'data', data);
    });
  
    connection.on('close', () => {
      sendConnectionEvent('child', 'close', { connection });
    });
  });
  
  peer.on('close', () => {
    sendConnectionEvent('host', 'close', { connectionID });
  });
});

const connect = (peer: Peer, hostCode: string, name: string) => {
  const connectionID = getConnectionID(hostCode);

  const connection = peer.connect(connectionID, { label: name });

  connection.on('open', () => {
    sendConnectionEvent('client', 'open', { connectionID });
  });

  connection.on('close', () => {
    sendConnectionEvent('client', 'close', { connectionID });
  });

  connection.on('data', (data) => {
    sendConnectionEvent('client', 'data', data);
  });

  connection.on('error', (err) => {
    sendConnectionEvent('client', 'error', { err });
  });

  connection.on('iceStateChanged', (iceChange) => {
    sendConnectionEvent('client', 'iceStateChanged', { iceChange });
  });

  return connection;
};

type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never
type SendDataWithoutConnectionInput = (...args: DropFirst<Parameters<typeof sendDataEvent>>) => void;

type UsePeerResult = {
  code: string,
  connect: (code: string, peerName: string) => void,
  connection: DataConnection | undefined,
  disconnect: () => void,
  sendData: SendDataWithoutConnectionInput
}


export const usePeer: (callbacks?: CallbackObject[]) => UsePeerResult = (callbacks) => {
  const [connection, setConnection] = useState<DataConnection>();

  useEffect(() => {
    addCallbacks(callbacks || []);
  }, []);

  const connectToHost = (hostCode: string, name: string) => {
    if (connection && connection.reliable) return;

    setConnection(connect(peer, hostCode, name));
  };

  const sendData: SendDataWithoutConnectionInput = (action, data) => {
    if (!connection) return;

    sendDataEvent(connection, action, data);
  }

  const disconnectFromHost = () => {
    if (!connection || !connection.reliable) return;

    connection.close();
    setConnection(undefined);
  };

  return {
    code,
    connect: connectToHost,
    connection,
    disconnect: disconnectFromHost,
    sendData
  };
};

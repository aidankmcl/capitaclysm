import { DataConnection, Peer } from 'peerjs';
import { FC, PropsWithChildren, createContext, useState } from 'react';

import { generateCode, getConnectionID } from './utils';
import { addCallbacks, sendConnectionEvent, sendData as sendDataEvent } from './events';
import { RootState, SYNC_EVENT_NAME, FORWARD_ACTION_EVENT_NAME } from '~/store';
import { useOnce } from '~/components';


const addPeerListeners = (peer: Peer) => {
  peer.on('open', (connectionID) => {
    sendConnectionEvent('host', 'open', { connectionID });
  
    peer.on('connection', (connection) => {
      connection.on('open', () => {  
        window.addEventListener(SYNC_EVENT_NAME, (evt) => {
          const customEvent = evt as CustomEvent<RootState>;
          connection.send({ action: SYNC_EVENT_NAME, data: customEvent.detail });
        });

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
};

const connect = (peer: Peer, hostCode: string, name: string) => {
  const connectionID = getConnectionID(hostCode);

  const connection = peer.connect(connectionID, { label: name });

  connection.on('open', () => {
    window.addEventListener(FORWARD_ACTION_EVENT_NAME, (evt) => {
      const customEvent = evt as CustomEvent;
      console.log('sending to host', customEvent.detail);
      connection.send({ action: FORWARD_ACTION_EVENT_NAME, data: customEvent.detail });
    });
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

type DropFirst<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never
type SendDataWithoutConnectionInput = (...args: DropFirst<Parameters<typeof sendDataEvent>>) => void;

type PeerControls = {
  code: string | undefined;
  connect: (code: string, peerName: string) => void;
  connection: DataConnection | undefined;
  disconnect: () => void;
  sendData: SendDataWithoutConnectionInput;
  addCallbacks: typeof addCallbacks;
  isHost: boolean;
  setHost: (isHost: boolean) => void;
}

export const PeerContext = createContext<PeerControls>({
  code: undefined,
  connect: () => null,
  connection: undefined,
  disconnect: () => null,
  sendData: () => null,
  addCallbacks,
  isHost: false,
  setHost: () => null,
});


export const PeerProvider: FC<PropsWithChildren> = (props) => {
  const [code, setCode] = useState<string>();
  const [peer, setPeer] = useState<Peer>();
  const [isHost, setHost] = useState(false);

  useOnce(() => {
    if (!code) {
      const code = generateCode();
      const peer = new Peer(getConnectionID(code));
      addPeerListeners(peer);
      setCode(code);
      setPeer(peer);
    }
  });

  const [connection, setConnection] = useState<DataConnection>();

  const connectToHost = (hostCode: string, name: string) => {
    if (!peer || (connection && connection.reliable)) return;

    const conn = connect(peer, hostCode, name);
    setConnection(conn);
  };

  const sendData: SendDataWithoutConnectionInput = (action, data) => {
    if (isHost) {
      sendConnectionEvent('child', 'data', { action, data });
    } else if (connection) {
      sendDataEvent(connection, action, data);
    }
  };

  const disconnectFromHost = () => {
    if (!connection || !connection.reliable) return;

    connection.close();
    setConnection(undefined);
  };

  return (
    <PeerContext.Provider
      value={{
        code: code || '',
        connection,
        connect: connectToHost,
        disconnect: disconnectFromHost,
        sendData,
        addCallbacks,
        isHost,
        setHost
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};

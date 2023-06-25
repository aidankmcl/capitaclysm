import { DataConnection, Peer as PeerJS } from 'peerjs';

export type PeerFunctions = {
  onOpen: (id: string) => void,
  onConnection: (connection: DataConnection, remove?: boolean) => void,
  onClose: () => void
}

type PeerMessage = {
  action: 'rename',
  data: { name: string }
} | {
  action: 'move'
};

type PeerTypes = 'host' | 'client';

let instance: Peer;

const CONN_PREFIX = 'capitaclysm-game-unique-id-prefix';

export const getConnectionID = (code: string) => `${CONN_PREFIX}-${code}`;

export class Peer {
  type: PeerTypes;

  client: PeerJS | undefined;
  connection: DataConnection | undefined;

  constructor(
    type: PeerTypes,
    peerFunctions: PeerFunctions,
  ) {
    this.type = type;

    if (instance) {
      return instance;
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;

    const id = getConnectionID(this.generateCode());
    this.client = new PeerJS(id);

    this.client.on('open', (conn) => {
      console.log('Peer: open conn', conn);
      peerFunctions.onOpen(conn);
    });

    this.client.on('connection', (connection) => {
      console.log('Peer: new conn', connection);
      connection.on('data', (data) => {
        const msg = data as PeerMessage;

        console.log('Peer: data', msg);
        switch (msg.action) {
          default:
            return;
        }
      });

      connection.on('open', () => {
        peerFunctions.onConnection(connection);
      });

      connection.on('close', () => {
        peerFunctions.onConnection(connection, true);
      });
    });

    this.client.on('close', peerFunctions.onClose);
  }

  generateCode = (len = 4) => {
    const code = [];

    const charZeroCode = 48;
    const charNineCode = 57;
    const numDiff = charNineCode - charZeroCode;

    const charACode = 97;
    const charZCode = 122;
    const alphaDiff = charZCode - charACode;
    for (let i = 0; i < len; i++) {
      const letterCodeIndex = Math.floor(Math.random() * (numDiff + alphaDiff));
      const charCode = (letterCodeIndex < numDiff) ? charZeroCode + letterCodeIndex : charACode + (letterCodeIndex - numDiff);
      code.push(String.fromCharCode(charCode));
    }

    return code.join('').toUpperCase();
  };

  connect = (code: string, name: string) => {
    console.log('trying to connect...');
    if (!this.client) return;

    console.log('connecting...');

    const id = getConnectionID(code);

    this.connection = this.client.connect(id, { label: name });

    this.connection.on('open', () => {
      console.log('connection: opened with', id);
    });

    this.connection.on('close', () => {
      console.log('connection');
    });

    this.connection.on('data', (data) => {
      console.log('connection: data', data);
    });

    this.connection.on('error', (err) => {
      console.log('connection: error', err);
    });

    this.connection.on('iceStateChanged', (change) => {
      console.log('connection: iceStateChanged', change);
    });
  };

  disconnect = () => {
    if (!this.connection) return;

    this.connection.close();
    this.connection = undefined;
  };

  send = (data: unknown) => {
    if (!this.connection) return;

    this.connection.send(data);
  };
}

import { Peer, PeerFunctions } from './Peer';

export class Client extends Peer {
  constructor(peerFunctions: PeerFunctions) {
    super('client', peerFunctions);
  }

  nameClient = (name: string) => {
    this.send({
      action: 'rename',
      data: { name }
    });
  };
}
import { Peer, PeerFunctions } from './Peer';

export class Host extends Peer {
  constructor(peerFunctions: PeerFunctions) {
    super('host', peerFunctions);
  }
}
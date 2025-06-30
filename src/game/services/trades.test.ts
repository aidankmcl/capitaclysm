import { Peer, DataConnection } from 'peerjs';
import {
  getTradeChannelLabel,
  initiateTradeChannel,
  isTradeChannel,
} from './trades';

// Mock PeerJS
const mockConnect = jest.fn();
const mockPeer = {
  connect: mockConnect,
} as unknown as Peer;

describe('trade service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTradeChannelLabel', () => {
    it('should return a correctly formatted trade channel label', () => {
      const tradeId = 'trade123';
      const expectedLabel = 'trade_trade123';
      expect(getTradeChannelLabel(tradeId)).toBe(expectedLabel);
    });
  });

  describe('initiateTradeChannel', () => {
    it('should call peer.connect with the correct parameters', () => {
      const targetPeerId = 'peer-2';
      const tradeId = 'trade456';
      const expectedLabel = 'trade_trade456';

      initiateTradeChannel(mockPeer, targetPeerId, tradeId);

      expect(mockConnect).toHaveBeenCalledWith(targetPeerId, {
        label: expectedLabel,
        reliable: true,
      });
    });
  });

  describe('isTradeChannel', () => {
    it('should return true for a valid trade channel connection', () => {
      const tradeConnection = {
        label: 'trade_abc',
      } as DataConnection;
      expect(isTradeChannel(tradeConnection)).toBe(true);
    });

    it('should return false for a non-trade channel connection', () => {
      const mainConnection = {
        label: 'main_connection',
      } as DataConnection;
      expect(isTradeChannel(mainConnection)).toBe(false);
    });
  });
}); 
import { DataConnection } from 'peerjs';
import { renderHook, act } from '@testing-library/react';

import { useTradeChannel, TradeMessage } from './useTradeChannel';
import { usePeer } from '~/services/p2p';
import { initiateTradeChannel } from '../services/trades';
import { addCallbacks, createCallback } from '~/services/p2p/events';

// Mock dependencies
jest.mock('~/services/p2p');
jest.mock('../services/trades');
jest.mock('~/services/p2p/events');

const mockUsePeer = usePeer as jest.Mock;
const mockInitiateTradeChannel = initiateTradeChannel as jest.Mock;
const mockAddCallbacks = addCallbacks as jest.Mock;
const mockCreateCallback = createCallback as jest.Mock;

const mockConnection: Partial<DataConnection> = {
  on: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  removeAllListeners: jest.fn(),
  label: 'trade-testTradeId',
};

describe('useTradeChannel', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUsePeer.mockReturnValue({ peer: { id: 'peer-id' } });
    mockInitiateTradeChannel.mockReturnValue(mockConnection);
  });

  it('initiator should create a trade channel', () => {
    const { result } = renderHook(() =>
      useTradeChannel({
        tradeId: 'testTradeId',
        isInitiator: true,
        targetPeerId: 'target-peer-id',
        onData: jest.fn(),
      }),
    );

    expect(mockInitiateTradeChannel).toHaveBeenCalledWith(
      { id: 'peer-id' },
      'target-peer-id',
      'testTradeId',
    );
    expect(result.current.send).toBeDefined();
    expect(result.current.close).toBeDefined();
  });

  it('receiver should listen for a trade channel', () => {
    mockUsePeer.mockReturnValue({ peer: { id: 'receiver-peer-id' } });
    let connectionCallback: (args: { connection: DataConnection }) => void;
    mockAddCallbacks.mockImplementation((callbacks) => {
      // Find the 'open' callback for 'trade' and store it
      const tradeCallback = callbacks.find((cb: { type: string; event: string; callback: (args: { connection: DataConnection }) => void }) => cb.type === 'trade' && cb.event === 'open');
      if (tradeCallback) {
        connectionCallback = tradeCallback.callback;
      }
      return jest.fn(); // Return a cleanup function
    });
    mockCreateCallback.mockImplementation((type, event, callback) => ({ type, event, callback }));


    const { result } = renderHook(() =>
      useTradeChannel({
        tradeId: 'testTradeId',
        isInitiator: false,
        onData: jest.fn(),
      }),
    );

    // Simulate an incoming connection
    act(() => {
      connectionCallback({ connection: mockConnection as DataConnection });
    });

    expect(mockAddCallbacks).toHaveBeenCalled();
    expect(result.current.send).toBeDefined();
    expect(result.current.close).toBeDefined();
  });
  
    it('should call onData when data is received', () => {
        const onData = jest.fn();
        renderHook(() =>
            useTradeChannel({
                tradeId: 'testTradeId',
                isInitiator: true,
                targetPeerId: 'target-peer-id',
                onData,
            }),
        );

        const dataCallback = (mockConnection.on as jest.Mock).mock.calls.find(call => call[0] === 'data')[1];
        const message: TradeMessage = { type: 'offer', payload: 'test' };

        act(() => {
            dataCallback(message);
        });

        expect(onData).toHaveBeenCalledWith(message);
    });

    it('should call send on the connection', () => {
        const { result } = renderHook(() =>
            useTradeChannel({
                tradeId: 'testTradeId',
                isInitiator: true,
                targetPeerId: 'target-peer-id',
                onData: jest.fn(),
            }),
        );

        const message: TradeMessage = { type: 'accept', payload: 'ok' };
        result.current.send(message);

        expect(mockConnection.send).toHaveBeenCalledWith(message);
    });

    it('should call close on the connection', () => {
        const { result } = renderHook(() =>
            useTradeChannel({
                tradeId: 'testTradeId',
                isInitiator: true,
                targetPeerId: 'target-peer-id',
                onData: jest.fn(),
            }),
        );

        result.current.close();

        expect(mockConnection.close).toHaveBeenCalled();
    });
}); 
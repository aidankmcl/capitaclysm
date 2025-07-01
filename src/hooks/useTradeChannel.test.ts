import { renderHook, act, waitFor } from '@testing-library/react';
import { useTradeChannel, TradeMessage } from './useTradeChannel';
import { usePeer } from '~/services/p2p';
import type { Peer } from 'peerjs';
import { initiateTradeChannel } from '~/services/trades';
import { addCallbacks, createCallback } from '~/services/p2p/events';
import type { CallbackObject } from '~/services/p2p/events';

// --- Mock helpers ----------------------------------------------------------

// Simple in-memory mock that behaves like a peerjs DataConnection for our tests
const createMockConnection = (label: string) => {
  const handlers: Record<string, (data?: unknown) => void> = {};

  return {
    label,
    // peerjs DataConnection methods we rely on
    on: jest.fn((event: string, cb: (data?: unknown) => void) => {
      handlers[event] = cb;
    }),
    send: jest.fn(),
    close: jest.fn(),
    removeAllListeners: jest.fn(() => {
      Object.keys(handlers).forEach((k) => delete handlers[k]);
    }),
    // Test-only helper for triggering events registered through .on()
    __trigger(event: string, data?: unknown) {
      handlers[event]?.(data);
    },
  } as unknown as import('peerjs').DataConnection & { __trigger: (e: string, d?: unknown) => void };
};

// ---------------------------------------------------------------------------
// Jest mocks for external dependencies the hook relies on
// ---------------------------------------------------------------------------

// services/p2p
jest.mock('~/services/p2p', () => ({
  usePeer: jest.fn(),
}));

// services/trades
jest.mock('~/services/trades', () => ({
  initiateTradeChannel: jest.fn(),
  getTradeChannelLabel: jest.fn((id: string) => `trade_${id}`),
}));

// services/p2p/events
jest.mock('~/services/p2p/events', () => ({
  addCallbacks: jest.fn(),
  createCallback: jest.fn(),
}));

const mockUsePeer = usePeer as jest.MockedFunction<typeof usePeer>;
const mockInitiateTradeChannel = initiateTradeChannel as jest.MockedFunction<typeof initiateTradeChannel>;
const mockAddCallbacks = addCallbacks as jest.MockedFunction<typeof addCallbacks>;
const mockCreateCallback = createCallback as jest.MockedFunction<typeof createCallback>;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useTradeChannel', () => {
  const tradeId = 'test-trade';
  const peerId = 'local-peer';
  const targetPeerId = 'remote-peer';

  beforeEach(() => {
    jest.clearAllMocks();
    // Provide a fully-typed mock of the value returned by usePeer
    const peerControls: ReturnType<typeof usePeer> = {
      code: undefined,
      connect: jest.fn(),
      connection: undefined,
      disconnect: jest.fn(),
      sendData: jest.fn(),
      addCallbacks: jest.fn(),
      isHost: false,
      setHost: jest.fn(),
      peer: { id: peerId } as unknown as Peer,
    };

    mockUsePeer.mockReturnValue(peerControls);
    mockAddCallbacks.mockImplementation(() => jest.fn()); // return cleanup fn
  });

  it('initiator should create a trade channel', async () => {
    const mockConn = createMockConnection(`trade_${tradeId}`);
    mockInitiateTradeChannel.mockReturnValue(mockConn);

    const onData = jest.fn();

    const { result } = renderHook(() =>
      useTradeChannel({
        tradeId,
        isInitiator: true,
        targetPeerId,
        onData,
      })
    );

    // initiateTradeChannel should be invoked with correct params
    expect(mockInitiateTradeChannel).toHaveBeenCalled();
    const [passedPeer, passedTarget, passedTradeId] = mockInitiateTradeChannel.mock.calls[0];
    expect(passedPeer).toEqual(expect.objectContaining({ id: peerId }));
    expect(passedTarget).toBe(targetPeerId);
    expect(passedTradeId).toBe(tradeId);

    // Wait until the hook finishes setting the connection state
    await waitFor(() => {
      // .send is defined once the connection is set
      expect(result.current.send).toBeDefined();
    });

    // Verify send/close delegate to the DataConnection
    const message: TradeMessage<string> = { type: 'offer', payload: 'foo' };
    act(() => {
      result.current.send(message);
      result.current.close();
    });

    expect(mockConn.send).toHaveBeenCalledWith(message);
    expect(mockConn.close).toHaveBeenCalled();
  });

  it('receiver should listen for a trade channel and set up handlers', async () => {
    const mockConn = createMockConnection(`trade_${tradeId}`);

    // Capture the callback the hook registers for the window event
    let openCallback: (evt: Event) => void = () => {};
    mockCreateCallback.mockImplementation((_origin, _event, cb) => {
      openCallback = cb as unknown as (evt: Event) => void;
      return { origin: 'trade', eventType: 'open', callback: openCallback } as CallbackObject;
    });

    mockAddCallbacks.mockImplementation(() => jest.fn());

    const onData = jest.fn();

    renderHook(() =>
      useTradeChannel({
        tradeId,
        isInitiator: false,
        onData,
      })
    );

    // Hook should have installed a callback via createCallback
    expect(mockCreateCallback).toHaveBeenCalledWith(
      'trade',
      'open',
      expect.any(Function)
    );
    expect(mockAddCallbacks).toHaveBeenCalledWith([
      expect.objectContaining({ origin: 'trade', eventType: 'open', callback: openCallback }),
    ]);

    // Simulate receiving the connection via the window event
    act(() => {
      const evt = new CustomEvent('trade-open', { detail: { connection: mockConn } });
      openCallback(evt);
    });

    // Wait for the hook to attach listeners on the connection
    await waitFor(() => expect(mockConn.on).toHaveBeenCalled());

    // Grab the handler the hook registered for the "data" event
    const dataHandler = (mockConn.on as jest.Mock).mock.calls.find(
      ([evt]) => evt === 'data'
    )[1] as (data: unknown) => void;

    const payload: TradeMessage<number> = { type: 'accept', payload: 42 };

    act(() => {
      dataHandler(payload);
    });

    expect(onData).toHaveBeenCalledWith(payload);
  });
}); 
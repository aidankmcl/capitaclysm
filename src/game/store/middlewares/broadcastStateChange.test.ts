import { broadcastStateChange, SYNC_EVENT_NAME } from './broadcastStateChange';
import { RootState } from '../store';

// Mock setup
const mockDispatchEvent = jest.spyOn(window, 'dispatchEvent');

const createMockState = (isHost: boolean): Partial<RootState> => ({
  game: {
    clientIsHost: isHost,
    id: 'test-game',
    gameActive: true,
    created: Date.now(),
    turn: 1,
  },
});

const createMockStore = (state: Partial<RootState>) => ({
  getState: () => state as RootState,
  dispatch: jest.fn(),
});

const next = jest.fn();

describe('broadcastStateChange middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not dispatch an event if client is not host', () => {
    const mockState = createMockState(false);
    const store = createMockStore(mockState);
    const action = { type: 'some/action' };

    const middleware = broadcastStateChange(store)(next);
    middleware(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(mockDispatchEvent).not.toHaveBeenCalled();
  });

  it('should dispatch a sync event if client is host', () => {
    const mockState = createMockState(true);
    const store = createMockStore(mockState);
    const action = { type: 'some/action' };

    const middleware = broadcastStateChange(store)(next);
    middleware(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
    const event = mockDispatchEvent.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe(SYNC_EVENT_NAME);
    expect(event.detail).toEqual(mockState);
  });
}); 
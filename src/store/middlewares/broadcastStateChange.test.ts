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

  it('should dispatch a sync event containing only the changed slices if client is host', () => {
    const initialState = createMockState(true) as RootState;
    const updatedState: RootState = {
      ...initialState,
      game: {
        ...initialState.game,
        turn: initialState.game.turn + 1,
      },
    } as RootState;

    // Mock getState to return the initial state first and the updated state after the action is processed
    const getStateMock = jest
      .fn()
      .mockReturnValueOnce(initialState)
      .mockReturnValueOnce(updatedState);

    const store = {
      getState: getStateMock,
      dispatch: jest.fn(),
    } as unknown as { getState: () => RootState; dispatch: jest.Mock };

    // Use an actual action that should trigger broadcasting
    const action = { type: 'game/newGame' };

    const middleware = broadcastStateChange(store)(next);
    middleware(action);

    expect(next).toHaveBeenCalledWith(action);
    expect(mockDispatchEvent).toHaveBeenCalledTimes(1);

    const event = mockDispatchEvent.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe(SYNC_EVENT_NAME);
    expect(event.detail).toEqual({ game: updatedState.game });
  });
}); 
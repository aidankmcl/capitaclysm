import { DataConnection } from 'peerjs';
import { RootState, SYNC_EVENT_NAME } from '~/store';

type ConnectionToggleEvent = { connectionID: string };
type ConnectionEvent = { connection: DataConnection };
type DataEvent = unknown; // Typed data events handled separately below
type ErrorEvent = { err: Error };
type IceStateEvent = { iceChange: RTCIceConnectionState };

type EventData = {
  host: {
    open: ConnectionToggleEvent;
    connection: ConnectionEvent;
    close: ConnectionToggleEvent;
  }
  child: {
    open: ConnectionEvent;
    data: DataEvent;
    close: ConnectionEvent;
  }
  client: {
    open: ConnectionToggleEvent;
    data: DataEvent;
    close: ConnectionToggleEvent;
    error: ErrorEvent;
    iceStateChanged: IceStateEvent;
  }
};

const WINDOW_EVENT_PREFIX = 'capitaclysm-webrtc-events'; // avoid listener name collisions
export const getEventName = (origin: string, action: string) => `${WINDOW_EVENT_PREFIX}-${origin}-${action}`;

export type CallbackObject<
  O extends keyof EventData = keyof EventData,
  M extends EventData[O] = EventData[O],
  E extends keyof M = keyof M
> = {
  origin: O,
  eventType: E,
  callback: (event: Event) => void
}

export const sendConnectionEvent = <
  O extends keyof EventData,
  M extends EventData[O],
  E extends keyof M,
  D extends M[E]
>(origin: O, eventType: E, data: D) => {
  const evt = new CustomEvent(getEventName(origin, eventType as string), { detail: data });

  window.dispatchEvent(evt);
};

export const createCallback = <
  O extends keyof EventData,
  M extends EventData[O],
  E extends keyof M,
  D extends M[E]
>(origin: O, eventType: E, callback: (data: D) => void): CallbackObject<O, M, E> => {
  return {
    origin,
    eventType,
    callback: (evt: Event) => {
      const customEvt = evt as CustomEvent;
      console.log(`${origin}: ${eventType as string}: ${customEvt.detail}`);
      callback(customEvt.detail);
    }
  };
};

// Data callback handling
type DataPayloads = {
  move: { playerID: string, steps: number },
  [SYNC_EVENT_NAME]: RootState
}

export const sendData = <
  A extends keyof DataPayloads,
  D extends DataPayloads[A]
>(connection: DataConnection, action: A, data: D) => {
  connection.send({ action, data });
};

type MessageData<A extends keyof DataPayloads = keyof DataPayloads, D extends DataPayloads[A] = DataPayloads[A]> = {
  action: A;
  data: D
}

export const createDataCallback = <
  A extends keyof DataPayloads,
  O extends keyof EventData = 'child' | 'client'
>(origin: O, action: A, callback: (data: DataPayloads[A]) => void): CallbackObject => {
  const eventType = 'data' as keyof EventData[keyof EventData];

  return {
    origin: origin as keyof EventData,
    eventType,
    callback: (evt: Event) => {
      const customEvent = evt as CustomEvent<MessageData<A>>;
      
      console.log(`${origin}: data: ${action}: ${JSON.stringify(customEvent.detail)}`);
      callback(customEvent.detail.data);
    }
  };
};

export const addCallbacks = (callbacks: CallbackObject[]) => {
  callbacks.forEach((props) => {
    window.addEventListener(getEventName(props.origin, props.eventType), props.callback);
  });
};

import { useState, useEffect, useCallback } from "react";
import { DataConnection } from "peerjs";

import { usePeer } from "~/services/p2p";
import { initiateTradeChannel } from "../../services/trades/trades";
import { addCallbacks, createCallback } from "~/services/p2p/events";

// Define the shape of a trade negotiation message
export type TradeMessage<T = unknown> = {
  type: "offer" | "accept" | "reject" | "close";
  payload: T;
};

interface UseTradeChannelProps {
  tradeId: string;
  isInitiator: boolean;
  targetPeerId?: string; // Required for the initiator
  onData: (data: TradeMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}

export const useTradeChannel = ({
  tradeId,
  isInitiator,
  targetPeerId,
  onData,
  onOpen,
  onClose,
  onError,
}: UseTradeChannelProps) => {
  const { peer } = usePeer();
  const [tradeConnection, setTradeConnection] = useState<DataConnection>();

  // Effect to establish connection for the initiator
  useEffect(() => {
    if (isInitiator && peer && targetPeerId && !tradeConnection) {
      const conn = initiateTradeChannel(peer, targetPeerId, tradeId);
      setTradeConnection(conn);
    }
  }, [isInitiator, peer, targetPeerId, tradeId, tradeConnection]);

  // Effect for the receiver to listen for an incoming trade connection
  useEffect(() => {
    if (isInitiator || !peer) return;

    const callbacks = [
      createCallback("trade", "open", ({ connection }) => {
        if (connection.label.endsWith(tradeId)) {
          setTradeConnection(connection);
        }
      }),
    ];

    const cleanup = addCallbacks(callbacks);
    return cleanup;
  }, [isInitiator, peer, tradeId]);

  // Effect to handle DataConnection events (open, data, close, error)
  useEffect(() => {
    if (!tradeConnection) return;

    tradeConnection.on("open", () => onOpen?.());
    tradeConnection.on("data", (data) => onData(data as TradeMessage));
    tradeConnection.on("close", () => onClose?.());
    tradeConnection.on("error", (err) => onError?.(err));

    return () => {
      tradeConnection.removeAllListeners();
    };
  }, [tradeConnection, onData, onOpen, onClose, onError]);

  const send = useCallback(
    <T,>(message: TradeMessage<T>) => {
      tradeConnection?.send(message);
    },
    [tradeConnection]
  );

  const close = useCallback(() => {
    tradeConnection?.close();
  }, [tradeConnection]);

  return { send, close };
}; 
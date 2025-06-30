import { Peer, DataConnection } from "peerjs";

const TRADE_CHANNEL_PREFIX = "trade_";

/**
 * Creates a unique label for a trade channel to distinguish it from the main connection.
 * @param tradeId A unique identifier for the trade.
 * @returns The trade channel label.
 */
export const getTradeChannelLabel = (tradeId: string): string => {
  return `${TRADE_CHANNEL_PREFIX}${tradeId}`;
};

/**
 * Initiates a new trade channel with another player.
 * @param peer The local Peer object.
 * @param targetPeerId The peer ID of the player to trade with.
 * @param tradeId A unique identifier for this trade negotiation.
 * @returns The new DataConnection for the trade.
 */
export const initiateTradeChannel = (
  peer: Peer,
  targetPeerId: string,
  tradeId: string
): DataConnection => {
  const label = getTradeChannelLabel(tradeId);
  const connection = peer.connect(targetPeerId, {
    label,
    reliable: true, // Ensure messages are received in order
  });
  return connection;
};

/**
 * Checks if a DataConnection is for a trade negotiation.
 * @param connection The DataConnection to check.
 * @returns True if it's a trade channel, false otherwise.
 */
export const isTradeChannel = (connection: DataConnection): boolean => {
  return connection.label.startsWith(TRADE_CHANNEL_PREFIX);
}; 
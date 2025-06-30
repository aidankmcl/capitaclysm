export const STOCK_CONFIG = {
  UPDATE_INTERVAL: 2000, // milliseconds
  HISTORY_LENGTH: 50, // number of price points
  GRAPH_HEIGHT: 100,
  GRAPH_WIDTH: 80,
  MIN_SHARES: 1,
  MAX_SHARES: 10000,
  PRICE_DECIMAL_PLACES: 2,
  PERCENT_DECIMAL_PLACES: 2,
} as const;

export const STOCK_COLORS = {
  POSITIVE: "#2e7d32", // Green for gains
  NEGATIVE: "#d32f2f", // Red for losses
  NEUTRAL: "#1976d2", // Blue for neutral
  BORDER: "#e0e0e0", // Light gray for graph borders
} as const; 
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
  POSITIVE: "var(--color-primary)", // PRIMARY for gains
  NEGATIVE: "var(--color-tertiary)", // TERTIARY for losses
  NEUTRAL: "var(--color-background)", // BACKGROUND for neutral
  BORDER: "var(--color-secondary)", // SECONDARY for graph borders / accents
} as const; 
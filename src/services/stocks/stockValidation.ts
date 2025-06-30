import { STOCK_CONFIG } from "~/constants";

export const validateShares = (shares: number): boolean => {
  return shares >= STOCK_CONFIG.MIN_SHARES && shares <= STOCK_CONFIG.MAX_SHARES;
};

export const formatPrice = (price: number): string => {
  return `${price < 0 ? "-" : ""}$${Math.abs(price).toFixed(STOCK_CONFIG.PRICE_DECIMAL_PLACES)}`;
};

export const formatChange = (change: number, changePercent: number): string => {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${formatPrice(change)} (${changePercent.toFixed(STOCK_CONFIG.PERCENT_DECIMAL_PLACES)}%)`;
};

export const canAffordPurchase = (playerMoney: number, shares: number, price: number): boolean => {
  return playerMoney >= shares * price;
};

export const hasSufficientShares = (holding: { shares: number } | undefined, sharesToSell: number): boolean => {
  return holding ? holding.shares >= sharesToSell : false;
}; 
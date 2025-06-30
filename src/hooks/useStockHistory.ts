import { useMemo } from "react";
import { calculateStockPrice, StockPrice, STOCK_COMPANIES } from "~/services/stocks";
import { STOCK_CONFIG } from "~/constants";

export const useStockHistory = (symbol: string, referenceTime: number, length: number = STOCK_CONFIG.HISTORY_LENGTH) => {
  return useMemo(() => {
    const stock = STOCK_COMPANIES.find(s => s.symbol === symbol);
    if (!stock) return [];
    
    const history: StockPrice[] = [];
    for (let i = length - 1; i >= 0; i--) {
      const time = referenceTime - (i * STOCK_CONFIG.UPDATE_INTERVAL);
      if (time >= 0) {
        history.push(calculateStockPrice(stock, time));
      }
    }

    console.log("history", history);
    return history;
  }, [symbol, referenceTime, length]);
}; 
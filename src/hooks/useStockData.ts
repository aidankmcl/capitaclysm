import { useState, useEffect, useMemo } from "react";
import { getAllStockPrices, STOCK_COMPANIES } from "~/services/stocks";
import { STOCK_CONFIG } from "~/constants";

export const useStockData = (symbol?: string) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [referenceTime] = useState(Date.now()); // Fixed reference time for history
  
  const allPrices = useMemo(() => getAllStockPrices(currentTime), [currentTime]);
  const stockPrice = symbol ? allPrices.find(p => p.symbol === symbol) : null;
  const stockInfo = symbol ? STOCK_COMPANIES.find(s => s.symbol === symbol) : null;
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), STOCK_CONFIG.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);
  
  return { 
    allPrices,
    stockPrice,
    stockInfo,
    currentTime,
    referenceTime // Add reference time for stable history
  };
}; 
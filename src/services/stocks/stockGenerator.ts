export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
  volatility: number;
  trend: number; // -1 to 1, negative = declining, positive = growing
  seed: number; // Unique seed for each company to ensure distinct price patterns
}

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface StockHolding {
  symbol: string;
  shares: number;
  averagePrice: number;
}

// Fake companies with different characteristics
export const STOCK_COMPANIES: StockData[] = [
  {
    symbol: "TECH",
    name: "TechCorp Industries",
    sector: "Technology",
    basePrice: 150,
    volatility: 0.15,
    trend: 0.3,
    seed: 12345
  },
  {
    symbol: "OIL",
    name: "PetroMax Energy",
    sector: "Energy",
    basePrice: 75,
    volatility: 0.25,
    trend: -0.1,
    seed: 23456
  },
  {
    symbol: "BANK",
    name: "Global Finance Corp",
    sector: "Finance",
    basePrice: 120,
    volatility: 0.08,
    trend: 0.05,
    seed: 34567
  },
  {
    symbol: "FOOD",
    name: "FreshFood Markets",
    sector: "Consumer Goods",
    basePrice: 45,
    volatility: 0.12,
    trend: 0.15,
    seed: 45678
  },
  {
    symbol: "MED",
    name: "HealthTech Solutions",
    sector: "Healthcare",
    basePrice: 200,
    volatility: 0.20,
    trend: 0.4,
    seed: 56789
  },
  {
    symbol: "AUTO",
    name: "Future Motors",
    sector: "Automotive",
    basePrice: 85,
    volatility: 0.18,
    trend: 0.2,
    seed: 67890
  }
];

// Simple deterministic random number generator using seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate a new seed based on time and base seed
function generateSeed(baseSeed: number, time: number): number {
  return baseSeed + time * 0.1;
}

// Calculate stock price at a given time with deterministic behavior
export function calculateStockPrice(
  stock: StockData,
  time: number
): StockPrice {
  const seed = generateSeed(stock.seed, time);
  const random = seededRandom(seed);
  
  // Use a much smaller time scale to avoid overflow
  const timeScale = (time % 1000000) / 1000000; // Scale to 0-1 range
  
  // Add some noise to the base price (±volatility% of base price)
  const noise = (random - 0.5) * stock.volatility * stock.basePrice;
  
  // Apply trend over time (very small effect)
  const trendEffect = stock.trend * timeScale * stock.basePrice * 0.01;
  
  // Add some cyclical behavior
  const cycle = Math.sin(timeScale * Math.PI * 2) * stock.basePrice * 0.02;
  
  const currentPrice = stock.basePrice + noise + trendEffect + cycle;
  
  // Calculate change from previous price
  const prevSeed = generateSeed(stock.seed, time - 1000);
  const prevRandom = seededRandom(prevSeed);
  const prevTimeScale = ((time - 1000) % 1000000) / 1000000;
  const prevNoise = (prevRandom - 0.5) * stock.volatility * stock.basePrice;
  const prevTrendEffect = stock.trend * prevTimeScale * stock.basePrice * 0.01;
  const prevCycle = Math.sin(prevTimeScale * Math.PI * 2) * stock.basePrice * 0.02;
  const prevPrice = stock.basePrice + prevNoise + prevTrendEffect + prevCycle;
  
  const change = currentPrice - prevPrice;
  const changePercent = prevPrice > 0 ? (change / prevPrice) * 100 : 0;
  
  return {
    symbol: stock.symbol,
    price: Math.max(0.01, currentPrice), // Ensure price doesn't go negative
    change,
    changePercent,
    timestamp: time
  };
}

// Get current prices for all stocks
export function getAllStockPrices(time: number): StockPrice[] {
  return STOCK_COMPANIES.map(stock => calculateStockPrice(stock, time));
}

// Get price history for a stock
export function getStockPriceHistory(
  symbol: string,
  time: number,
  historyLength = 50
): StockPrice[] {
  const stock = STOCK_COMPANIES.find(s => s.symbol === symbol);
  if (!stock) return [];
  
  const history: StockPrice[] = [];
  for (let i = historyLength - 1; i >= 0; i--) {
    const historicalTime = time - (i * 1000); // 1 second intervals
    if (historicalTime >= 0) {
      history.push(calculateStockPrice(stock, historicalTime));
    }
  }
  
  return history;
} 
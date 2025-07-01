import {
  calculateStockPrice,
  getStockPriceHistory,
  STOCK_COMPANIES,
  StockData,
} from "./stockGenerator";
import {
  formatPrice,
  formatChange,
  validateShares,
  canAffordPurchase,
} from "./stockValidation";
import { STOCK_CONFIG } from "~/constants";

// --- Mocks and Test Data ---

const mockPriceHistory = [
  {
    symbol: "TECH",
    price: 150,
    change: 0,
    changePercent: 0,
    timestamp: Date.now() - 8000,
  },
  {
    symbol: "TECH",
    price: 152,
    change: 2,
    changePercent: 1.33,
    timestamp: Date.now() - 6000,
  },
  {
    symbol: "TECH",
    price: 149,
    change: -3,
    changePercent: -1.97,
    timestamp: Date.now() - 4000,
  },
  {
    symbol: "TECH",
    price: 155,
    change: 6,
    changePercent: 4.03,
    timestamp: Date.now() - 2000,
  },
  {
    symbol: "TECH",
    price: 153,
    change: -2,
    changePercent: -1.29,
    timestamp: Date.now(),
  },
];

// This is the bar generation logic from StockGraph.tsx, extracted for testing.
function generateBars(
  priceHistory: typeof mockPriceHistory,
  width = 100,
  height = 50
) {
  const prices = priceHistory.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  const barWidth = Math.max(1, width / priceHistory.length - 1);
  const barSpacing = 1;

  const bars = priceHistory.map((price, index) => {
    const x = index * (barWidth + barSpacing);
    const barHeight =
      priceRange > 0 ? ((price.price - minPrice) / priceRange) * height : height;
    const y = height - barHeight;

    let barColor = "#1976d2"; // neutral
    if (index > 0) {
      const prevPrice = priceHistory[index - 1].price;
      barColor = price.price >= prevPrice ? "#2e7d32" : "#d32f2f"; // green/red
    }

    return {
      x,
      y,
      width: barWidth,
      height: barHeight,
      color: barColor,
      price: price.price,
    };
  });

  return bars;
}

// --- Jest Tests ---

describe("Stock Market Logic", () => {
  describe("calculateStockPrice", () => {
    it("should calculate a stock price close to its base price", () => {
      const stock = STOCK_COMPANIES.find((s) => s.symbol === "TECH") as StockData;
      const time = Date.now();
      const price = calculateStockPrice(stock, time);

      expect(price.symbol).toBe("TECH");
      // Allow for volatility - price should be within 20% of base price
      expect(price.price).toBeGreaterThan(stock.basePrice * 0.8);
      expect(price.price).toBeLessThan(stock.basePrice * 1.2);
      expect(price.timestamp).toBe(time);
    });

    it("should be deterministic based on time and seed", () => {
        const stock = STOCK_COMPANIES.find((s) => s.symbol === "TECH") as StockData;
        const time = 1672531200000; // Fixed time: 2023-01-01 00:00:00 UTC

        const price1 = calculateStockPrice(stock, time);
        const price2 = calculateStockPrice(stock, time);

        expect(price1).toEqual(price2);
    });
  });

  describe("getStockPriceHistory", () => {
    it("should generate a stable history for a given reference time", () => {
      const symbol = "TECH";
      const referenceTime = Date.now();
      const historyLength = 50;

      const history1 = getStockPriceHistory(symbol, referenceTime, historyLength);
      const history2 = getStockPriceHistory(symbol, referenceTime, historyLength);

      expect(history1).toEqual(history2);
      expect(history1.length).toBe(historyLength);
    });

    it("should return an empty array for an invalid stock symbol", () => {
        const history = getStockPriceHistory("INVALID", Date.now());
        expect(history).toEqual([]);
    });
  });

  describe("Bar Chart Generation", () => {
    it("should generate the correct number of bars", () => {
      const bars = generateBars(mockPriceHistory);
      expect(bars).toHaveLength(mockPriceHistory.length);
    });

    it("should assign correct colors based on price changes", () => {
      const bars = generateBars(mockPriceHistory);
      // price increases, so color should be green
      expect(bars[1].color).toBe("#2e7d32");
      // price decreases, so color should be red
      expect(bars[2].color).toBe("#d32f2f");
    });
  });

  describe("Utility Functions", () => {
    it("should format price correctly", () => {
      expect(formatPrice(123.456)).toBe(`$123.46`);
    });

    it("should format change correctly", () => {
      expect(formatChange(5.67, 2.34)).toBe(`+$5.67 (2.34%)`);
      expect(formatChange(-2.1, -1.55)).toBe(`-$2.10 (-1.55%)`);
    });

    it("should validate shares correctly", () => {
      expect(validateShares(5)).toBe(true);
      expect(validateShares(0)).toBe(false);
      expect(validateShares(STOCK_CONFIG.MAX_SHARES + 1)).toBe(false);
    });

    it("should check if a purchase is affordable", () => {
      expect(canAffordPurchase(1000, 10, 50)).toBe(true);
      expect(canAffordPurchase(499, 10, 50)).toBe(false);
    });
  });
}); 
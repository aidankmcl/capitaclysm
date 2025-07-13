import { FC, useState, useEffect } from "react";
import { Box, Card, Typography, Button } from "~/ui";

import { useStockData } from "../../hooks/useStockData";
import { useStockHistory } from "../../hooks/useStockHistory";
import { formatPrice, formatChange } from "../../services/stocks/stockValidation";
import { StockGraph } from "./StockGraph";
import { StockPrice } from "~/services/stocks";
import { StockErrorFallback } from "./StockErrorFallback";

interface StockListProps {
  onSelectStock: (symbol: string) => void;
}

const StockItem = ({ price, symbol, referenceTime, onSelectStock }: { price: StockPrice, symbol: string, referenceTime: number, onSelectStock: (symbol: string) => void   }) => {
  const priceHistory = useStockHistory(symbol, referenceTime);
  const stockInfo = useStockData(symbol).stockInfo;

  const isPositive = price.change >= 0;

  return (
    <Card key={price.symbol} sx={{ padding: 8 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "left", flexDirection: "column" }}>
        <StockGraph 
          priceHistory={priceHistory}
          fillContainer={true}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, flexDirection: "row" }}>
          <Box>
            <Typography level="h5">
              {price.symbol}
            </Typography>
            {stockInfo && (
              <>
                <Typography level="body-sm" color="neutral">
                  {stockInfo.name}
                </Typography>
                <Typography level="body-xs" color="neutral">
                  {stockInfo.sector}
                </Typography>
              </>
            )}
            <Typography level="h6" sx={{ marginTop: 4 }}>
              {formatPrice(price.price)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 1 }}>
          <Typography level="body-sm" color={isPositive ? "success" : "danger"}>
            {formatChange(price.change, price.changePercent)}
          </Typography>
          <Button 
            size="sm" 
            variant="outlined"
            onClick={() => onSelectStock(price.symbol)}
          >
            Trade
          </Button>
        </Box>
      </Box>
    </Card>
  )
};

export const StockList: FC<StockListProps> = ({ onSelectStock }) => {
  const [error, setError] = useState<string | null>(null);
  const { allPrices, referenceTime } = useStockData();

  // Handle errors gracefully
  useEffect(() => {
    if (!allPrices || allPrices.length === 0) {
      setError("Unable to load stock prices");
    } else {
      setError(null);
    }
  }, [allPrices]);

  const handleRetry = () => {
    setError(null);
    // The useStockData hook will automatically retry on the next interval
  };

  if (error) {
    return <StockErrorFallback error={error} onRetry={handleRetry} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography level="h4" sx={{ marginBottom: 8 }}>
        Stock Market
      </Typography>
      
      {allPrices.map((price) => <StockItem key={price.symbol} price={price} symbol={price.symbol} referenceTime={referenceTime} onSelectStock={onSelectStock} />)}
    </Box>
  );
}; 
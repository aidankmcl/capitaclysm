import { FC, useState, useEffect } from "react";
import { Card, Typography, Button } from "~/ui";

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
    <Card key={price.symbol} className="p-2">
      <div className="flex justify-between items-left flex-col">
        <StockGraph 
          priceHistory={priceHistory}
          fillContainer={true}
        />
        <div className="flex items-center gap-2 flex-1 flex-row">
          <div>
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
            <Typography level="h6" className="mt-1">
              {formatPrice(price.price)}
            </Typography>
          </div>
        </div>
        
        <div className="flex flex-row items-end gap-1">
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
        </div>
      </div>
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
    <div className="flex flex-col gap-1">
      <Typography level="h4" className="mb-2">
        Stock Market
      </Typography>
      
      {allPrices.map((price) => <StockItem key={price.symbol} price={price} symbol={price.symbol} referenceTime={referenceTime} onSelectStock={onSelectStock} />)}
    </div>
  );
}; 
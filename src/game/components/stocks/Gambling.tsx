import { FC, useState } from "react";
import { Box } from "@mui/joy";

import { StockList } from "./StockList";
import { StockTrading } from "./StockTrading";

export const Gambling: FC = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const handleCloseTrading = () => {
    setSelectedStock(null);
  };

  return (
    <Box>
      {selectedStock ? (
        <StockTrading symbol={selectedStock} onClose={handleCloseTrading} />
      ) : (
        <StockList onSelectStock={handleSelectStock} />
      )}
    </Box>
  );
}; 
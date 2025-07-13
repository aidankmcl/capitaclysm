import { FC } from "react";
import { Box, Card, Typography, Button, Input, Stack } from "~/ui";

import { useStockTrading } from "~/hooks";
import { formatPrice, formatChange } from "../../services/stocks/stockValidation";
import { STOCK_CONFIG } from "~/constants";
import { StockGraph } from "./StockGraph";
import { StockErrorFallback } from "./StockErrorFallback";

interface StockTradingProps {
  symbol: string;
  onClose: () => void;
}

export const StockTrading: FC<StockTradingProps> = ({ symbol, onClose }) => {
  const {
    shares,
    action,
    handleSharesChange,
    setAction,
    player,
    playerMoney,
    stockPrice,
    stockInfo,
    priceHistory,
    playerHolding,
    totalCost,
    canAfford,
    canSell,
    canExecute,
    handleTrade,
  } = useStockTrading(symbol);

  if (!stockPrice || !stockInfo || !player) {
    return (
      <StockErrorFallback 
        error="Stock not found or player not available" 
        onClose={onClose}
      />
    );
  }

  const onTrade = () => {
    handleTrade();
    onClose();
  }

  return (
    <Card>
      <Typography level="h4" className="mb-2">
        Trade {symbol}
      </Typography>
      
      <Typography level="body-sm" color="neutral" className="mb-2">
        {stockInfo.name} - {stockInfo.sector}
      </Typography>

      {/* Stock Graph */}
      <Box className="mb-3 bg-background rounded">
        <StockGraph 
          priceHistory={priceHistory}
          fillContainer={true}
          height={STOCK_CONFIG.GRAPH_HEIGHT}
        />
      </Box>

      <Box className="mb-2">
        <Typography level="body-lg">
          Current Price: {formatPrice(stockPrice.price)}
        </Typography>
        <Typography level="body-sm" color={stockPrice.change < 0 ? "success" : "danger"}>
          {formatChange(stockPrice.change, stockPrice.changePercent)}
        </Typography>
      </Box>

      <Box className="mb-2 p-1 bg-background rounded">
        <Typography level="body-sm">
          Your Money: {formatPrice(playerMoney)}
        </Typography>
        {playerHolding && (
          <Typography level="body-sm">
            Your Shares: {playerHolding.shares} (Avg: {formatPrice(playerHolding.averagePrice)})
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={1} className="mb-2">
        <Button
          variant={action === "buy" ? "solid" : "outlined"}
          onClick={() => setAction("buy")}
          disabled={!canAfford}
        >
          Buy
        </Button>
        <Button
          variant={action === "sell" ? "solid" : "outlined"}
          onClick={() => setAction("sell")}
          disabled={!canSell}
        >
          Sell
        </Button>
      </Stack>

      <Box className="mb-2">
        <Typography level="body-sm" className="mb-1">
          Number of shares:
        </Typography>
        <Input
          type="number"
          value={shares}
          onChange={(e) => handleSharesChange(e.target.value)}
          slotProps={{ 
            input: { 
              min: STOCK_CONFIG.MIN_SHARES,
              max: STOCK_CONFIG.MAX_SHARES
            } 
          }}
        />
      </Box>

      <Box className="mb-2">
        <Typography level="body-sm">
          Total {action === "buy" ? "Cost" : "Proceeds"}: {formatPrice(totalCost)}
        </Typography>
        {action === "buy" && !canAfford && (
          <Typography level="body-sm" color="danger">
            Insufficient funds
          </Typography>
        )}
        {action === "sell" && !canSell && (
          <Typography level="body-sm" color="danger">
            Insufficient shares
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={1}>
        <Button
          variant="solid"
          onClick={onTrade}
          disabled={!canExecute}
          fullWidth={true}
        >
          {action === "buy" ? "Buy" : "Sell"} {shares} shares
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Stack>
    </Card>
  );
}; 
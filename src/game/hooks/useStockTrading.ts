import { useState } from "react";

import { useAppSelector, useAppDispatch } from "~/store";
import { actions as stockActions } from "../store/slices/stocks";
import { useStockData } from "./useStockData";
import { useStockHistory } from "./useStockHistory";
import {
  validateShares,
  canAffordPurchase,
  hasSufficientShares,
} from "../utils/stockValidation";
import { STOCK_CONFIG } from "../constants/stockConfig";

export const useStockTrading = (symbol: string) => {
  const dispatch = useAppDispatch();
  const [shares, setShares] = useState<number>(STOCK_CONFIG.MIN_SHARES);
  const [action, setAction] = useState<"buy" | "sell">("buy");

  // Get player data
  const clientPlayerID = useAppSelector((state) => state.players.clientPlayerID);
  const player = useAppSelector((state) => clientPlayerID ?state.players.items[clientPlayerID] : undefined);
  const playerMoney = player?.money || 0;

  // Get stock data
  const { stockPrice, stockInfo, referenceTime } = useStockData(symbol);
  const priceHistory = useStockHistory(symbol, referenceTime);

  // Get player's current holding for this stock
  const playerHolding = useAppSelector((state) =>
    state.stocks.holdings[clientPlayerID || ""]?.find(
      (h) => h.symbol === symbol
    )
  );

  // Validation
  const isValidShares = validateShares(shares);
  const canAfford = canAffordPurchase(playerMoney, shares, stockPrice?.price || 0);
  const canSell = hasSufficientShares(playerHolding, shares);
  const canExecute = isValidShares && (action === "buy" ? canAfford : canSell);

  const totalCost = (stockPrice?.price || 0) * shares;

  const handleTrade = () => {
    if (!clientPlayerID || !canExecute || !stockPrice) return;

    const tradeAction = action === "buy" ? stockActions.buyStock : stockActions.sellStock;
    dispatch(
      tradeAction({
        playerID: clientPlayerID,
        symbol,
        shares,
        price: stockPrice.price,
      })
    );
  };

  const handleSharesChange = (value: string) => {
    const newShares = Math.max(
      STOCK_CONFIG.MIN_SHARES,
      parseInt(value) || STOCK_CONFIG.MIN_SHARES
    );
    setShares(Math.min(newShares, STOCK_CONFIG.MAX_SHARES));
  };

  return {
    // State
    shares,
    action,
    // Setters
    handleSharesChange,
    setAction,
    // Derived Data
    player,
    playerMoney,
    stockPrice,
    stockInfo,
    priceHistory,
    playerHolding,
    totalCost,
    // Validation
    isValidShares,
    canAfford,
    canSell,
    canExecute,
    // Actions
    handleTrade,
  };
}; 
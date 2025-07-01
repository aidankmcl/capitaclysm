import { useCallback } from "react";
import { useAppDispatch, actions } from "~/store";
import { StockTradeTransaction, TransactionResult } from "./types";
import { useTransactionValidation } from "./validation";

export const useStockTrade = () => {
  const dispatch = useAppDispatch();
  const {
    validatePlayerExists,
    validatePlayerHasMoney,
    validateStockHolding,
    createValidation,
    addValidationError
  } = useTransactionValidation();

  const executeStockTrade = useCallback((
    playerID: string,
    symbol: string,
    shares: number,
    price: number,
    action: "buy" | "sell"
  ): TransactionResult => {
    const validation = createValidation();

    // Validate inputs
    if (!validatePlayerExists(playerID)) {
      addValidationError(validation, "Player does not exist");
    }

    if (shares <= 0) {
      addValidationError(validation, "Invalid number of shares");
    }

    if (price <= 0) {
      addValidationError(validation, "Invalid price");
    }

    const totalAmount = shares * price;

    if (action === "buy") {
      if (!validatePlayerHasMoney(playerID, totalAmount)) {
        addValidationError(validation, "Insufficient funds for stock purchase");
      }
    } else {
      if (!validateStockHolding(playerID, symbol, shares)) {
        addValidationError(validation, "Insufficient shares to sell");
      }
    }

    if (!validation.isValid) {
      return { success: false, validation };
    }

    // Execute transaction
    const transaction: StockTradeTransaction = {
      id: `stock-${action}-${Date.now()}`,
      type: "stock-trade",
      playerID,
      symbol,
      shares,
      price,
      action,
      amount: totalAmount,
      timestamp: Date.now()
    };

    if (action === "buy") {
      dispatch(actions.stocks.buyStock({
        playerID,
        symbol,
        shares,
        price,
        transactionId: transaction.id
      }));
    } else {
      dispatch(actions.stocks.sellStock({
        playerID,
        symbol,
        shares,
        price,
        transactionId: transaction.id
      }));
    }

    return { success: true, transaction };
  }, [dispatch, validatePlayerExists, validatePlayerHasMoney, validateStockHolding, createValidation, addValidationError]);

  return {
    executeStockTrade
  };
}; 
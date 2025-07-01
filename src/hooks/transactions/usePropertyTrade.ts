import { useCallback } from "react";
import { useAppDispatch, actions } from "~/store";
import { PropertyTradeTransaction, TransactionResult } from "./types";
import { useTransactionValidation } from "./validation";

export const usePropertyTrade = () => {
  const dispatch = useAppDispatch();
  const {
    validatePlayerExists,
    validatePlayerHasMoney,
    validatePropertyOwnership,
    validateStockHolding,
    createValidation,
    addValidationError
  } = useTransactionValidation();

  const executePropertyTrade = useCallback((
    playerAId: string,
    playerBId: string,
    playerAItems: {
      money: number;
      propertyIndices: number[];
      stocks: Array<{ symbol: string; shares: number; marketPrice: number }>;
    },
    playerBItems: {
      money: number;
      propertyIndices: number[];
      stocks: Array<{ symbol: string; shares: number; marketPrice: number }>;
    }
  ): TransactionResult => {
    const validation = createValidation();

    // Validate players exist
    if (!validatePlayerExists(playerAId)) {
      addValidationError(validation, "Player A does not exist");
    }

    if (!validatePlayerExists(playerBId)) {
      addValidationError(validation, "Player B does not exist");
    }

    // Validate money
    if (!validatePlayerHasMoney(playerAId, playerAItems.money)) {
      addValidationError(validation, "Player A has insufficient funds");
    }

    if (!validatePlayerHasMoney(playerBId, playerBItems.money)) {
      addValidationError(validation, "Player B has insufficient funds");
    }

    // Validate property ownership
    for (const propertyIndex of playerAItems.propertyIndices) {
      if (!validatePropertyOwnership(playerAId, propertyIndex)) {
        addValidationError(validation, `Player A does not own property at index ${propertyIndex}`);
      }
    }

    for (const propertyIndex of playerBItems.propertyIndices) {
      if (!validatePropertyOwnership(playerBId, propertyIndex)) {
        addValidationError(validation, `Player B does not own property at index ${propertyIndex}`);
      }
    }

    // Validate stock holdings
    for (const stock of playerAItems.stocks) {
      if (!validateStockHolding(playerAId, stock.symbol, stock.shares)) {
        addValidationError(validation, `Player A does not have enough shares of ${stock.symbol}`);
      }
    }

    for (const stock of playerBItems.stocks) {
      if (!validateStockHolding(playerBId, stock.symbol, stock.shares)) {
        addValidationError(validation, `Player B does not have enough shares of ${stock.symbol}`);
      }
    }

    if (!validation.isValid) {
      return { success: false, validation };
    }

    // Execute transaction
    const transaction: PropertyTradeTransaction = {
      id: `trade-${Date.now()}`,
      type: "property-trade",
      playerAId,
      playerBId,
      playerAItems,
      playerBItems,
      playerID: playerAId, // For compatibility with BaseTransaction
      amount: playerAItems.money + playerBItems.money,
      timestamp: Date.now()
    };

    dispatch(actions.shared.finalizeTrade({
      id: transaction.id,
      playerAId,
      playerBId,
      playerAItems,
      playerBItems,
      timestamp: Date.now()
    }));

    return { success: true, transaction };
  }, [dispatch, validatePlayerExists, validatePlayerHasMoney, validatePropertyOwnership, validateStockHolding, createValidation, addValidationError]);

  return {
    executePropertyTrade
  };
}; 
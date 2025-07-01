import { useCallback } from "react";
import { useAppDispatch, actions } from "~/store";
import { TaxPaymentTransaction, TransactionResult } from "./types";
import { useTransactionValidation } from "./validation";

export const useTaxPayment = () => {
  const dispatch = useAppDispatch();
  const {
    validatePlayerExists,
    validateLocationExists,
    validatePlayerHasMoney,
    createValidation,
    addValidationError
  } = useTransactionValidation();

  const executeTaxPayment = useCallback((
    playerID: string,
    locationIndex: number,
    taxAmount: number
  ): TransactionResult => {
    const validation = createValidation();

    // Validate inputs
    if (!validatePlayerExists(playerID)) {
      addValidationError(validation, "Player does not exist");
    }

    if (!validateLocationExists(locationIndex)) {
      addValidationError(validation, "Location does not exist");
    }

    if (!validatePlayerHasMoney(playerID, taxAmount)) {
      addValidationError(validation, "Insufficient funds for tax payment");
    }

    if (!validation.isValid) {
      return { success: false, validation };
    }

    // Execute transaction (tax payments reduce player money)
    const transaction: TaxPaymentTransaction = {
      id: `tax-${Date.now()}`,
      type: "tax-payment",
      playerID,
      locationIndex,
      taxAmount,
      amount: taxAmount,
      timestamp: Date.now()
    };

    // For tax payments, we directly reduce player money
    // This could be handled by a new action or through the existing trade system
    dispatch(actions.shared.finalizeTrade({
      id: transaction.id,
      playerAId: "bank", // Bank receives the tax
      playerBId: playerID,
      playerAItems: {
        money: 0,
        propertyIndices: [],
        stocks: []
      },
      playerBItems: {
        money: taxAmount,
        propertyIndices: [],
        stocks: []
      },
      timestamp: Date.now()
    }));

    return { success: true, transaction };
  }, [dispatch, validatePlayerExists, validateLocationExists, validatePlayerHasMoney, createValidation, addValidationError]);

  return {
    executeTaxPayment
  };
}; 
import { useCallback } from "react";
import { useAppDispatch, actions } from "~/store";
import { RentPaymentTransaction, TransactionResult } from "./types";
import { useTransactionValidation } from "./validation";

export const useRentPayment = () => {
  const dispatch = useAppDispatch();
  const {
    validatePlayerExists,
    validateLocationExists,
    validatePlayerHasMoney,
    validatePropertyOwnership,
    createValidation,
    addValidationError
  } = useTransactionValidation();

  const executeRentPayment = useCallback((
    playerID: string,
    locationIndex: number,
    ownerID: string,
    rentAmount: number
  ): TransactionResult => {
    const validation = createValidation();

    // Validate inputs
    if (!validatePlayerExists(playerID)) {
      addValidationError(validation, "Player does not exist");
    }

    if (!validatePlayerExists(ownerID)) {
      addValidationError(validation, "Property owner does not exist");
    }

    if (!validateLocationExists(locationIndex)) {
      addValidationError(validation, "Location does not exist");
    }

    if (!validatePlayerHasMoney(playerID, rentAmount)) {
      addValidationError(validation, "Insufficient funds for rent payment");
    }

    if (!validatePropertyOwnership(ownerID, locationIndex)) {
      addValidationError(validation, "Property ownership validation failed");
    }

    if (!validation.isValid) {
      return { success: false, validation };
    }

    // Execute transaction using the trade system
    const transaction: RentPaymentTransaction = {
      id: `rent-${Date.now()}`,
      type: "rent-payment",
      playerID,
      locationIndex,
      ownerID,
      rentAmount,
      amount: rentAmount,
      timestamp: Date.now()
    };

    dispatch(actions.shared.finalizeTrade({
      id: transaction.id,
      playerAId: ownerID,
      playerBId: playerID,
      playerAItems: {
        money: 0,
        propertyIndices: [],
        stocks: []
      },
      playerBItems: {
        money: rentAmount,
        propertyIndices: [],
        stocks: []
      },
      timestamp: Date.now()
    }));

    return { success: true, transaction };
  }, [dispatch, validatePlayerExists, validateLocationExists, validatePlayerHasMoney, validatePropertyOwnership, createValidation, addValidationError]);

  return {
    executeRentPayment
  };
}; 
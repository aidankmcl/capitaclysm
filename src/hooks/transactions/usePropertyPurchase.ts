import { useCallback } from "react";
import { useAppDispatch, useAppSelector, actions } from "~/store";
import { PropertyPurchaseTransaction, TransactionResult } from "./types";
import { useTransactionValidation } from "./validation";

export const usePropertyPurchase = () => {
  const dispatch = useAppDispatch();
  const locations = useAppSelector(state => state.locations.items);
  const {
    validatePlayerExists,
    validateLocationExists,
    validatePlayerHasMoney,
    createValidation,
    addValidationError
  } = useTransactionValidation();

  const executePropertyPurchase = useCallback((
    playerID: string, 
    locationIndex: number, 
    price: number
  ): TransactionResult => {
    const validation = createValidation();

    // Validate inputs
    if (!validatePlayerExists(playerID)) {
      addValidationError(validation, "Player does not exist");
    }

    if (!validateLocationExists(locationIndex)) {
      addValidationError(validation, "Location does not exist");
    }

    if (!validatePlayerHasMoney(playerID, price)) {
      addValidationError(validation, "Insufficient funds");
    }

    // Check if property is already owned
    const location = locations[locationIndex];
    if (location?.owners.length > 0) {
      addValidationError(validation, "Property is already owned");
    }

    if (!validation.isValid) {
      return { success: false, validation };
    }

    // Execute transaction
    const transaction: PropertyPurchaseTransaction = {
      id: `purchase-${Date.now()}`,
      type: "property-purchase",
      playerID,
      locationIndex,
      price,
      amount: price,
      timestamp: Date.now()
    };

    dispatch(actions.shared.purchaseProperty({
      playerID,
      locationIndex,
      price
    }));

    return { success: true, transaction };
  }, [dispatch, locations, validatePlayerExists, validateLocationExists, validatePlayerHasMoney, createValidation, addValidationError]);

  return {
    executePropertyPurchase
  };
}; 
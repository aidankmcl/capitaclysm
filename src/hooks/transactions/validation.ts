import { useCallback } from "react";
import { useAppSelector } from "~/store";
import { TransactionValidation } from "./types";

export const useTransactionValidation = () => {
  const players = useAppSelector(state => state.players.items);
  const locations = useAppSelector(state => state.locations.items);
  const stockHoldings = useAppSelector(state => state.stocks.holdings);

  // Validation helpers
  const validatePlayerExists = useCallback((playerID: string): boolean => {
    return !!players[playerID];
  }, [players]);

  const validatePlayerHasMoney = useCallback((playerID: string, amount: number): boolean => {
    const player = players[playerID];
    return player ? player.money >= amount : false;
  }, [players]);

  const validateLocationExists = useCallback((locationIndex: number): boolean => {
    return !!locations[locationIndex];
  }, [locations]);

  const validatePropertyOwnership = useCallback((playerID: string, locationIndex: number): boolean => {
    const location = locations[locationIndex];
    return location?.owners.some(owner => owner.ownerID === playerID) || false;
  }, [locations]);

  const validateStockHolding = useCallback((playerID: string, symbol: string, shares: number): boolean => {
    const holdings = stockHoldings[playerID];
    const holding = holdings?.find(h => h.symbol === symbol);
    return holding ? holding.shares >= shares : false;
  }, [stockHoldings]);

  // Helper to create validation result
  const createValidation = useCallback((): TransactionValidation => ({
    isValid: true,
    errors: [],
    warnings: []
  }), []);

  // Helper to add validation error
  const addValidationError = useCallback((
    validation: TransactionValidation, 
    error: string
  ): void => {
    validation.isValid = false;
    validation.errors.push(error);
  }, []);

  return {
    validatePlayerExists,
    validatePlayerHasMoney,
    validateLocationExists,
    validatePropertyOwnership,
    validateStockHolding,
    createValidation,
    addValidationError
  };
}; 
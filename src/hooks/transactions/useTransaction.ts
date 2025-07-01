import { useCallback } from "react";
import { Transaction, TransactionResult } from "./types";
import { useTransactionValidation } from "./validation";
import { usePropertyPurchase } from "./usePropertyPurchase";
import { useRentPayment } from "./useRentPayment";
import { useStockTrade } from "./useStockTrade";
import { usePropertyTrade } from "./usePropertyTrade";
import { useTaxPayment } from "./useTaxPayment";

export const useTransaction = () => {
  // Individual transaction hooks
  const propertyPurchase = usePropertyPurchase();
  const rentPayment = useRentPayment();
  const stockTrade = useStockTrade();
  const propertyTrade = usePropertyTrade();
  const taxPayment = useTaxPayment();
  
  // Validation helpers
  const validation = useTransactionValidation();

  // Main transaction executor
  const executeTransaction = useCallback((transaction: Transaction): TransactionResult => {
    switch (transaction.type) {
      case "property-purchase":
        return propertyPurchase.executePropertyPurchase(
          transaction.playerID,
          transaction.locationIndex,
          transaction.price
        );
      
      case "rent-payment":
        return rentPayment.executeRentPayment(
          transaction.playerID,
          transaction.locationIndex,
          transaction.ownerID,
          transaction.rentAmount
        );
      
      case "stock-trade":
        return stockTrade.executeStockTrade(
          transaction.playerID,
          transaction.symbol,
          transaction.shares,
          transaction.price,
          transaction.action
        );
      
      case "property-trade":
        return propertyTrade.executePropertyTrade(
          transaction.playerAId,
          transaction.playerBId,
          transaction.playerAItems,
          transaction.playerBItems
        );
      
      case "tax-payment":
        return taxPayment.executeTaxPayment(
          transaction.playerID,
          transaction.locationIndex,
          transaction.taxAmount
        );
      
      default:
        return {
          success: false,
          error: `Unsupported transaction type: ${(transaction as any).type}`
        };
    }
  }, [
    propertyPurchase,
    rentPayment,
    stockTrade,
    propertyTrade,
    taxPayment
  ]);

  return {
    // Transaction executors (delegated to individual hooks)
    executePropertyPurchase: propertyPurchase.executePropertyPurchase,
    executeRentPayment: rentPayment.executeRentPayment,
    executeStockTrade: stockTrade.executeStockTrade,
    executePropertyTrade: propertyTrade.executePropertyTrade,
    executeTaxPayment: taxPayment.executeTaxPayment,
    executeTransaction,
    
    // Validation helpers
    validatePlayerExists: validation.validatePlayerExists,
    validatePlayerHasMoney: validation.validatePlayerHasMoney,
    validateLocationExists: validation.validateLocationExists,
    validatePropertyOwnership: validation.validatePropertyOwnership,
    validateStockHolding: validation.validateStockHolding
  };
}; 
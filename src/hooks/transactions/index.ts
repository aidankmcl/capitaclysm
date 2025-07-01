// Main transaction hook
export { useTransaction } from './useTransaction';

// Individual transaction hooks
export { usePropertyPurchase } from './usePropertyPurchase';
export { useRentPayment } from './useRentPayment';
export { useStockTrade } from './useStockTrade';
export { usePropertyTrade } from './usePropertyTrade';
export { useTaxPayment } from './useTaxPayment';

// Validation hook
export { useTransactionValidation } from './validation';

// Types
export type {
  TransactionType,
  BaseTransaction,
  PropertyPurchaseTransaction,
  PropertyTradeTransaction,
  RentPaymentTransaction,
  StockTradeTransaction,
  TaxPaymentTransaction,
  UtilityPaymentTransaction,
  Transaction,
  TransactionValidation,
  TransactionResult
} from './types'; 
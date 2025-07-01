// Transaction types
export type TransactionType = 
  | "property-purchase"
  | "property-trade" 
  | "rent-payment"
  | "stock-trade"
  | "tax-payment"
  | "utility-payment";

// Base transaction interface
export interface BaseTransaction {
  id: string;
  type: TransactionType;
  playerID: string;
  amount: number;
  timestamp: number;
}

// Specific transaction interfaces
export interface PropertyPurchaseTransaction extends BaseTransaction {
  type: "property-purchase";
  locationIndex: number;
  price: number;
}

export interface PropertyTradeTransaction extends BaseTransaction {
  type: "property-trade";
  playerAId: string;
  playerBId: string;
  playerAItems: {
    money: number;
    propertyIndices: number[];
    stocks: Array<{
      symbol: string;
      shares: number;
      marketPrice: number;
    }>;
  };
  playerBItems: {
    money: number;
    propertyIndices: number[];
    stocks: Array<{
      symbol: string;
      shares: number;
      marketPrice: number;
    }>;
  };
}

export interface RentPaymentTransaction extends BaseTransaction {
  type: "rent-payment";
  locationIndex: number;
  ownerID: string;
  rentAmount: number;
}

export interface StockTradeTransaction extends BaseTransaction {
  type: "stock-trade";
  symbol: string;
  shares: number;
  price: number;
  action: "buy" | "sell";
}

export interface TaxPaymentTransaction extends BaseTransaction {
  type: "tax-payment";
  locationIndex: number;
  taxAmount: number;
}

export interface UtilityPaymentTransaction extends BaseTransaction {
  type: "utility-payment";
  locationIndex: number;
  ownerID: string;
  utilityAmount: number;
  diceRoll: number;
}

// Union type for all transactions
export type Transaction = 
  | PropertyPurchaseTransaction
  | PropertyTradeTransaction
  | RentPaymentTransaction
  | StockTradeTransaction
  | TaxPaymentTransaction
  | UtilityPaymentTransaction;

// Validation results
export interface TransactionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Transaction result
export interface TransactionResult {
  success: boolean;
  transaction?: Transaction;
  error?: string;
  validation?: TransactionValidation;
} 
# Stock Market Feature

## Overview

The stock market feature allows players to gamble on fake stocks in the Capitaclysm game. Players can buy and sell shares of various companies, with prices that change deterministically based on time and a seed value.

## Architecture

### File Structure

```
src/game/
├── services/
│   ├── stockGenerator.ts     # Core stock data generation logic
│   └── index.ts             # Service exports
├── store/slices/
│   └── stocks.ts            # Redux state management for stocks
└── components/stocks/
    ├── StockList.tsx        # Display list of available stocks
    ├── StockTrading.tsx     # Buy/sell interface
    ├── Gambling.tsx         # Main gambling component
    └── index.ts             # Component exports
```

### Key Components

1. **Stock Generator Service** (`stockGenerator.ts`)
   - Generates deterministic stock prices using `price(time, seed)` function
   - Defines 6 fake companies with different characteristics
   - Provides price history and current price calculations

2. **Redux Store** (`stocks.ts`)
   - Manages stock prices, player holdings, and transactions
   - Handles buy/sell actions with money integration
   - Maintains stock seed for consistency

3. **UI Components**
   - `StockList`: Shows all available stocks with current prices
   - `StockTrading`: Interface for buying/selling shares
   - `Gambling`: Main component integrated into the Gambling tab

## Features

### Deterministic Pricing
- Stock prices are calculated using a seed-based algorithm
- `price(time, seed)` function ensures consistency across game sessions
- Prices include noise, trends, and cyclical behavior

### Fake Companies
- **TECH**: TechCorp Industries (Technology, high growth)
- **OIL**: PetroMax Energy (Energy, declining)
- **BANK**: Global Finance Corp (Finance, stable)
- **FOOD**: FreshFood Markets (Consumer Goods, moderate growth)
- **MED**: HealthTech Solutions (Healthcare, high growth)
- **AUTO**: Future Motors (Automotive, moderate growth)

### Trading Interface
- View current stock prices and changes
- Buy/sell shares with quantity selection
- Real-time price updates every 5 seconds
- Integration with player money system (planned)

## Usage

1. Navigate to the "Gambling" tab in the game controls
2. View the list of available stocks with current prices
3. Click "Trade" on any stock to open the trading interface
4. Select buy or sell, enter quantity, and confirm transaction

## Future Enhancements

- Player actions affecting stock prices
- In-game news events impacting markets
- Stock charts and price history visualization
- Portfolio management and performance tracking
- Market volatility based on game events

## Technical Notes

- Stock prices update every 5 seconds
- Each game session uses a random seed for price generation
- The seed can be set manually for testing consistency
- Price calculations include volatility, trends, and cyclical patterns 
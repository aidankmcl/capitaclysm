import { useAppSelector, selectors } from "~/store";
import { useStockData } from "./useStockData";

/**
 * A hook that returns all relevant information about a player's interaction
 * with a specific stock.
 * @param symbol The stock symbol to look up.
 * @param playerID The ID of the player to look up data for. Defaults to the client player.
 * @returns An object containing the stock's price and info, and the player's holdings.
 */
export const usePlayerStockData = (symbol: string, playerID?: string) => {
  const { stockPrice, stockInfo } = useStockData(symbol);

  const clientPlayerID = useAppSelector(selectors.players.selectClientPlayerID);
  const targetPlayerID = playerID || clientPlayerID;

  const playerHolding = useAppSelector((state) =>
    state.stocks.holdings[targetPlayerID || ""]?.find(
      (h) => h.symbol === symbol
    )
  );

  const player = useAppSelector((state) =>
    targetPlayerID ? selectors.players.selectPlayer(state, targetPlayerID) : undefined
  );

  return {
    stockPrice,
    stockInfo,
    playerHolding,
    player,
  };
}; 
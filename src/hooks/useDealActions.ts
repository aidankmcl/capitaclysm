import {
  useAppDispatch,
  actions,
  LocationData,
  PlayerData,
} from "~/store";

// The selector that provides this deal augments it with the full location and player
export type PropertyDeal = {
  id: string;
  created: number;
  locationIndex: number;
  location: LocationData;
  price: number;
  playerID: string;
  player: PlayerData;
  ownerID?: string;
  status: 'pending' | 'accepted' | 'rejected';
  properties?: LocationData[];
  isRent?: boolean;
};

export const useDealActions = (deal: PropertyDeal) => {
  const dispatch = useAppDispatch();

  const accept = () => {
    if (deal.ownerID) {
      // It's a player-to-player trade.
      dispatch(
        actions.shared.finalizeTrade({
          id: deal.id,
          playerAId: deal.ownerID,
          playerBId: deal.playerID,
          playerAItems: {
            money: 0,
            propertyIndices: [deal.locationIndex],
            stocks: [],
          },
          playerBItems: {
            money: deal.price,
            propertyIndices: [],
            stocks: [],
          },
          timestamp: Date.now(),
        })
      );
    } else {
      // It's a purchase from the bank.
      dispatch(
        actions.shared.purchaseProperty({
          playerID: deal.playerID,
          locationIndex: deal.locationIndex,
          price: deal.price,
        })
      );
    }
  };

  const reject = () => {
    if (deal.isRent) return; // Should not be possible to reject rent

    // Rejection is handled via p2p, no global state change needed
  };

  return { accept, reject };
}; 
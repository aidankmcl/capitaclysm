import {
  useAppDispatch,
  actions,
  PropertyDeal,
  LocationData,
  PlayerData,
} from "~/store";

// The selector that provides this deal augments it with the full location and player
export type AugmentedPropertyDeal = PropertyDeal & {
  location: LocationData;
  player: PlayerData;
};

export const useDealActions = (deal: AugmentedPropertyDeal) => {
  const dispatch = useAppDispatch();

  const accept = () => {
    const currentOwners = deal.location.owners;
    // for now make it equal across owners
    const percentage = Math.floor(100 / (currentOwners.length + 1));

    const owners: LocationData["owners"] = deal.isRent
      ? currentOwners
      : currentOwners.reduce(
          (acc: LocationData["owners"], next) => {
            acc.push({ ...next, percentOwnership: percentage });
            return acc;
          },
          [{ ownerID: deal.playerID, percentOwnership: percentage }]
        );

    dispatch(
      actions.deals.close({
        ...deal,
        status: "accepted",
        owners,
      })
    );
  };

  const reject = () => {
    if (deal.isRent) return; // Should not be possible to reject rent

    dispatch(
      actions.deals.close({
        ...deal,
        status: "rejected",
        owners: deal.location.owners, // existing owners are preserved
      })
    );
  };

  return { accept, reject };
}; 
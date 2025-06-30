import { FC } from "react";

import { selectors, useAppSelector } from "~/store";
import { useDealActions, AugmentedPropertyDeal } from "../../hooks";

import { TransactionDialog } from "./TransactionDialog";

const ActiveDeal: FC<{deal: AugmentedPropertyDeal}> = ({ deal }) => {
  const { accept, reject } = useDealActions(deal);
  const title = deal.isRent ? "Pay Rent" : "Trade Property";

  return (
    <TransactionDialog
      title={title}
      location={deal.location}
      startMoney={deal.player.money}
      cost={deal.price}
      accept={accept}
      reject={!deal.isRent ? reject : undefined}
    />
  );
};

export const DealModalProvider: FC = () => {
  const deals = useAppSelector(selectors.trades.selectTradeLog);
  const activeDeal = deals[0];

  if (!activeDeal) return <></>;

  return <ActiveDeal deal={activeDeal} />;
}; 
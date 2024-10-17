
import { FC } from 'react';

import { PropertyDeal, actions, selectors, useAppDispatch, useAppSelector } from '~/store';

import { TransactionDialog } from './TransactionDialog';

export const DealModalProvider: FC = () => {

  const deals = useAppSelector(selectors.deals.selectPendingAugmented);
  const dispatch = useAppDispatch();

  const activeDeal = deals[0];
  if (!activeDeal) return <></>;

  const close = (status: PropertyDeal['status']) => {
    const currentOwners = activeDeal.location.owners;
    const percentage = Math.floor(100 / (currentOwners.length + 1)); // for now make it equal across owners
    
    const owners = activeDeal.isRent
      ? currentOwners
      : currentOwners.reduce((acc, next) => {
        acc.push({ ...next, percentOwnership: percentage });
        return acc;
      }, [{ ownerID: activeDeal.playerID, percentOwnership: percentage }]);
    

    dispatch(
      actions.deals.close({
        ...activeDeal,
        status,
        owners
      })
    );
  };

  const title = activeDeal.isRent ? 'Pay Rent' : 'Trade Property';

  return (
    <TransactionDialog
      title={title}
      location={activeDeal.location}
      startMoney={activeDeal.player.money}
      cost={activeDeal.price}
      accept={() => close('accepted')}
      reject={!activeDeal.isRent ? () => close('rejected') : undefined}
    />
  );
};

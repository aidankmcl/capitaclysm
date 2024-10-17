
import { selectors } from '../selectors';
import { actions } from '../slices';
import { AppStartListening } from './listenerMiddleware';


export const addTurnListener = (startAppListening: AppStartListening) => {
  startAppListening({
    actionCreator: actions.player.movePlayer,
    effect: async (action, listenerApi) => {
      const state = listenerApi.getState();
  
      const { playerID } = action.payload;
      const newLocation = selectors.locations.getPlayerLocation(state, playerID);
      if (!newLocation) return;
      
      let offerDeal = false;

      switch (newLocation.type) {
        case 'event':
          // something
          break;
        case 'railroad':
        case 'utility':
        case 'property':
          if (!newLocation.owners.length) {
            offerDeal = true;
          } else {
            // pay rent
          }
      }

      if (offerDeal) {
        listenerApi.dispatch(actions.deals.offer({
          locationIndex: newLocation.locationIndex,
          price: newLocation.price,
          playerID
        }));
  
        const [closeAction] = await listenerApi.take(actions.deals.close.match);
        const { deal } = closeAction.payload;
        console.log("test", JSON.stringify(deal, null, 2));
  
        if (closeAction.payload.status === "accepted") {
          console.log("wow", closeAction.payload.owners.length)
          const otherOwners = closeAction.payload.owners.filter((owner) => owner.playerID !== playerID);
  
          if (otherOwners.length) {
            await Promise.all(otherOwners.map((owner) => {
              const owed = owner.percentOwnership * (deal.price || 0);
              console.log(owner.percentOwnership, deal.price, owed);
              return listenerApi.dispatch(actions.player.sendMoney({ fromPlayerID: playerID, toPlayerID: owner.playerID, delta: owed }))
            }))
          } else {
            await listenerApi.dispatch(actions.player.sendMoney({ fromPlayerID: playerID, toPlayerID: "", delta: deal.price }))
          }
        }
      }

      listenerApi.dispatch(actions.player.endTurn());
  
      // // Pause until action dispatched or state changed
      // if (await listenerApi.condition()) {
      //   // Use the listener API methods to dispatch, get state,
      //   // unsubscribe the listener, start child tasks, and more
      //   listenerApi.dispatch(todoAdded('Buy pet food'))
  
      //   // Spawn "child tasks" that can do more work and return results
      //   const task = listenerApi.fork(async (forkApi) => {
      //     // Can pause execution
      //     await forkApi.delay(5)
      //     // Complete the child by returning a value
      //     return 42
      //   })
  
      //   const result = await task.result
      //   // Unwrap the child result in the listener
      //   if (result.status === 'ok') {
      //     // Logs the `42` result value that was returned
      //     console.log('Child succeeded: ', result.value)
      //   }
      // }
    },
  });
}


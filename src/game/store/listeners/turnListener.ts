
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

      const isRent = newLocation.owners.length > 0;

      switch (newLocation.type) {
        case 'event':
          // something
          break;
        case 'utility':
        case 'railroad':
        case 'property':
          // Only pay rent if you're not an owner
          if (!newLocation.owners.find(({ ownerID }) => ownerID === playerID)) {
            listenerApi.dispatch(actions.deals.offer({
              locationIndex: newLocation.locationIndex,
              price: isRent
                ? newLocation.type === 'utility'
                  ? action.payload.steps * newLocation.rentMultiplier
                  : newLocation.rent || 0
                : newLocation.price,
              playerID,
              isRent
            }));
      
            await listenerApi.take(actions.deals.close.match);
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
};


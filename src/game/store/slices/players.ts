
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateRadialBackground } from '~/components';

import { actions as sharedActions } from './sharedActions';
import { actions as dealActions } from './deals';
import { locations } from '../../components/map/data/locations';

export type PlayerData = {
  id: string;
  created: number;
  name: string;
  active: boolean;
  money: number;
  color: string;
  locationIndex: number;
  icon: 'car' | 'iron' | 'snake';
  ownedPropertyIndices: number[];
}

// Define a type for the slice state
interface PlayerState {
  items: Record<string, PlayerData>;
  playerIDs: string[];
  activePlayerID: string | undefined;
  clientPlayerID: string | undefined;
}

// Define the initial state using that type
const initialState: PlayerState = {
  items: {},
  playerIDs: [],
  activePlayerID: undefined,
  clientPlayerID: undefined
};

const rollDice = (numDice = 2): number => new Array(numDice)
  .fill(0)
  .reduce((acc) => acc + Math.ceil(Math.random() * 6), 0);

export const playerSlice = createSlice({
  name: 'players',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(sharedActions.syncState, (state, action) => {
        return {
          ...action.payload.players,
          clientPlayerID: state.clientPlayerID
        };
      })
      .addCase(dealActions.close, (state, action) => {
        const { locationIndex, owners, status, playerID, price, isRent } = action.payload;
        if (status !== 'accepted') return;

        console.log(state.items[playerID].money, price)
        state.items[playerID].money -= price;

        owners.forEach(({ ownerID, percentOwnership }) => {
          console.log(ownerID);
          if (!state.items[ownerID].ownedPropertyIndices.includes(locationIndex)) {
            state.items[ownerID].ownedPropertyIndices.push(locationIndex);
          }

          if (isRent) {
            state.items[ownerID].money += Math.floor((percentOwnership / 100) * price);
          }
        });
      });
  },
  reducers: {
    addPlayer: (state, action: PayloadAction<{ connectionID: string, name: string }>) => {
      const { connectionID, name } = action.payload;
    
      const player: PlayerData = {
        id: connectionID,
        created: Date.now(),
        active: true,
        name,
        icon: Math.random() > 0.5 ? 'car' : 'iron',
        color: generateRadialBackground(),
        money: 1500,
        locationIndex: 0,
        ownedPropertyIndices: []
      };

      state.items[player.id] = player;
      if (!state.playerIDs.includes(player.id)) state.playerIDs.push(player.id);
      if (!state.activePlayerID) state.activePlayerID = player.id;
    },
    togglePlayer: (state, action: PayloadAction<{ connectionID: string, active: boolean }>) => {
      const { connectionID, active } = action.payload;
      if (state.items[connectionID]) {
        state.items[connectionID].active = active;
      }
    },
    setClientPlayer: (state, action: PayloadAction<string>) => {
      const playerID = action.payload;
      state.clientPlayerID = playerID;
    },
    setActivePlayer: (state, action: PayloadAction<string>) => {
      const playerID = action.payload;
      state.activePlayerID = playerID;
    },
    movePlayer: {
      reducer: (state, action: PayloadAction<{ playerID: string, steps: number}>) => {
        const { playerID, steps } = action.payload;
  
        const player = state.items[playerID]; 
        state.items[playerID].locationIndex = ((player.locationIndex + steps) % locations.length);
      },
      prepare: (payload: { playerID: string, steps?: number }) => {
        const steps = payload.steps || rollDice();
        return {
          payload: {
            ...payload,
            steps
          }
        };
      }
    },
    endTurn: (state) => {
      const currentActivePlayerID = state.activePlayerID;
      const activePlayerIndex = state.playerIDs.findIndex(playerID => currentActivePlayerID === playerID);
      const nextPlayerIndex = (activePlayerIndex + 1) % state.playerIDs.length;
      console.log('next player?', currentActivePlayerID, activePlayerIndex, nextPlayerIndex, state.playerIDs);
      state.activePlayerID = state.playerIDs[nextPlayerIndex];
    }
  },
});

export const actions = playerSlice.actions;

export default playerSlice.reducer;

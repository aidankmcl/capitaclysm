
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
        const { deal: { locationIndex }, owners, status } = action.payload;
        if (status !== 'accepted') return;

        owners.forEach(({ playerID }) => {
          if (!state.items[playerID].ownedPropertyIndices.includes(locationIndex)) {
            state.items[playerID].ownedPropertyIndices.push(locationIndex);
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
    sendMoney: (state, action: PayloadAction<{ fromPlayerID: string, toPlayerID: string, delta: number }>) => {
      const { fromPlayerID, toPlayerID, delta } = action.payload;
      const fromPlayer = state.items[fromPlayerID];
      const toPlayer = state.items[toPlayerID];
      if (fromPlayer) {
        console.log("from player", fromPlayer.id, fromPlayer.name, fromPlayer.money - delta);
        state.items[fromPlayer.id] = {
          ...fromPlayer,
          money: fromPlayer.money - delta
        }
      }

      if (toPlayer) {
        console.log("to player", toPlayer.id, toPlayer.name, toPlayer.money + delta);
        state.items[toPlayer.id] = {
          ...toPlayer,
          money: toPlayer.money + delta
        }
      }
    },
    endTurn: (state) => {
      const currentActivePlayerID = state.activePlayerID;
      const activePlayerIndex = state.playerIDs.findIndex(playerID => currentActivePlayerID === playerID);
      const nextPlayerIndex = (activePlayerIndex + 1) % state.playerIDs.length;
      state.activePlayerID = state.playerIDs[nextPlayerIndex];
    }
  },
});

export const actions = playerSlice.actions;

export default playerSlice.reducer;

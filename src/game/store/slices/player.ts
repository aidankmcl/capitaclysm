
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '~/store';
import { actions as shared } from './sharedActions';
import { generateRadialBackground } from '~/components';

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
  propertyIDs: string[];
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

export const playerSlice = createSlice({
  name: 'players',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(shared.syncState, (state, action) => {
        return {
          ...action.payload.players,
          clientPlayerID: state.clientPlayerID
        };
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
        propertyIDs: []
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
    movePlayer: (state, action: PayloadAction<{ playerID: string, steps: number}>) => {
      const { playerID, steps } = action.payload;

      const player = state.items[playerID]; 
      console.log('moving player', player.locationIndex, steps, locations.length);
      state.items[playerID].locationIndex = ((player.locationIndex + steps) % locations.length);
    },
    endTurn: (state) => {
      const currentActivePlayerID = state.activePlayerID;
      const activePlayerIndex = state.playerIDs.findIndex(playerID => currentActivePlayerID === playerID);
      const nextPlayerIndex = activePlayerIndex + 1 % state.playerIDs.length;
      state.activePlayerID = state.playerIDs[nextPlayerIndex];
    }
  },
});

export const actions = playerSlice.actions;

const selectPlayerItems = (state: RootState) => state.players.items;
const selectPlayerIDs = (state: RootState) => state.players.playerIDs;

export const selectors = {
  selectPlayers: createSelector([selectPlayerItems, selectPlayerIDs], (playerItems, playerIDs) => {
    return playerIDs.map(id => playerItems[id]);
  }),
  selectActivePlayerID: (state: RootState) => state.players.activePlayerID,
  selectClientPlayerID: (state: RootState) => state.players.clientPlayerID
};

export default playerSlice.reducer;

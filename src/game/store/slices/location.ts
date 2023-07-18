import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { RootState } from '~/store';

import { actions as gameActions } from './game';
import { actions as shared } from './sharedActions';
import { Location, locations } from '../../components/map/data/locations';

type Owner = {
  playerID: string;
  percentOwnership: number;
}

type LocationData = {
  id: string;
  name: string;
  type: Location['type'];
  locationIndex: number; // index in `locations` fixed list
  created: number;
  description: string;
  rent?: number;
  price?: number;
  owners: Owner[];
}

// Define a type for the slice state
interface LocationState {
  items: Record<string, LocationData>;
}

// Define the initial state using that type
const initialState: LocationState = {
  items: {},
};

export const locationSlice = createSlice({
  name: 'locations',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(shared.syncState, (_, action) => {
        return action.payload.locations;
      })
      .addCase(gameActions.newGame, (state) => {
        locations.forEach((location, i) => {
          const locationData: LocationData = {
            id: v4(),
            type: location.type,
            locationIndex: i,
            created: Date.now(),
            name: location.name,
            description: location.description,
            rent: location.type === 'property' ? location.baseRent : location.value || 0,
            price: location.value || 0,
            owners: []
          };
  
          state.items[locationData.id] = locationData;
        });
      });
  },
  reducers: {},
});

export const actions = locationSlice.actions;

export const selectors = {
  selectOwnedProperties: (state: RootState, playerID: string) => {
    const owner = state.players.items[playerID];
    if (!owner) return [];
  
    return owner.propertyIDs.map(id => state.locations.items[id]);
  },
  selectClientPlayerProperties: (state: RootState) => {
    const playerID = state.players.clientPlayerID;
    if (!playerID) return [];
  
    return selectors.selectOwnedProperties(state, playerID);
  },
  selectActivePlayerProperties: (state: RootState) => {
    const playerID = state.players.activePlayerID;
    if (!playerID) return [];
  
    return selectors.selectOwnedProperties(state, playerID);
  }
};

export default locationSlice.reducer;

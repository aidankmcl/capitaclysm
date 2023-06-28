import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import type { RootState } from '../store';

import { LocationType, locations } from '../../monopoly/data';

type Owner = {
  playerID: string;
  percentOwnership: number;
}

type LocationData = {
  id: string;
  gameID: string;
  type: LocationType['type'];
  locationIndex: number; // index in `locations` fixed list
  created: number;
  name: string;
  description: string;
  rent?: number;
  price?: number;
  owners: Owner[];
}

// Define a type for the slice state
interface LocationState {
  items: Record<string, LocationData>;
  locationsByGame: Record<string, string[]>;
}

// Define the initial state using that type
const initialState: LocationState = {
  items: {},
  locationsByGame: {}
};

export const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    newGame: (state, action: PayloadAction<string>) => {
      const gameID = action.payload;

      locations.forEach((location, i) => {
        const locationData: LocationData = {
          id: v4(),
          gameID,
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
        state.locationsByGame[gameID] = state.locationsByGame[gameID] || [];
        if (!state.locationsByGame[gameID].includes(locationData.id)) state.locationsByGame[gameID].push(locationData.id);
      });
    },
  },
});

export const actions = locationSlice.actions;

export const selectors = {
  selectOwnedProperties: (state: RootState, playerID: string) => {
    const owner = state.players.items[playerID];
    if (!owner) return [];
  
    return owner.propertyIDs.map(id => state.locations.items[id]);
  },
  selectCurrentPlayerProperties: (state: RootState) => {
    const playerID = state.players.activePlayerID;
    if (!playerID) return [];
  
    return selectors.selectOwnedProperties(state, playerID);
  }
};

export default locationSlice.reducer;

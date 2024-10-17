import { createSlice } from '@reduxjs/toolkit';

import { actions as gameActions } from './game';
import { actions as dealActions } from './deals';
import { actions as sharedActions } from './sharedActions';
import { Location, locations } from '~/data/map';

type Owner = {
  playerID: string;
  percentOwnership: number;
}

export type LocationData = {
  name: string;
  type: Location['type'];
  locationIndex: number; // index in `locations` fixed list
  created: number;
  color: string;
  description: string;
  rent?: number;
  price: number;
  owners: Owner[];
}

// Define a type for the slice state
interface LocationState {
  items: LocationData[];
}

// Define the initial state using that type
const initialState: LocationState = {
  items: [],
};

export const locationSlice = createSlice({
  name: 'locations',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(sharedActions.syncState, (_, action) => {
        return action.payload.locations;
      })
      .addCase(gameActions.newGame, (state) => {
        locations.forEach((location, i) => {
          const locationData: LocationData = {
            type: location.type,
            locationIndex: i,
            created: Date.now(),
            color: location.color,
            name: location.name,
            description: location.description,
            rent: location.type === 'property' ? location.baseRent : location.value || 0,
            price: location.value || 0,
            owners: []
          };
  
          state.items.push(locationData);
        });
      })
      .addCase(dealActions.close, (state, action) => {
        const { deal: { locationIndex }, owners } = action.payload;

        state.items[locationIndex] = {
          ...state.items[locationIndex],
          owners
        }
      });
  },
  reducers: {},
});

export const actions = locationSlice.actions;

export default locationSlice.reducer;

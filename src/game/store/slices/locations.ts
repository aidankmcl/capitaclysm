import { createSlice } from '@reduxjs/toolkit';

import { actions as gameActions } from './game';
import { actions as dealActions } from './deals';
import { actions as sharedActions } from './sharedActions';
import { locations } from '~/data/map';

type Owner = {
  ownerID: string;
  percentOwnership: number;
}

type LocationBase = {
  name: string;
  locationIndex: number; // index in `locations` fixed list
  created: number;
  color: string;
  description: string;
  owners: Owner[];
}

type Property = LocationBase & {
  type: 'property' | 'railroad';
  rent: number;
  price: number;
}

type Utility = LocationBase & {
  type: 'utility';
  rentMultiplier: number;
  price: number;
}

type Event = LocationBase & {
  type: 'event';
  pay: number;
}

export type LocationData = Property | Utility | Event;

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
          const baseData: LocationBase = {
            locationIndex: i,
            created: Date.now(),
            color: location.color,
            name: location.name,
            description: location.description,
            owners: location.type !== 'event' ? [{ ownerID: '123', percentOwnership: 100 }] : []
          };

          switch (location.type) {
            case 'event':
              state.items.push({
                ...baseData,
                type: location.type,
                pay: location.value || 0
              });
              break;
            case 'utility':
              state.items.push({
                ...baseData,
                type: location.type,
                rentMultiplier: location.rent1Multiplier,
                price: location.value || 0
              });
              break;
            case 'railroad':
            case 'property':
              state.items.push({
                ...baseData,
                type: location.type,
                rent: location.type === 'property' ? location.baseRent : location.rent1,
                price: location.value || 0
              });
          }
        });
      })
      .addCase(dealActions.close, (state, action) => {
        const { locationIndex, owners } = action.payload;

        state.items[locationIndex] = {
          ...state.items[locationIndex],
          owners
        };
      });
  },
  reducers: {},
});

export const actions = locationSlice.actions;

export default locationSlice.reducer;

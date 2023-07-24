import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { LocationData } from './locations';
import { actions as sharedActions } from './sharedActions';


export type PropertyDeal = {
  id: string;
  created: number;
  locationIndex: number;
  price: number;
  playerID: string;
  ownerID?: string;
  status: 'pending' | 'accepted' | 'rejected';
  properties?: LocationData[];
}

// Define a type for the slice state
interface DealState {
  pending: Record<string, PropertyDeal>;
  properties: PropertyDeal[];
}

// Define the initial state using that type
const initialState: DealState = {
  pending: {},
  properties: []
};

export const dealSlice = createSlice({
  name: 'deal',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(sharedActions.syncState, (_, action) => {
        return action.payload.deals;
      })
  },
  reducers: {
    offer: (state, action: PayloadAction<{ locationIndex: number, playerID: string, price: number, properties?: LocationData[] }>) => {
      const { locationIndex, playerID, price, properties } = action.payload;

      const deal: PropertyDeal = {
        id: v4(),
        created: Date.now(),
        locationIndex,
        price,
        playerID,
        status: 'pending',
        properties
      }

      state.pending[deal.id] = deal;
    },
    close: (state, action: PayloadAction<{ id: string, status: PropertyDeal['status'], locationIndex: number, owners: LocationData['owners'] }>) => {
      const { id, status } = action.payload;
      const deal = state.pending[id];
      delete state.pending[id];
      state.properties.push({
        ...deal,
        status
      });
    }
  }
});

export const actions = dealSlice.actions;

export default dealSlice.reducer;

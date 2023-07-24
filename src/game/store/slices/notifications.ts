import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { actions as sharedActions } from './sharedActions';

type Notification = {
  created: number;
  title: string;
  content: string;
  type: 'turn' | 'property' | 'payment';
  ownerPlayerID?: string;
  targetPlayerID?: string;
}

// Define a type for the slice state
interface NotificationsState {
  list: Notification[];
}

// Define the initial state using that type
const initialState: NotificationsState = {
  list: []
};

export const notificationssSlice = createSlice({
  name: 'notificationss',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(sharedActions.syncState, (_, action) => {
        return action.payload.notifications;
      })
  },
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.list.push(action.payload);
    }
  },
});

export const actions = notificationssSlice.actions;

export default notificationssSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { v4 as uuid } from "uuid";

import { syncState } from "../actions";

export type Notification = {
  id: string;
  created: number;
  title: string;
  content: string;
  type: "turn" | "property" | "payment";
  ownerPlayerID?: string;
  targetPlayerID?: string;
};

// Define a type for the slice state
interface NotificationsState {
  list: Notification[];
}

// Define the initial state using that type
const initialState: NotificationsState = {
  list: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(syncState, (_, action) => {
        return action.payload.notifications;
      });
  },
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id"> & { id?: string }>) => {
      const notificationWithID: Notification = {
        id: action.payload.id ?? uuid(),
        ...action.payload,
      } as Notification;
      state.list.push(notificationWithID);
    },
  },
});

export const actions = notificationsSlice.actions;

export default notificationsSlice.reducer;

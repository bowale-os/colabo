import { createSlice } from "@reduxjs/toolkit";

const invitesSlice = createSlice({
  name: "invites",
  initialState: {
    pending: []
  },
  reducers: {
    RECEIVE_INVITE(state, action) {
      state.pending.push(action.payload);
    },
    ACCEPT_INVITE(state, action) {
      state.pending = state.pending.filter(
        invite => invite.id !== action.payload.id
      );
    },
    REJECT_INVITE(state, action) {
      state.pending = state.pending.filter(
        invite => invite.id !== action.payload.id
      );
    }
  }
});

// Export the actions and reducer
export const { RECEIVE_INVITE, ACCEPT_INVITE, REJECT_INVITE } = invitesSlice.actions;
export default invitesSlice.reducer;

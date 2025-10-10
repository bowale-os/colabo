// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import invitesReducer from "./invitesSlice";
// Add other slices as needed

export default configureStore({
  reducer: {
    invites: invitesReducer,
    // other reducers
  }
});

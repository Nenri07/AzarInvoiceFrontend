// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  accessToken: "",
  authStatus: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userData = action.payload.userData;    // ← fixed: use userData key
      state.accessToken = action.payload.accessToken;
      state.authStatus = true;
    },
    logout: (state) => {
      state.userData = null;
      state.accessToken = "";
      state.authStatus = false;
    },
    refreshData: (state, action) => {
      state.userData = action.payload.userData;    // ← fixed: use userData
      state.accessToken = action.payload.accessToken;
      state.authStatus = true;
    },
  },
});

// Export actions
export const { login, logout, refreshData } = authSlice.actions;

// Export reducer as default (this is what configureStore needs)
export default authSlice.reducer;
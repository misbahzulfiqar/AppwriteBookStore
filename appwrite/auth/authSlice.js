<<<<<<< HEAD
// src/store/authSlice.js
=======
>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   login: (state, action) => {
    state.status = true;
<<<<<<< HEAD
    state.userData = action.payload.userData; // <- expects action.payload.userData
=======
    state.userData = action.payload.userData;
>>>>>>> 4ee818fb7628ac74c4602c81b05000021aa4ba92
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

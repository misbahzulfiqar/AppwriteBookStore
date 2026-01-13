import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: false,
  userData: null,
  isLoading: true,      // session checking
  authChecked: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   login: (state, action) => {
    state.status = true;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

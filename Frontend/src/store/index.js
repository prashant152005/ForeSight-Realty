import { createSlice, configureStore } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: "",
    isLogedIn: false,
  },
  reducers: {
    login(state) {
      state.isLogedIn = true;
    },
    logout(state) {
      state.isLogedIn = false;
    },
  },
});

export const authActions = authSlice.actions;
export const store = configureStore({
  reducer: authSlice.reducer,
});

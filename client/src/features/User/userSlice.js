import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateIsUserLoggedIn: (state, action) => {
      state.isUserLoggedIn = action.payload;
    },
  },
});

export const { updateIsUserLoggedIn } = userSlice.actions;

export default userSlice.reducer;
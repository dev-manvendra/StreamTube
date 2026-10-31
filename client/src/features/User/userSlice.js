import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserLoggedIn: false,
  user : {}
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateIsUserLoggedIn: (state, action) => {
      state.isUserLoggedIn = action.payload;
    },
    updateUserInfo : (state, action) =>{
      state.user = action.payload
    }
  },
});

export const { updateIsUserLoggedIn, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
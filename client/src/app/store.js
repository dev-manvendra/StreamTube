import { configureStore } from '@reduxjs/toolkit'
import userReducer from "../features/User/userSlice.js";
const store = configureStore({
    reducer : userReducer
});
export default store;
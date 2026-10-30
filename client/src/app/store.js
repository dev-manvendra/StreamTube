import { configurStore } from '@reduxjs/toolkit'
import userReducer from "../features/User/userSlice.js";
const store = configurStore({
    reducer : userReducer
});
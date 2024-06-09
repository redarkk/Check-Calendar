import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import calendarReducer from './calendarSlice'
export interface RootState {
    auth: {
      email: string;
      isLoggedIn: boolean;
      
    },
  }
  
const store=configureStore({
    reducer:{
        auth:authReducer,
        calendar: calendarReducer,
    },
});

export default store;
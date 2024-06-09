import { createSlice } from '@reduxjs/toolkit';

const authSlice=createSlice({
    name:'auth',
    initialState:{
        email:'',
        isLoggedIn:false,
    },
    reducers:{
        LoginSuccess(state,action){
            state.email=action.payload.email;
            state.isLoggedIn=true;
        },
        logout(state){
            state.email='';
            state.isLoggedIn=false;
        },
    },
});



export const {LoginSuccess,logout}=authSlice.actions;
export default authSlice.reducer;



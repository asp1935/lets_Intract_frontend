import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name: 'userReducer',
    initialState: {
        user: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.user = action.payload;
        },
        setLogoutAdmin:(state)=>{
            state.user=null
        }
    }
});

export const { setUserData,setLogoutAdmin } = UserSlice.actions;
export const user = (state) => state.userReducer.user;
export default UserSlice.reducer;
import {createSlice} from '@reduxjs/toolkit'

export const userState = createSlice({
    name:'user',
    initialState: {
        Token: null,
        UserName: null,
    },
    reducers: {
        userLogin(state,action){
            state.Token = action.payload.token
        },
        userName(state,action){
            state.UserName = action.payload.username
        },
        UserLogout(state,action) {
            state.Token = ""
            state.UserName= ""
        }
    },

})
export const {userLogin,userName,UserLogout} = userState.actions
export default userState.reducer
import {createSlice} from '@reduxjs/toolkit'

export const userState = createSlice({
    name:'user',
    initialState: {
        Token: null,
        UserName: null,
        location: null,
        Id: null
    },
    reducers: {
        userLogin(state,action){
            state.Token = action.payload.token
        },
        userName(state,action){
            state.UserName = action.payload.username
        },
        userLocation(state,action){
            state.location = action.payload.location
        },
        userId(state,action){
            state.Id = action.payload.id
        },
        UserLogout(state,action) {
            state.Token = ""
            state.UserName= ""
            state.location= ""
        }
    },

})
export const {userLogin,userName,userLocation,userId,UserLogout} = userState.actions
export default userState.reducer
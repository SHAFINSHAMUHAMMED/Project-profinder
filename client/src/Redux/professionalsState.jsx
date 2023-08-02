import {createSlice} from '@reduxjs/toolkit'

export const professionalState = createSlice({
    name:'professional',
    initialState: {
        Token: null,
        proName: null,
    },
    reducers: {
        proLogin(state,action){
            state.Token = action.payload.token
        },
        proName(state,action){
            state.proName = action.payload.proname
        },
        proLogout(state,action) {
            state.Token = ""
            state.proName= ""
        }
    },

})
export const {proLogin,proName,proLogout} = professionalState.actions
export default professionalState.reducer
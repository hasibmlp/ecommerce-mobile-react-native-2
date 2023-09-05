import { createSlice } from "@reduxjs/toolkit";

const genderSlice = createSlice({
    name: 'gender',
    initialState: {
        current: null
    },
    reducers: {
        changeGender(state, action) {
            state.current = action.payload
        }
    }
})

export const { changeGender } = genderSlice.actions
export default genderSlice.reducer
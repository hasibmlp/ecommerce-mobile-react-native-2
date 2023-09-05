import { createSlice } from "@reduxjs/toolkit";

const genderSlice = createSlice({
    name: 'gender',
    initialState: {
        current: 'women'
    },
    reducers: {
        selectGender(state, action) {
            state.current = action.payload
        }
    }
})

export const { selectGender } = genderSlice.actions
export default genderSlice.reducer
import { configureStore } from "@reduxjs/toolkit";

import genderReducer from './features/gender/genderSlice'

export const store = configureStore({
    reducer: {
        gender: genderReducer,
    }
})
import { configureStore } from "@reduxjs/toolkit";

import genderReducer from './features/gender/genderSlice'
import homedataSlice from "./features/homedata/homedataSlice";

export const store = configureStore({
    reducer: {
        gender: genderReducer,
        homeData: homedataSlice
    }
})
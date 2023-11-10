import { createSlice } from "@reduxjs/toolkit";
import genderSlice from "../gender/genderSlice";

const homeDataSlice = createSlice({
  name: "homeData",
  initialState: {
    value: [],
  },
  reducers: {
    getHomeData(state, action) {
      state.value = [action.payload.mensData, action.payload.womensData, action.payload.kidsData ]
    },
  },
});

export const { getHomeData } = homeDataSlice.actions;
export default homeDataSlice.reducer;

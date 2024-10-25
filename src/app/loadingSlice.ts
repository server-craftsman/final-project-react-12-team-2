import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: false,
  reducers: {
    toggleLoading: (_, action) => action.payload,
    toggleLoadingAdmin: (_, action) => action.payload
  }
});

export const { toggleLoading, toggleLoadingAdmin } = loadingSlice.actions;
export default loadingSlice.reducer;

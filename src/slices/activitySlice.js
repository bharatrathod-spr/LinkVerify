import { createSlice } from "@reduxjs/toolkit";
import { fetchActivity } from "../actions/activityActions";

const initialState = {
  activities: null,
  loading: false,
  error: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearActivity: (state) => {
      state.activities = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      });
  },
});

export const { clearActivity } = activitySlice.actions;

export default activitySlice.reducer;

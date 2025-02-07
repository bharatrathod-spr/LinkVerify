import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserAlerts,
  updateUserAlerts,
  postUserSlackAlerts,
} from "../actions/settingActions";

const initialState = {
  alerts: [],
  loading: false,
  error: null,
  Email: null,
  Slack: null,
  Sms: null,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    clearSetting: (state) => {
      state.alerts = [];
      state.Email = null;
      state.Slack = null;
      state.Sms = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Alert
      .addCase(fetchUserAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchUserAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // post slack User Alerts
      .addCase(postUserSlackAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postUserSlackAlerts.fulfilled, (state, action) => {
        state.loading = false;
        // state.alerts = action.payload;
      })
      .addCase(postUserSlackAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Alerts
      .addCase(updateUserAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(updateUserAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSetting } = settingSlice.actions;

export default settingSlice.reducer;

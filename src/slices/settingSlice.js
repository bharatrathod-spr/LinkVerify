import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserAlerts,
  updateUserAlerts,
  toggleSubscription,
  setAlertFrequency,
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
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
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
      })

      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const { type, subscriber } = action.payload;
        if (state.alerts[type]) {
          state.alerts[type].Subscriber = subscriber;
        }
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Set Frequency Reducer
      .addCase(setAlertFrequency.pending, (state) => {
        state.loading = true;
      })
      .addCase(setAlertFrequency.fulfilled, (state, action) => {
        state.loading = false;
        const { type, frequency } = action.payload;
        if (state.alerts[type]) {
          state.alerts[type].Frequency = frequency;
        }
      })
      .addCase(setAlertFrequency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSetting } = settingSlice.actions;

export default settingSlice.reducer;

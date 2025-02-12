//mailSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMailConfig,
  addMailConfig,
  updateMailConfig,
  deleteMailConfig,
} from "../actions/mailConfigActions";

const initialState = {
  mailConfigList: [],
  loading: false,
  error: null,
};

const mailConfigSlice = createSlice({
  name: "mailConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch mail configurations
    builder
      .addCase(fetchMailConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMailConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.mailConfigList = action.payload;
      })
      .addCase(fetchMailConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add mail configuration
      .addCase(addMailConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMailConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.mailConfigList.push(action.payload);
      })
      .addCase(addMailConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update mail configuration
      .addCase(updateMailConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMailConfig.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.mailConfigList.findIndex(
          (config) => config.id === action.payload.id
        );
        if (index !== -1) {
          state.mailConfigList[index] = action.payload;
        }
      })
      .addCase(updateMailConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete mail configuration
      .addCase(deleteMailConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMailConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.mailConfigList = state.mailConfigList.filter(
          (config) => config.id !== action.payload
        ); // Remove the deleted config
      })
      .addCase(deleteMailConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mailConfigSlice.reducer;

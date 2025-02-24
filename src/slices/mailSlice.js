import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMailConfig,
  fetchMailTable,
  addMailConfig,
  updateMailConfigurations,
  deleteMailConfig,
} from "../actions/mailConfigActions";

const initialState = {
  mailConfigList: [],
  selectedMailConfig: null,
  loading: false,
  error: null,
};

const mailConfigSlice = createSlice({
  name: "mailConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Mail Configs
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

      // Fetch Mail Table (Selected Configuration)
      .addCase(fetchMailTable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMailTable.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMailConfig = action.payload?.[0] || null;
      })
      .addCase(fetchMailTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Mail Config
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

      // Update Mail Config
      .addCase(updateMailConfigurations.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMailConfigurations.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.mailConfigList.findIndex(
          (config) =>
            config.MailConfigurationId === action.payload.MailConfigurationId
        );
        if (index !== -1) {
          state.mailConfigList[index] = action.payload;
        }
      })
      .addCase(updateMailConfigurations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Mail Config
      .addCase(deleteMailConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMailConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.mailConfigList = state.mailConfigList.filter(
          (config) => config.id !== action.payload
        );
      })
      .addCase(deleteMailConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mailConfigSlice.reducer;

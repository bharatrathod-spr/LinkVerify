import { createSlice } from "@reduxjs/toolkit";
import { fetchLogs } from "../actions/logsActions";

const initialState = {
  logs: null,
  loading: false,
  error: null,
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    clearLog: (state) => {
      state.logs = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      });
  },
});

export const { clearLog } = logsSlice.actions

export default logsSlice.reducer;

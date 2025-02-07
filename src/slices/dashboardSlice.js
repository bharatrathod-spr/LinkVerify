import { createSlice } from "@reduxjs/toolkit";
import { fetchSuperUserData, fetchUserData } from "../actions/dashboardActions";

const initialState = {
  graphdata: null,
  pannelData: null,
  userCount: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.graphdata = null;
      state.pannelData = null;
      state.userCount = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetch user dashboard data
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        const { graphdata, pannelData } = action.payload;

        state.loading = false;
        state.graphdata = graphdata;
        state.pannelData = pannelData;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })

      // fetch super user dashboard data
      .addCase(fetchSuperUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperUserData.fulfilled, (state, action) => {
        const { graphdata, pannelData, userCount } = action.payload;

        state.loading = false;
        state.graphdata = graphdata;
        state.pannelData = pannelData;
        state.userCount = userCount;
      })
      .addCase(fetchSuperUserData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;

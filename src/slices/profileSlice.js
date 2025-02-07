import { createSlice } from "@reduxjs/toolkit";
import {
  createProfile,
  deleteProfile,
  fetchProfileDetails,
  fetchProfileLogDetail,
  fetchProfiles,
  updateProfile,
} from "../actions/profileActions";

const initialState = {
  profiles: null,
  selectedProfile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    deselectProfile: (state) => {
      state.selectedProfile = null;
    },
    clearProfile: (state) => {
      state.profiles = null;
      state.selectedProfile = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })

      .addCase(fetchProfileDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProfile = action.payload;
      })
      .addCase(fetchProfileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })

      .addCase(fetchProfileLogDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileLogDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProfile = action.payload;
      })
      .addCase(fetchProfileLogDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })

      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profiles) {
          state.profiles.push(action.payload);
        } else {
          state.profiles = [action.payload];
        }
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profiles) {
          const index = state.profiles.findIndex(
            (profile) =>
              profile.ValidationProfileId === action.payload.profileId
          );
          if (index !== -1) {
            state.profiles[index] = {
              ...state.profiles[index],
              ...action.payload,
            };
          }
        }
        if (
          state.selectedProfile &&
          state.selectedProfile.ValidationProfileId === action.payload.profileId
        ) {
          state.selectedProfile = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })

      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = state.profiles.filter(
          (profile) => profile.ValidationProfileId !== action.payload.profileId
        );
        if (
          state.selectedProfile &&
          state.selectedProfile.ValidationProfileId === action.payload.profileId
        ) {
          state.selectedProfile = null;
        }
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      });
  },
});

export const { deselectProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;

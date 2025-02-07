import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helpers/axiosInstance";
import { toast } from "react-toastify";
import { rejectAction } from "./rejectAction";

export const fetchProfiles = createAsyncThunk(
  "profile/fetchProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/validation-profiles");

      return response.data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const fetchProfileDetails = createAsyncThunk(
  "profile/fetchProfileDetails",
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/validation-profiles/${profileId}`
      );

      const data = {
        SourceLink: response.data?.SourceLink || "",
        SearchLink: response.data?.SearchLink || "",
        Description: response.data?.Description || "",
        cronExpression: {
          occurrence:
            Number(response.data?.CronExpression?.split(" ")[0] || 0) || "",
          period: response.data?.CronExpression?.split(" ")[1] || "minutes",
        },
      };

      return data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/validation-profiles/${profileId}`
      );

      toast.success(response.data.message || "Profile deleted successful!");

      return { ...response.data, profileId };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (profile, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/validation-profiles",
        profile
      );
      toast.success(response.data.message || "Profile created successful!");

      return response.data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ profileId, profile }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/validation-profiles/${profileId}`,
        profile
      );

      toast.success(response.data.message || "Profile updated successful!");

      return { ...profile, profileId };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const fetchProfileLogDetail = createAsyncThunk(
  "profile/fetchProfileLogDetail",
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/validation-profiles/logs/${profileId}`
      );

      const data = response.data;

      return data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helpers/axiosInstance";
import { rejectAction } from "./rejectAction";

export const fetchActivity = createAsyncThunk(
  "activity/fetchActivity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/activity");

      return response.data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

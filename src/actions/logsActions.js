import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helpers/axiosInstance";
import { rejectAction } from "./rejectAction";

// export const fetchLogs = createAsyncThunk(
//   "logs/fetchLogs",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get("/validation-logs");

//       return response.data;
//     } catch (error) {
//       return rejectAction(error, rejectWithValue);
//     }
//   }
// );

export const fetchLogs = createAsyncThunk(
  "logs/fetchLogs",
  async ({ date } = {}, { rejectWithValue }) => {
    try {
      if (!date) {
        throw new Error("Date parameter is required");
      }

      const response = await axiosInstance.get("/validation-logs", {
        params: { date },
      });

      return response.data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

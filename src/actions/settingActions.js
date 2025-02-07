import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helpers/axiosInstance";
import { rejectAction } from "./rejectAction";
import { toast } from "react-toastify";

export const fetchUserAlerts = createAsyncThunk(
  "setting/fetchUserAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/alert-subsription");
      const data = response.data.alerts[0].Alerts;

      const email = data.find((item) => item.Type === "email");

      const sms = data.find((item) => item.Type === "sms");

      const slack = data.find((item) => item.Type === "slack");

      return {
        Email: email,
        Sms: sms,
        Slack: slack,
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error fetching user alerts";
      console.error("Error fetching user alerts:", errorMessage);
      return rejectAction(errorMessage, rejectWithValue);
    }
  }
);

export const updateUserAlerts = createAsyncThunk(
  "setting/updateUserAlerts",
  async (alert, { rejectWithValue }) => {
    try {
      const transformedAlerts = Object.entries(alert).flatMap(
        ([type, events]) =>
          Object.entries(events).map(([event, subscriber]) => ({
            Type: type.toLowerCase(),
            Event: event.toLowerCase(),
            Subscriber: subscriber,
          }))
      );

      const payload = { Alerts: transformedAlerts };

      const response = await axiosInstance.patch(`/alert-subsription`, payload);
      toast.success(response.data.message || "Setting updated successfully");

      return alert;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

// export const postUserSlackAlerts = createAsyncThunk(
//   "setting/postUserSlackAlerts",
//   async (type, { rejectWithValue }) => {
//     try {
//       // Make the API call to post the Slack alert
//       const response = await axiosInstance.post("/alert-subsription", type);

//       if (response.data.success) {
//         toast.success(
//           response.data.message || "Slack notification sent successfully"
//         );
//       } else {
//         toast.error(
//           response.data.message || "Failed to send Slack notification"
//         );
//       }

//       return response.data; // You can return the response data or transformed data here
//     } catch (error) {
//       return rejectAction(error, rejectWithValue);
//     }
//   }
// );

export const postUserSlackAlerts = createAsyncThunk(
  "setting/postUserSlackAlerts",
  async (type, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/alert-subsription", type);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to send notification."
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred."
      );
    }
  }
);

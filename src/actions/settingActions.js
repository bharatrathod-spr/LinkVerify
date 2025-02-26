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

      const slack = data.find((item) => item.Type === "slack");

      return {
        Email: email,
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
      toast.success(response.data.message || "Setting updated successfully!");

      return alert;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const updateMailConfig = createAsyncThunk(
  "mailConfig/update",
  async (selectedConfigId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/alert-subsription/addMailConfiguration",
        {
          MailConfigurationId: selectedConfigId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleSubscription = createAsyncThunk(
  "setting/toggleSubscription",
  async (type, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/alert-subsription/toggleSubscription",
        {
          Type: type,
        }
      );

      return { type, subscriber: response.data.success };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const setAlertFrequency = createAsyncThunk(
  "setting/setAlertFrequency",
  async ({ type, frequency }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/alert-subsription/setAlertFrequency",
        {
          Type: type,
          Frequency: frequency,
        }
      );

      return { type, frequency };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

//MailConfigActions.jsx
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helpers/axiosInstance";
import { toast } from "react-toastify";

export const fetchMailConfig = createAsyncThunk(
  "mailConfig/fetchMailConfig",
  async (UserId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/mail-config/${UserId}`);
      return response.data.result || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMailTable = createAsyncThunk(
  "mailConfig/fetchMailTable",
  async (UserId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/mail-config/selectedmail/${UserId}`
      );
      return response.data.result || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMailById = createAsyncThunk(
  "mailConfig/fetchMailById",
  async (configId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/mail-config/mail-config/${configId}`
      );
      return response.data.result || [];
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const addMailConfig = createAsyncThunk(
  "mailConfig/addMailConfig",
  async ({ userId, config }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/mail-config", {
        ...config,
        userId,
      });
      toast.success("Mail configuration added successfully!");
      return response.data.data;
    } catch (error) {
      toast.error("Failed to add mail configuration.");
      return rejectWithValue(error.message);
    }
  }
);

export const updateMailConfigurations = createAsyncThunk(
  "mailConfig/updateMailConfig",
  async ({ MailConfigurationId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/mail-config/${MailConfigurationId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating mail config"
      );
    }
  }
);

export const deleteMailConfig = createAsyncThunk(
  "mailConfig/deleteMailConfig",
  async ({ configId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/mail-config/${configId}`);
      toast.success("Mail configuration deleted successfully!");
      return configId;
    } catch (error) {
      toast.error("Failed to delete mail configuration.");
      return rejectWithValue(error.message);
    }
  }
);

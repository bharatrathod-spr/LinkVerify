import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helpers/axiosInstance";
import { toast } from "react-toastify";
import { rejectAction } from "./rejectAction";

const toastOptions = {
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const verifyToken = createAsyncThunk(
  "user/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users");

      return response.data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", credentials);
      toast.success(response.data.message || "Login successful!", toastOptions);

      return {
        ...response.data,
        user: { ...response.data.user, Password: credentials.Password },
      };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users", credentials);
      toast.success(response.data.message || "Sign-up successful!", toastOptions);

      return response.data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (createuser, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users", {
        ...createuser,
        CreatedBy: "super_user",
      });
      toast.success(response.data.message || "User added successfully", toastOptions);

      return response.data;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (credentials, { rejectWithValue }) => {
    try {
      await axiosInstance.patch("/users", credentials);
      toast.success("User updated successfully!");

      return credentials;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, user }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}`, user);
      toast.success("User updated successfully");

      return {
        ...response.data,
        userId,
        IsActive: response.data.IsActive ? "Active" : "Inactive",
        Name: `${response.data?.FirstName || ""} ${
          response.data?.LastName || ""
        }`,
      };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      toast.success("User deleted successfully!");

      return { userId };
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/all-users`);

      const users =
        response?.data?.map((item) => ({
          ...item,
          Name: `${item.FirstName || ""} ${item.LastName}`,
          IsActive: item.IsActive ? "Active" : "Inactive",
        })) || [];

      return users;
    } catch (error) {
      return rejectAction(error, rejectWithValue);
    }
  }
);

export const updatePassword = async (formData, userId) => {
  try {
    const response = await axiosInstance.patch(`/users/PassUpdate/${userId}`, {
      Password: formData.OldPassword,
      newPassword: formData.Password,
      confirmNewPassword: formData.ConfirmPassword,
    });

    toast.success(response.data.message);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to update password";

    toast.error(errorMessage);

    throw errorMessage;
  }
};

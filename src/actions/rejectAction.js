import { toast } from "react-toastify";

export const rejectAction = (error, rejectWithValue) => {
  const message =
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message;

  if (error.response?.status === 403 || error.response?.status === 404) {
    toast.error(message || "An error occurred. Please try again.");
    return rejectWithValue(message);
  }

  toast.error(message || "An error occurred. Please try again.");
  return rejectWithValue(message);
};

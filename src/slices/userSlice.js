import { createSlice } from "@reduxjs/toolkit";
import {
  verifyToken,
  loginUser,
  updateProfile,
  signUpUser,
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} from "../actions/userActions";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  users: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    // Verify Token
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify token";
        state.isAuthenticated = false;
        localStorage.clear();
      })

      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify token";
        state.isAuthenticated = false;
        localStorage.clear();
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify token";
        state.isAuthenticated = false;
        localStorage.clear();
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.loading = false;
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.Role);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Signup User
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.loading = false;
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.Role);
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        const { user } = action.payload;
        state.loading = false;
        state.users = [...state.users, user];
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        if (state.users) {
          const index = state.users.findIndex(
            (user) => user.UserId === updatedUser.userId
          );
          if (index !== -1) {
            state.users[index] = {
              ...state.users[index],
              ...updatedUser,
            };
          }
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.UserId !== action.payload.userId
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Something is wrong! Please try after sometime.";
      })
      .addCase("user/forgotPasswordStart", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("user/forgotPasswordSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase("user/forgotPasswordFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Reset Password
      .addCase("user/resetPasswordStart", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("user/resetPasswordSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase("user/resetPasswordFailure", (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;

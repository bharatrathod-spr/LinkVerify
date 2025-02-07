const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUser,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  getUserDashboardData,
  getSuperUserDashboardData,
  updatePassword,
} = require("../controllers/userController");

const {
  validateLogin,
  validateUpdateUser,
  validateForgotPassword,
  validateResetPassword,
  validateCreateUser,
  validateUpdateUserProfile,
  validateUpdatePassword,
} = require("../validators/userValidator");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ======== GET APIS ========

// Get all users
router.get("/all-users", authenticateToken, getUsers);

// Get user
router.get("/", authenticateToken, getUser);

// Get user dashboard data
router.get("/user_dashboard", authenticateToken, getUserDashboardData);

// Get user dashboard data
router.get("/dashboard", authenticateToken, getSuperUserDashboardData);

// ======== POST APIS ========

// Create a user
router.post("/", validateCreateUser, createUser);

// Login a user
router.post("/login", validateLogin, loginUser);

// Forgot user password
router.post("/forgot-password", validateForgotPassword, forgotPassword);

// Reset user password
router.post("/reset-password", validateResetPassword, resetPassword);

//Update user password
router.patch(
  "/PassUpdate/:UserId",
  authenticateToken,
  validateUpdatePassword,
  updatePassword
);

// ======== PATCH APIS ========

// Update a user profile (partial update)
router.patch(
  "/",
  authenticateToken,
  validateUpdateUserProfile,
  updateUserProfile
);

// Update a user by UserId (partial update)
router.patch("/:userId", authenticateToken, validateUpdateUser, updateUser);

// ======== DELETE APIS ========

// Delete a user by UserId (soft delete)
router.delete("/:userId", authenticateToken, deleteUser);

module.exports = router;

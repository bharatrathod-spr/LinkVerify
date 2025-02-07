const express = require("express");

const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfiles,
  getProfileLogs,
} = require("../controllers/profileController");

const {
  validateCreateProfile,
  validateUpdateProfile,
} = require("../validators/profileValidator");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ======== GET APIS ========

// Get all profiles
router.get("/", authenticateToken, getProfiles);

// Get profile
router.get("/:profileId", authenticateToken, getProfile);

// Get profile details
router.get("/logs/:profileId", authenticateToken, getProfileLogs);

// ======== POST APIS ========

// Create a profile
router.post("/", authenticateToken, validateCreateProfile, createProfile);

// ======== PATCH APIS ========

// Update a profile by ProfileId (partial update)
router.patch(
  "/:profileId",
  authenticateToken,
  validateUpdateProfile,
  updateProfile
);

// ======== DELETE APIS ========

// Delete a profile by ProfileId (soft delete)
router.delete("/:profileId", authenticateToken, deleteProfile);

module.exports = router;

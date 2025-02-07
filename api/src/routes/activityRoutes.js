const express = require("express");

const { getActivities } = require("../controllers/activityController");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ======== GET APIS ========

// Get all logs
router.get("/", authenticateToken, getActivities);

// ======== POST APIS ========

// ======== PATCH APIS ========

// ======== DELETE APIS ========

module.exports = router;

const express = require("express");

const { getLogs } = require("../controllers/logsController");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ======== GET APIS ========

// Get all logs
router.get("/", authenticateToken, getLogs);

// ======== POST APIS ========

// ======== PATCH APIS ========

// ======== DELETE APIS ========

module.exports = router;

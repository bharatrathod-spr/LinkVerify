const express = require("express");
const router = express.Router();
const {
  getAlerts,
  updateAlerts,
  postSlackAlerts,
  addMailConfiguration,
} = require("../controllers/alertController");

const { authenticateToken } = require("../middlewares/authMiddleware");

// ======== GET APIS ========

router.get("/", authenticateToken, getAlerts);

// ======== POST APIS ========

router.post("/", authenticateToken, postSlackAlerts);

router.post("/addMailConfiguration", authenticateToken, addMailConfiguration);

// ======== PATCH APIS ========

router.patch("/", authenticateToken, updateAlerts);

// ======== DELETE APIS ========

module.exports = router;

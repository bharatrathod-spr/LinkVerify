const express = require("express");
const router = express.Router();
const {
  getAlerts,
  updateAlerts,
  postSlackAlerts,
  setAlertFrequency,
  toggleSubscription,
  addMailConfiguration,
} = require("../controllers/alertController");

const { authenticateToken } = require("../middlewares/authMiddleware");

// ======== GET APIS ========

router.get("/", authenticateToken, getAlerts);

// ======== POST APIS ========

// router.post("/", authenticateToken, postSlackAlerts);

router.post("/addMailConfiguration", authenticateToken, addMailConfiguration);

// ======== PATCH APIS ========

router.patch("/", authenticateToken, updateAlerts);

router.patch("/setAlertFrequency", authenticateToken, setAlertFrequency);

router.patch("/toggleSubscription", authenticateToken, toggleSubscription);

// ======== DELETE APIS ========

module.exports = router;

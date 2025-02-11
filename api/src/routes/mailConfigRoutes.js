const express = require("express");

const {
  createMailConfiguration,
  getMailConfigurationDetails,
  updateMailConfiguration,
  deleteMailConfiguration,
} = require("../controllers/mailConfigController");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ======== GET APIS ========

router.get("/:userId", authenticateToken, getMailConfigurationDetails);

// ======== POST APIS ========
router.post("/", authenticateToken, createMailConfiguration);

// ======== PATCH APIS ========
router.patch("/", authenticateToken, updateMailConfiguration);

// ======== DELETE APIS ========
router.delete("/", authenticateToken, deleteMailConfiguration);

module.exports = router;

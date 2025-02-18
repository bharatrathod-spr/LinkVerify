const express = require("express");

const {
  createMailConfiguration,
  getMailConfiguration,
  getMailConfigurationDetails,
  updateMailConfiguration,
  deleteMailConfiguration,
  getMailConfigurationByAlertSubscription,
} = require("../controllers/mailConfigController");

const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// ======== GET APIS ========

router.get("/:UserId", authenticateToken, getMailConfigurationDetails);

router.get(
  "/selectedmail/:UserId",
  authenticateToken,
  getMailConfigurationByAlertSubscription
);

router.get(
  "/mail-config/:MailConfigurationId",
  authenticateToken,
  getMailConfiguration
);

// ======== POST APIS ========
router.post("/", authenticateToken, createMailConfiguration);

// ======== PUT APIS ========
router.put("/:MailConfigurationId", authenticateToken, updateMailConfiguration);

// ======== DELETE APIS ========
router.delete(
  "/:MailConfigurationId",
  authenticateToken,
  deleteMailConfiguration
);

module.exports = router;

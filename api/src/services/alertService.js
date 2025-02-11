const Alert = require("../models/alertModel"); // Your User model

// ===== CREATE DEFAULT ALERT =====
const createAlertData = async (data) => {
  return await Alert.find({ data });
};

// ===== GET ALERT =====
const getAllAlert = async (UserId) => {
  return await Alert.find({ UserId, IsDelete: false });
};

// ===== UPDATE ALERTS BY USERID =====
const updateAlertsByUserId = async (UserId, Alerts) => {
  try {
    const { Type, Frequency } = req.body;

    const alert = await Alert.findOneAndUpdate(
      { UserId: req.user.id, "Alerts.Type": Type },
      { $set: { "Alerts.$.Frequency": Frequency } },
      { new: true }
    );

    if (!alert) {
      return res
        .status(404)
        .json({ success: false, message: "Alert not found" });
    }

    res.json({
      success: true,
      message: "Frequency updated successfully",
      alert,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateAlertsByUserId,
  getAllAlert,
  createAlertData,
};

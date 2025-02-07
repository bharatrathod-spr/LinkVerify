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
  return await Alert.findOneAndUpdate(
    { UserId, IsDelete: false },
    { $set: { Alerts } },
    { new: true }
  );
};

module.exports = {
  updateAlertsByUserId,
  getAllAlert,
  createAlertData,
};

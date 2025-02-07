const {
  getAllActivities,
  saveActivity,
} = require("../services/activityService");

// Get all activities
const getActivities = async (req, res) => {
  try {
    const { UserId } = req.user;
    const activities = await getAllActivities({
      UserId,
      IsDelete: false,
      ActivityBy: { $ne: "cronjob" },
    });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create activity
const createActivity = async (req, res) => {
  try {
    const activity = await saveActivity(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getActivities,
  createActivity,
};

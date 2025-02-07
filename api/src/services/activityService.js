const Activity = require("../models/activityModel");

// Get all activities
const getAllActivities = async (filter) => {
  return await Activity.find(filter);
};

// Save new activity
const saveActivity = async (activityData) => {
  const activity = new Activity(activityData);
  return await activity.save();
};

module.exports = {
  getAllActivities,
  saveActivity,
};

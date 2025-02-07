const Profile = require("../models/profileModel");

// Get all profiles
const getAllProfiles = async (filter) => {
  return await Profile.find(filter);
};

// Save new profile
const getNextProfileIndex = async (UserId) => {
  const maxProfile = await Profile.findOne({
    UserId,
  })
    .sort({ ProfileIndex: -1 })
    .limit(1);

  return maxProfile ? maxProfile.ProfileIndex + 1 : 1;
};

// Save new profile
const saveProfile = async (profileData) => {
  const profile = new Profile(profileData);
  return await profile.save();
};

// Get profile by ID
const getProfileById = async (profileId, filter) => {
  return await Profile.findOne({
    ...filter,
    ValidationProfileId: profileId,
  });
};

// Update profile by ID
const updateProfileById = async (profileId, updatedData) => {
  return await Profile.findOneAndUpdate(
    { ValidationProfileId: profileId },
    updatedData,
    {
      new: true,
    }
  );
};

// Soft delete profile by ID
const deleteProfileById = async (profileId) => {
  return await Profile.findOneAndUpdate(
    { ValidationProfileId: profileId },
    { IsDelete: true }, // Mark as deleted
    { new: true }
  );
};

module.exports = {
  getAllProfiles,
  saveProfile,
  getProfileById,
  updateProfileById,
  deleteProfileById,
  getNextProfileIndex,
};

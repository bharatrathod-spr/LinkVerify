const { filterLogs } = require("../services/logsService");
const {
  getAllProfiles,
  saveProfile,
  getProfileById,
  updateProfileById,
  deleteProfileById,
  getNextProfileIndex,
} = require("../services/profileService");

const { logActivity } = require("../utils/commonUtils");
const ProfileCounts = require("../models/profileCountModel");
const profileCountModel = require("../models/profileCountModel");

// Get all profiles
const getProfiles = async (req, res) => {
  try {
    const { UserId } = req.user;
    const profiles = await getAllProfiles({ UserId, IsDelete: false });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get profile
const getProfile = async (req, res) => {
  const { profileId } = req.params;
  try {
    const profile = await getProfileById(profileId, { IsDelete: false });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get profile logs
const getProfileLogs = async (req, res) => {
  const { profileId } = req.params;

  try {
    const profile = await getProfileById(profileId, { IsDelete: false });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const aggregateData = await ProfileCounts.aggregate([
      {
        $match: {
          ValidationProfileId: profileId,
          IsDelete: false,
        },
      },
      {
        $group: {
          _id: null,
          totalSuccessCount: { $sum: "$SuccessCount" },
          totalFailureCount: { $sum: "$FailureCount" },
          totalValidations: {
            $sum: { $add: ["$SuccessCount", "$FailureCount"] },
          },
        },
      },
    ]);

    const totalValidations =
      aggregateData.length > 0 ? aggregateData[0].totalValidations : 0;
    const successCount =
      aggregateData.length > 0 ? aggregateData[0].totalSuccessCount : 0;
    const failureCount =
      aggregateData.length > 0 ? aggregateData[0].totalFailureCount : 0;

    const validationLogs = await filterLogs([
      {
        $match: {
          ValidationProfileId: profileId,
          IsDelete: false,
        },
      },
      {
        $group: {
          _id: null,
          lastFailureReasons: { $push: "$FailureReasons" },
        },
      },
    ]);

    const logSummary = validationLogs[0] || { lastFailureReasons: [] };

    res.status(200).json({
      validationProfile: profile,
      logSummary: {
        totalValidations,
        successCount,
        failureCount,
        recentFailureReasons: logSummary.lastFailureReasons.slice(-5),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create profile
const createProfile = async (req, res) => {
  try {
    const profileIndex = await getNextProfileIndex(req.user.UserId);
    const profile = await saveProfile({
      ...req.body,
      ProfileIndex: profileIndex,
      UserId: req.user.UserId,
    });

    // Log the activity
    await logActivity(
      req.user.UserId,
      "CREATE",
      "Audit Profile",
      profile.ValidationProfileId,
      "POST",
      {
        NewData: profile,
      }
    );

    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update profile (partial update)
const updateProfile = async (req, res) => {
  const { profileId } = req.params;
  try {
    const profile = await getProfileById(profileId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const updatedProfileData = { ...req.body };
    const updatedProfile = await updateProfileById(
      profileId,
      updatedProfileData
    );

    await logActivity(
      req.user.UserId,
      "UPDATE",
      "Audit Profile",
      profileId,
      "PATCH",
      {
        oldData: profile,
        newData: updatedProfile,
      }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete profile (soft delete)
const deleteProfile = async (req, res) => {
  const { profileId } = req.params;
  try {
    const profile = await getProfileById(profileId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const deletedProfile = await deleteProfileById(profileId);

    await profileCountModel.updateMany(
      { ValidationProfileId: profileId },
      { IsDelete: true }
    );

    // Log the activity
    await logActivity(
      req.user.UserId,
      "DELETE",
      "Audit Profile",
      profileId,
      "DELETE",
      {
        oldData: profile,
      }
    );

    res.status(200).json({
      message: "Profile deleted successfully",
      profile: deletedProfile,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfile,
  getProfileLogs,
};

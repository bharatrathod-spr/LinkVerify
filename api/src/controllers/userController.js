const moment = require("moment");
const { filterLogs } = require("../services/logsService");
const {
  getAllUsers,
  saveUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
  findUserByEmail,
} = require("../services/userService");

const {
  hashPassword,
  generateToken,
  sendEmail,
  verifyToken,
  logActivity,
  comparePassword,
} = require("../utils/commonUtils");
const { createAlert } = require("./alertController");
const profileCountModel = require("../models/profileCountModel");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers({ IsDelete: false });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user
const getUser = async (req, res) => {
  const { UserId } = req.user;
  try {
    const user = await getUserById(UserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfileCountData = async (UserId) => {
  try {
    const data = await profileCountModel
      .find({
        UserId,
        IsDelete: false,
      })
      .sort({ date: -1 });

    return data.map((item) => ({
      date: item.Date,
      success: item.SuccessCount,
      failure: item.FailureCount,
      failure: item.FailureCount,
      ResponseTime: item.ResponseTime,
      validationProfileId: item.ValidationProfileId,
    }));
  } catch (error) {
    throw new Error(`Error fetching profile count data: ${error.message}`);
  }
};

const getUserDashboardData = async (req, res) => {
  const { UserId } = req.user;

  try {
    const [user, profileCountData, validationProfiles, lastErrors] =
      await Promise.all([
        getUserById(UserId),
        getProfileCountData(UserId),
        filterLogs([
          {
            $lookup: {
              from: "validation-profiles",
              localField: "ValidationProfileId",
              foreignField: "ValidationProfileId",
              as: "ValidationProfile",
            },
          },
          { $unwind: "$ValidationProfile" },
          {
            $match: {
              "ValidationProfile.IsDelete": false,
            },
          },
          {
            $project: {
              validationProfileId: "$ValidationProfile.ValidationProfileId",
              description: "$ValidationProfile.Description",
              profileIndex: "$ValidationProfile.ProfileIndex",
            },
          },
        ]),
        filterLogs([
          {
            $match: {
              UserId,
              IsDelete: false,
              IsSuccess: false,
            },
          },
          {
            $lookup: {
              from: "validation-profiles",
              let: { validationProfileId: "$ValidationProfileId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [
                            "$ValidationProfileId",
                            "$$validationProfileId",
                          ],
                        },
                        { $eq: ["$IsDelete", false] },
                      ],
                    },
                  },
                },
              ],
              as: "ValidationProfile",
            },
          },
          { $unwind: "$ValidationProfile" },
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $project: {
              ValidationProfileId: 1,
              FailureReasons: 1,
              createdAt: 1,
            },
          },
        ]),
      ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validationProfileMap = validationProfiles.reduce((map, item) => {
      map[item.validationProfileId] = item;
      return map;
    }, {});

    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
    });

    const reshapedProfileCountData = profileCountData.reduce((acc, item) => {
      const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      const profileDetails =
        validationProfileMap[item.validationProfileId] || {};

      const profileKey = `Profile-${profileDetails.profileIndex || "Unknown"}`;
      if (!acc[formattedDate]) acc[formattedDate] = { date: formattedDate };

      acc[formattedDate][profileKey] = {
        success: item.success,
        failure: item.failure,
        responseTime: item.ResponseTime,
        validationProfileId: item.validationProfileId,
        description: profileDetails.description || "Unknown",
      };

      return acc;
    }, {});

    const finalSuccessFailureData = last7Days.map((date) => {
      const profiles = reshapedProfileCountData[date] || {};
      const flatProfiles = Object.entries(profiles)
        .filter(([key]) => key !== "date")
        .reduce(
          (acc, [profileKey, profileData]) => ({
            ...acc,
            [`${profileKey}_success`]: profileData.success || 0,
            [`${profileKey}_failure`]: profileData.failure || 0,
            [`${profileKey}_id`]: profileData.validationProfileId || null,
            [`${profileKey}_description`]: profileData.description || null,
          }),
          {}
        );
      return { date, ...flatProfiles };
    });

    const finalResponseTimeData = last7Days.map((date) => {
      const profiles = reshapedProfileCountData[date] || {};
      const flatProfiles = Object.entries(profiles)
        .filter(([key]) => key !== "date")
        .reduce(
          (acc, [profileKey, profileData]) => ({
            ...acc,
            [`${profileKey}`]: profileData.responseTime || 0,
            [`${profileKey}_id`]: profileData.validationProfileId || null,
            [`${profileKey}_description`]: profileData.description || null,
          }),
          {}
        );
      return { date, ...flatProfiles };
    });

    const status =
      finalSuccessFailureData.length > 0 ||
      finalResponseTimeData.length > 0 ||
      lastErrors.length > 0
        ? 200
        : 404;

    res.status(status).json({
      successFailureData: finalSuccessFailureData,
      responseTimeData: finalResponseTimeData,
      lastErrors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSuperUserDashboardData = async (req, res) => {
  try {
    let users = await getAllUsers({ IsDelete: false, Role: "user" });

    if (users.length > 0) {
      const currentYear = moment().year();
      const previousYear = currentYear - 1;

      const monthlyData = {};
      let activeCount = 0;
      let inactiveCount = 0;

      users.forEach((user) => {
        const userDate = moment.utc(user.createdAt);
        const userYear = userDate.year();
        const userMonth = userDate.format("MM");

        if (user.IsActive) {
          activeCount++;
        } else {
          inactiveCount++;
        }

        if (!monthlyData[userMonth]) {
          monthlyData[userMonth] = {
            thisYear: 0,
            lastYear: 0,
          };
        }
        if (userYear === currentYear) {
          monthlyData[userMonth].thisYear++;
        } else if (userYear === previousYear) {
          monthlyData[userMonth].lastYear++;
        }
      });

      const monthlyArrivals = Object.keys(monthlyData).map((month) => ({
        month,
        ...monthlyData[month],
      }));

      res.status(200).json({ monthlyArrivals, activeCount, inactiveCount });
    } else {
      res.status(404).json({ message: "Users data not found!" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//SignUp
const createUser = async (req, res) => {
  try {

    const existingUser = await findUserByEmail(req.body.EmailAddress);
    if (existingUser) {
      return res.status(400).json({ error: "Email address already exists" });
    }

    if (req.body.Password) {
      req.body.Password = await hashPassword(req.body.Password);
    }

    const user = await saveUser(req.body);

    await logActivity(
      req.body?.UserId || user?.UserId,
      "CREATE",
      "User",
      user.UserId,
      "POST",
      {
        NewData: user,
      }
    );

    await createAlert({ UserId: user.UserId });

    let token;
    if (req.body?.CreatedBy !== "super_user") {
      token = generateToken({
        UserId: user.UserId,
        EmailAddress: user.EmailAddress,
      });
    }

    res.status(201).json({
      user: {
        ...user.toObject(),
        Name: `${user.FirstName || ""} ${user.LastName}`,
        IsActive: "Active",
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user (partial update)
const updateUserProfile = async (req, res) => {
  const { UserId } = req.user;
  try {
    const user = await getUserById(UserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUserData = { ...req.body };

    if (updatedUserData.Password) {
      updatedUserData.Password = await hashPassword(updatedUserData.Password);
    }

    const updatedUser = await updateUserById(UserId, updatedUserData);

    await logActivity(UserId, "UPDATE", "User", UserId, "PATCH", {
      oldData: user,
      newData: updatedUser,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user (partial update)
const updateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUserData = { ...req.body };

    if (updatedUserData.Password) {
      updatedUserData.Password = await hashPassword(updatedUserData.Password);
    }

    const updatedUser = await updateUserById(userId, updatedUserData);

    await logActivity(userId, "UPDATE", "User", userId, "PATCH", {
      oldData: user,
      newData: updatedUser,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = await deleteUserById(userId);

    await logActivity(
      req.user.UserId,
      "DELETE",
      "User",
      userId,
      "DELETE",
      {
        oldData: user,
      },
      "super_user"
    );

    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { EmailAddress, Password } = req.body;

  try {
    const user = await getUserByEmail(EmailAddress);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await comparePassword(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = generateToken({
      UserId: user.UserId,
      EmailAddress: user.EmailAddress,
    });

    await logActivity(user.UserId, "LOGIN", "User", user.UserId, "POST", {});

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  const { EmailAddress } = req.body;

  try {
    const user = await getUserByEmail(EmailAddress);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = generateToken({ UserId: user.UserId });

    const resetLink = `https://example.com/reset-password?token=${resetToken}`;
    await sendEmail(
      EmailAddress,
      "Password Reset",
      `You requested a password reset. Click the link to reset: ${resetLink}`
    );

    // Log the activity
    await logActivity(
      user.UserId,
      "FORGOT_PASSWORD",
      "User",
      user.UserId,
      "POST",
      { email: EmailAddress, resetLink },
      "system"
    );

    res
      .status(200)
      .json({ message: "Password reset email sent successfully", resetLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  const { Token, Password } = req.body;

  try {
    const decoded = verifyToken(Token);
    const userId = decoded.UserId;

    const hashedPassword = await hashPassword(Password);

    await updateUserById(userId, { Password: hashedPassword });

    await logActivity(
      userId,
      "RESET_PASSWORD",
      "User",
      userId,
      "PATCH",
      { message: "Password reset successfully" },
      "user"
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update Password
const updatePassword = async (req, res) => {
  const { UserId } = req.user;
  const { Password, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await getUserById(UserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await comparePassword(Password, user.Password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    const isSameAsOldPassword = await comparePassword(
      newPassword,
      user.Password
    );

    if (isSameAsOldPassword) {
      return res.status(400).json({
        error: "New password must not be the same as the old password",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await updateUserById(UserId, { Password: hashedPassword });

    await logActivity(UserId, "UPDATE", "User", UserId, "PATCH", {
      NewData: { Password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUserProfile,
  updateUser,
  deleteUser,
  loginUser,
  getUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  getUserDashboardData,
  getSuperUserDashboardData,
};

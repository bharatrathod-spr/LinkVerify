const User = require("../models/userModel");

// Get all users
const getAllUsers = async () => {
  return await User.find({ IsDelete: false, Role: "user" });
};

// Save new user
const saveUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByEmail = async (email) => {
  return await User.findOne({ EmailAddress: email });
};

// Get user by ID
const getUserById = async (userId) => {
  return await User.findOne({ UserId: userId });
};

// Update user by ID
const updateUserById = async (userId, updatedData) => {
  return await User.findOneAndUpdate({ UserId: userId }, updatedData, {
    new: true,
  });
};

// Soft delete user by ID
const deleteUserById = async (userId) => {
  return await User.findOneAndUpdate(
    { UserId: userId },
    { IsDelete: true }, // Mark as deleted
    { new: true }
  );
};

// Get user by Email
const getUserByEmail = async (email) => {
  try {
    return await User.findOne({
      EmailAddress: email,
      IsDelete: false,
      IsActive: true,
    });
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

module.exports = {
  getAllUsers,
  saveUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
  findUserByEmail,
};

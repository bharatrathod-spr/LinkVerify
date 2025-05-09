const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { JWT_SECRET } = require("../config/env");
const { saveActivity } = require("../services/activityService");

// Generate a JWT Token
const generateToken = (payload, expiresIn = "6h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// Hash Password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare Password
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};

// Send Email Utility
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-email-password",
    },
  });

  const mailOptions = {
    from: "no-reply@example.com",
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

// Utility to log activities
const logActivity = async (
  userId,
  activityType,
  resourceType,
  resourceId,
  method,
  details,
  by = "user"
) => {
  try {
    await saveActivity({
      UserId: userId,
      ActivityType: activityType,
      ResourceType: resourceType,
      ResourceId: resourceId,
      ActionMethod: method,
      ActivityMessage: `${activityType} ${resourceType}`,
      ActivityDetails: details,
      ActivityBy: by,
    });
  } catch (error) {
    console.error("Failed to log activity:", error.message);
  }
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  sendEmail,
  logActivity,
};

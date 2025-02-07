require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  PORT: process.env.PORT || 5000,
  DB_URI: isProduction ? process.env.DB_URI : process.env.DB_URI_DEV,
  JWT_SECRET: isProduction
    ? process.env.JWT_SECRET
    : process.env.JWT_SECRET_DEV,
};

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    UserId: {
      type: String,
      default: () => uuidv4(),
      required: true,
      unique: true,
    },

    Role: {
      type: String,
      enum: ["user", "super_user"],
      default: "user",
      required: true,
    },

    FirstName: {
      type: String,
      required: true,
    },

    LastName: {
      type: String,
      required: true,
    },

    EmailAddress: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },

    Password: {
      type: String,
      required: true,
    },

    PhoneNumber: {
      type: String,
      required: false,
    },

    UserDetails: {
      type: Object,
      required: false,
    },

    CreatedBy: {
      type: String,
      enum: ["user", "super_user"],
      default: "user",
      required: false,
    },

    IsDelete: {
      type: Boolean,
      default: false,
    },

    IsActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Adding indexes for performance
userSchema.index({ EmailAddress: 1 });
userSchema.index({ UserId: 1 });
userSchema.index({ ValidationProfileId: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ IsActive: 1, IsDelete: 1 });

module.exports = mongoose.model("User", userSchema);

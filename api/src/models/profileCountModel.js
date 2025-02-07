const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const Schema = mongoose.Schema;

const profileCountSchema = new Schema(
  {
    ProfileCountId: {
      type: String,
      default: () => uuidv4(),
      required: true,
      unique: true,
    },

    UserId: {
      type: String,
      required: true,
    },

    ValidationProfileId: {
      type: String,
      required: true,
    },

    FailureCount: {
      type: Number,
      required: false,
    },

    SuccessCount: {
      type: Number,
      required: false,
    },

    ResponseTime: {
      type: Number,
      required: false,
    },

    Date: {
      type: String,
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

profileCountSchema.index({ UserId: 1 });
profileCountSchema.index({ ValidationProfileId: 1, Date: 1 });
profileCountSchema.index({ IsActive: 1, IsDelete: 1 });
profileCountSchema.index({ FailureCount: 1 });
profileCountSchema.index({ SuccessCount: 1 });

module.exports = mongoose.model("profile-count", profileCountSchema);

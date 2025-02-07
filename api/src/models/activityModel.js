const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const userActivitiesSchema = new Schema(
  {
    ActivityId: {
      type: String,
      default: () => uuidv4(),
      required: true,
      unique: true,
    },

    UserId: {
      type: String,
      required: true,
    },

    ActivityType: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "FORGOT_PASSWORD",
        "RESET_PASSWORD",
      ],
    },

    ActionMethod: {
      type: String,
      required: true,
      enum: ["POST", "PATCH", "PUT", "DELETE"],
    },

    ActivityMessage: {
      type: String,
      required: true,
    },

    ActivityDetails: {
      OldData: { type: Object, default: null },
      NewData: { type: Object, default: null },
    },

    ResourceType: {
      type: String,
      required: true,
    },

    ResourceId: {
      type: String,
      required: true,
    },

    ActivityBy: {
      type: String,
      enum: ["user", "super_user", "cronjob"],
      default: "user",
      required: false,
    },

    IsDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Adding indexes for performance
userActivitiesSchema.index({ UserId: 1 });
userActivitiesSchema.index({ ActivityId: 1 });

module.exports = mongoose.model("user-activities", userActivitiesSchema);

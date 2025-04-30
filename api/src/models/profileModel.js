const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const Schema = mongoose.Schema;

const validationProfileSchema = new Schema(
  {
    ValidationProfileId: {
      type: String,
      default: () => uuidv4(),
      required: true,
      unique: true,
    },

    UserId: {
      type: String,
      required: true,
    },

    ProfileIndex: {
      type: Number,
      required: true,
    },

    Description: {
      type: String,
      required: false,
    },

    SourceLink: {
      type: String,
      required: true,
    },

    SearchLink: {
      type: String,
      required: true,
    },

    CronExpression: {
      type: String,
      required: true,
      default: "7 days",
    },

    LastErrorAt: {
      type: Date,
      required: false,
    },

    LastSuccessAt: {
      type: Date,
      required: false,
    },

    ValidateAt: {
      type: Date,
      required: false,
      default: () => moment().utc().startOf("minute"),
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
validationProfileSchema.index({ UserId: 1 });
validationProfileSchema.index({ IsActive: 1, IsDelete: 1 });
validationProfileSchema.index({ SourceLink: 1 });
validationProfileSchema.index({ SearchLink: 1 });
validationProfileSchema.index({ CronExpression: 1 });

module.exports = mongoose.model("validation-profiles", validationProfileSchema);

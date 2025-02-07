const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const validationLogsSchema = new Schema(
  {
    ValidationLogId: {
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

    FailureReasons: {
      type: Array,
      required: true,
    },

    ResponseTime: {
      type: Number,
      required: true,
    },

    MetaRobotsTags: {
      Follow: { type: Boolean, default: false },
      Index: { type: Boolean, default: false },
    },

    IsSuccess: {
      type: Boolean,
      default: false,
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
validationLogsSchema.index({ UserId: 1 });
validationLogsSchema.index({ ValidationProfileId: 1, IsDelete: 1 });
validationLogsSchema.index({ IsSuccess: 1, IsDelete: 1 });
validationLogsSchema.index({ createdAt: -1, IsDelete: 1 });

module.exports = mongoose.model("validation-logs", validationLogsSchema);

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;
const alertSubSchema = new Schema(
  {
    Type: {
      type: String,
      required: true,
      enum: ["email", "slack"],
      default: "email",
    },
    Subscriber: {
      type: Boolean,
      default: true,
    },
    Frequency: {
      type: String,
      enum: [
        "only_one_time",
        "per_hour",
        "per_5_hours",
        "per_day",
        "per_minute",
      ],
      default: "per_minute",
    },
    LastAlertTime: { type: Date },
  },
  { _id: false }
);

const alertSchema = new Schema(
  {
    AlertId: {
      type: String,
      default: () => uuidv4(),
      required: true,
      unique: true,
    },
    UserId: {
      type: String,
      required: true,
    },
    MailConfigurationId: {
      type: String,
    },
    Alerts: {
      type: [alertSubSchema],
      default: () => [{ Type: "email", Subscriber: true }],
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

module.exports = mongoose.model("alert-subscriptions", alertSchema);

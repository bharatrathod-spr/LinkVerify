const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;
const alertSubSchema = new Schema(
  {
    Type: {
      type: String,
      required: true,
      enum: ["email", "sms", "slack"],
      default: "email",
    },
    Subscriber: {
      type: Boolean,
      default: true,
    },
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

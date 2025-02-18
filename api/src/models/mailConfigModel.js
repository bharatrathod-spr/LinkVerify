const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const mailConfigurationSchema = new Schema(
  {
    MailConfigurationId: {
      type: String,
      default: () => uuidv4(),
      required: true,
      unique: true,
    },

    UserId: {
      type: String,
    },

    Host: { type: String, required: true },
    Port: { type: String, required: true },
    User: { type: String, required: true },
    Password: { type: String, required: true },
    Mail: { type: String, required: true },

    Secure: { type: Boolean, default: true },
    IsDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

mailConfigurationSchema.index({ UserId: 1 });
mailConfigurationSchema.index({ MailConfigurationId: 1 });

module.exports = mongoose.model("Mail-Configuration", mailConfigurationSchema);

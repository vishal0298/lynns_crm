const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSettingsSchema = new mongoose.Schema(
  {
    provider_type: {
      type: Schema.Types.String,
      required: true,
    },
    nodeFromName: {
      type: Schema.Types.String,
      required: false,
    },
    nodeFromEmail: {
      type: Schema.Types.String,
      required: false,
    },
    nodeHost: {
      type: Schema.Types.String,
      required: false,
    },
    nodePort: {
      type: Schema.Types.String,
      required: false,
    },
    nodeUsername: {
      type: Schema.Types.String,
      required: false,
    },
    nodePassword: {
      type: Schema.Types.String,
      required: false,
    },
    smtpFromName: {
      type: Schema.Types.String,
      required: false,
    },
    smtpFromEmail: {
      type: Schema.Types.String,
      required: false,
    },
    smtpHost: {
      type: Schema.Types.String,
      required: false,
    },
    smtpPort: {
      type: Schema.Types.String,
      required: false,
    },
    smtpUsername: {
      type: Schema.Types.String,
      required: false,
    },
    smtpPassword: {
      type: Schema.Types.String,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("emailsettings", emailSettingsSchema);

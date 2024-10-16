const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySettingSchema = new mongoose.Schema(
  {
    companyName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    phone: {
      type: Schema.Types.String,
      required: true,
    },
    addressLine1: {
      type: Schema.Types.String,
      required: true,
    },
    addressLine2: {
      type: Schema.Types.String,
      required: false,
    },
    city: {
      type: Schema.Types.String,
      required: true,
    },
    state: {
      type: Schema.Types.String,
      required: true,
    },
    country: {
      type: Schema.Types.String,
      required: true,
    },
    pincode: {
      type: Schema.Types.String,
      required: true,
    },
    siteLogo: {
      type: Schema.Types.String,
      required: false,
    },
    favicon: {
      type: Schema.Types.String,
      required: false,
    },
    companyLogo: {
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

module.exports = mongoose.model("companysettings", companySettingSchema);

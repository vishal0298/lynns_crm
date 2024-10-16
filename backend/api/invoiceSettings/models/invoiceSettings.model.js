const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSettingSchema = new mongoose.Schema(
  {
    invoicePrefix: {
      type: Schema.Types.String,
      required: true,
    },
    invoiceLogo: {
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
module.exports = mongoose.model("invoicesettings", invoiceSettingSchema);

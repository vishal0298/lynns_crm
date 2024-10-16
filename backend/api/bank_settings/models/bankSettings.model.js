const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSetting = new mongoose.Schema(
  {
    name: { type: Schema.Types.String, required: true },
    bankName: { type: Schema.Types.String, required: false },
    branch: { type: Schema.Types.String, required: true },
    accountNumber: { type: Schema.Types.String, required: true },
    IFSCCode: { type: Schema.Types.String, required: true },
    isDeleted: { type: Schema.Types.Boolean, required: true, default: false },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bankSettingModel = mongoose.model("banksettings", bankSetting);
module.exports = bankSettingModel;
